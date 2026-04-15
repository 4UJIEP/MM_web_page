import type { FC } from 'react';
import { useState } from 'react';
import styles from './CabinetSchedule.module.css';
import { MonthPicker } from '../../components/ui/MonthPicker';
import { LessonModal } from '../../components/ui/LessonModal';

import locationIcon from '../../assets/icons/location.png';
import arrowDownIcon from '../../assets/icons/angle-down.png';

// ============================================
// TYPES
// ============================================

interface Lesson {
  id: string;
  courseName: string;
  classLabel: string;
  date: string;
  time: string;
  teacher: string;
  location: string;
}

interface DayData {
  day: Date;
  lessons: Lesson[];
}

// ============================================
// HELPERS
// ============================================

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const;

const MONTH_NAMES_SHORT = [
  'Январь', 'Февраль', 'Март', 'Апрель',
  'Май', 'Июнь', 'Июль', 'Август',
  'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

/**
 * Возвращает дату понедельника для недели, содержащей date.
 * getDay(): 0=Вс, 1=Пн, ..., 6=Сб
 * Формула: если Вс → сдвиг -6, иначе → 1 - dow
 */
function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const dow = d.getDay(); // 0=Вс
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Возвращает 7 объектов Date — Пн..Вс */
function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isToday(date: Date): boolean {
  const t = new Date();
  return (
    date.getDate() === t.getDate() &&
    date.getMonth() === t.getMonth() &&
    date.getFullYear() === t.getFullYear()
  );
}

function getWeekLabel(monday: Date): string {
  const thisMonday = getMondayOf(new Date());
  const diff = Math.round(
    (monday.getTime() - thisMonday.getTime()) / (7 * 24 * 3600 * 1000)
  );
  if (diff === 0) return 'Текущая неделя';
  if (diff === 1) return 'Следующая неделя';
  if (diff === -1) return 'Прошлая неделя';
  const sunday = new Date(monday.getTime() + 6 * 86400000);
  return `${monday.getDate()} – ${sunday.getDate()} ${MONTH_NAMES_SHORT[monday.getMonth()]}`;
}

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// ============================================
// MOCK DATA
// TODO: заменить на fetchScheduleForWeek(monday)
// ============================================

const MOCK_LESSONS: Record<string, Lesson[]> = {
  '2026-04-12': [
    {
      id: '1',
      courseName: 'Математика',
      classLabel: '9 класс',
      date: '12 апреля, 2026',
      time: '10:00',
      teacher: 'Гарцева Карина Александровна',
      location: 'Главный корпус, ул. Фрунзе, 6',
    },
    {
      id: '2',
      courseName: 'Шахматы',
      classLabel: '9 класс',
      date: '12 апреля, 2026',
      time: '13:00',
      teacher: 'Фаткудинов Владислав Константинович',
      location: 'Главный корпус, ул. Фрунзе, 6',
    },
  ],
};

// ============================================
// SUB-COMPONENTS
// ============================================

interface LessonCardProps {
  lesson: Lesson;
  onOpen: (lessonId: string) => void;
}

const LessonCard: FC<LessonCardProps> = ({ lesson, onOpen }) => (
  // Клик открывает модалку с деталями — id урока передаём наверх
  <div
    className={styles.lessonCard}
    onClick={() => onOpen(lesson.id)}
    role="button"
    tabIndex={0}
    aria-label={`Открыть подробности: ${lesson.courseName}`}
    onKeyDown={(e) => e.key === 'Enter' && onOpen(lesson.id)}
  >
    <div className={styles.lessonMeta}>
      <span className={styles.lessonClass}>{lesson.classLabel}</span>
      <span className={styles.lessonDot}>·</span>
      <span className={styles.lessonDateTime}>{lesson.date}, {lesson.time}</span>
    </div>
    <p className={styles.lessonTeacher}>{lesson.teacher}</p>
    <div className={styles.lessonLocation}>
      <img src={locationIcon} alt="" className={styles.locationIcon} />
      <span className={styles.locationText}>{lesson.location}</span>
    </div>
  </div>
);

interface DayColumnProps {
  dayName: string;
  data: DayData;
  onOpenLesson: (lessonId: string) => void;
}

const DayColumn: FC<DayColumnProps> = ({ dayName, data, onOpenLesson }) => {
  const today = isToday(data.day);
  return (
    <div className={`${styles.dayColumn} ${today ? styles.dayColumnToday : ''}`}>
      <div className={styles.dayHeader}>
        <span className={styles.dayName}>{dayName}</span>
        <span className={`${styles.dayNumber} ${today ? styles.dayNumberToday : ''}`}>
          {data.day.getDate()}
        </span>
      </div>
      <div className={styles.dayContent}>
        {data.lessons.map((lesson) => (
          <div key={lesson.id} className={styles.lessonGroup}>
            <p className={styles.courseLabel}>{lesson.courseName}</p>
            <LessonCard lesson={lesson} onOpen={onOpenLesson} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export const CabinetSchedule: FC = () => {
  const [monday, setMonday] = useState<Date>(() => getMondayOf(new Date()));

  // null = модалка закрыта, string = id открытого урока
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);

  const weekDays = getWeekDays(monday);
  const weekData: DayData[] = weekDays.map((day) => ({
    day,
    lessons: MOCK_LESSONS[getDateKey(day)] ?? [],
  }));

  const goToPrevWeek = () => {
    setMonday(prev => {
      const d = new Date(prev);
      d.setDate(prev.getDate() - 7);
      return d;
    });
  };

  const goToNextWeek = () => {
    setMonday(prev => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + 7);
      return d;
    });
  };

  const handleDatePicked = (pickedDate: Date) => {
    setMonday(getMondayOf(pickedDate));
  };


  return (
    <section className={styles.section}>
      <div className={styles.container}>

        <h1 className={styles.title}>Расписание</h1>
        <hr className={styles.divider} />

        <div className={styles.controls}>
          <MonthPicker
            month={monday.getMonth()}
            year={monday.getFullYear()}
            onChange={handleDatePicked}
          />

          <div className={styles.weekNav}>
            <button
              className={styles.arrowButton}
              onClick={goToPrevWeek}
              aria-label="Предыдущая неделя"
            >
              <img
                src={arrowDownIcon}
                alt=""
                className={`${styles.arrowIcon} ${styles.arrowLeft}`}
              />
            </button>

            <span className={styles.weekLabel}>{getWeekLabel(monday)}</span>

            <button
              className={styles.arrowButton}
              onClick={goToNextWeek}
              aria-label="Следующая неделя"
            >
              <img
                src={arrowDownIcon}
                alt=""
                className={`${styles.arrowIcon} ${styles.arrowRight}`}
              />
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          {DAY_NAMES.map((day, index) => (
            <DayColumn
              key={day}
              dayName={day}
              data={weekData[index]}
              onOpenLesson={setOpenLessonId}
            />
          ))}
        </div>

      </div>

      {/* Модалка с деталями урока — монтируется вне grid, чтобы не обрезалась */}
      <LessonModal
        lessonId={openLessonId}
        onClose={() => setOpenLessonId(null)}
      />

    </section>
  );
};
