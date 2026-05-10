import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CabinetSchedule.module.css';
import { useAuth } from '../../context/AuthContext';
import { MonthPicker } from '../../components/ui/MonthPicker';
import { LessonModal } from '../../components/ui/LessonModal';

import locationIcon from '../../assets/icons/location.png';
import arrowDownIcon from '../../assets/icons/angle-down.png';

// ============================================
// TYPES — не меняем, как и было
// ============================================

interface Lesson {
  id: string;
  courseName: string;
  classLabel: string;
  date: string;
  time: string;
  timeEnd?: string;         // «12:00» — для отображения диапазона
  teacher: string;
  location: string;
  /** Имя ребёнка — заполняется только для родителя */
  childName?: string;
  /** Число учеников в группе — только для преподавателя */
  studentsCount?: number;
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

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const dow = d.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

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
  '2026-03-13': [
    { id: '1', courseName: 'Математика', classLabel: '9 класс', date: '13 марта, 2026', time: '10:00', timeEnd: '12:00', teacher: 'Гарцева Карина Александровна', location: 'Главный корпус, ул. Фрунзе, 6', childName: 'Вася' },
    { id: '2', courseName: 'Шахматы', classLabel: '9 класс', date: '13 марта, 2026', time: '13:00', timeEnd: '15:00', teacher: 'Фаткудинов Владислав Константинович', location: 'Главный корпус, ул. Фрунзе, 6', childName: 'Вася' },
  ],
};

// Mock-данные для роли преподавателя
// TODO: заменить на GET /api/teacher/schedule?week=YYYY-MM-DD
const MOCK_TEACHER_LESSONS: Record<string, Lesson[]> = {
  '2026-03-12': [
    { id: 't1', courseName: 'Куборо', classLabel: '9 класс', date: '12 марта, 2026', time: '10:00', timeEnd: '12:00', teacher: 'Гарцева Карина Александровна', location: 'Главный корпус, ул. Фрунзе, 6', studentsCount: 11 },
    { id: 't2', courseName: 'Математика', classLabel: '8 класс', date: '12 марта, 2026', time: '13:00', timeEnd: '15:00', teacher: 'Гарцева Карина Александровна', location: 'Главный корпус, ул. Фрунзе, 6', studentsCount: 12 },
    { id: 't3', courseName: 'Шахматы', classLabel: '8 класс', date: '12 марта, 2026', time: '15:30', timeEnd: '17:30', teacher: 'Гарцева Карина Александровна', location: 'Главный корпус, ул. Фрунзе, 6', studentsCount: 7 },
  ],
  '2026-03-13': [
    { id: 't4', courseName: 'Математика', classLabel: '9 класс', date: '13 марта, 2026', time: '10:00', timeEnd: '12:00', teacher: 'Гарцева Карина Александровна', location: 'Главный корпус, ул. Фрунзе, 6', studentsCount: 25 },
    { id: 't5', courseName: 'Шахматы', classLabel: '6 класс', date: '13 марта, 2026', time: '14:00', timeEnd: '16:00', teacher: 'Гарцева Карина Александровна', location: 'Главный корпус, ул. Фрунзе, 6', studentsCount: 5 },
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
  <div
    className={styles.lessonCard}
    onClick={() => onOpen(lesson.id)}
    role="button"
    tabIndex={0}
    aria-label={`Открыть подробности: ${lesson.courseName}`}
    onKeyDown={(e) => e.key === 'Enter' && onOpen(lesson.id)}
  >
    {/* Строка 1: «Курс | Класс» */}
    <p className={styles.lessonCourseName}>
      {lesson.courseName}
      <span className={styles.lessonDot}> | </span>
      {lesson.classLabel}
    </p>
    {/* Строка 2: дата и время */}
    <div className={styles.lessonMeta}>
      <span className={styles.lessonDateTime}>
        {lesson.date}, {lesson.time}{lesson.timeEnd ? ` - ${lesson.timeEnd}` : ''}
      </span>
    </div>
    {/* Строка 3: число учеников (только для преподавателя) */}
    {lesson.studentsCount !== undefined && (
      <p className={styles.lessonStudents}>{lesson.studentsCount} учеников</p>
    )}
    {/* Строка 4: место */}
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
  isParent: boolean;
  isTeacher: boolean;
}

const DayColumn: FC<DayColumnProps> = ({ dayName, data, onOpenLesson, isParent, isTeacher }) => {
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
            {/* Для родителя — имя ребёнка, для ребёнка/учителя — название курса */}
            {!isTeacher && (
              <p className={styles.courseLabel}>
                {isParent ? (lesson.childName ?? lesson.courseName) : lesson.courseName}
              </p>
            )}
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
  const { user } = useAuth();
  const isParent = user?.role === 'parent';
  const isTeacher = user?.role === 'teacher';

  const [monday, setMonday] = useState<Date>(() => getMondayOf(new Date()));

  // null = модалка закрыта, string = id открытого урока
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);

  // Преподаватель видит свои занятия с числом учеников
  const lessonSource = isTeacher ? MOCK_TEACHER_LESSONS : MOCK_LESSONS;

  const weekDays = getWeekDays(monday);
  const weekData: DayData[] = weekDays.map((day) => ({
    day,
    lessons: lessonSource[getDateKey(day)] ?? [],
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
            selectedDate={monday}
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
              isParent={isParent}
              isTeacher={isTeacher}
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