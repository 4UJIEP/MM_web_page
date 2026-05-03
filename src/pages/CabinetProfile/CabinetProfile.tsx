import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CabinetProfile.module.css';
import { useAuth } from '../../context/AuthContext';
import type { ChildInfo } from '../../context/AuthContext';

import arrowDownIcon from '../../assets/icons/angle-down-icon.png';
import arrowRightIcon from '../../assets/icons/angle-down.png';
import folder from '../../assets/icons/folder.png';
import radio from '../../assets/icons/pointIcon.png';
import radioEmpty from '../../assets/icons/pointIconEmpty.png';

// ============================================
// MOCK DATA
// TODO: заменить на данные из API /api/cabinet/profile
// ============================================

interface CourseEnrollment {
  id: string;
  childId: string;          // к какому ребёнку привязан курс
  subject: string;          // «Математика»
  classLabel: string;       // «9 класс»
  schedule: string;         // «Вс, 10:00 - 12:00»
  location: string;         // «Главный корпус, ул. Фрунзе, 6, ауд. 205»
  teacher: string;          // «Гарцева Карина Александровна»
  teacherPhone: string;     // «+7 (999)-999-99-99»
}

const MOCK_COURSES: CourseEnrollment[] = [
  { id: '1', childId: 'child-1', subject: 'Математика', classLabel: '9 класс', schedule: 'Вс, 10:00 - 12:00', location: 'Главный корпус, ул. Фрунзе, 6, ауд. 205', teacher: 'Гарцева Карина Александровна', teacherPhone: '+7 (999)-999-99-99' },
  { id: '2', childId: 'child-1', subject: 'Куборо', classLabel: '9 класс', schedule: 'Сб, 13:00 - 15:00', location: 'Главный корпус, ул. Фрунзе, 6, ауд. 205', teacher: 'Иван Иванович Сидоров', teacherPhone: '+7 (999)-999-99-99' },
  { id: '3', childId: 'child-2', subject: 'Шахматы', classLabel: '3 класс', schedule: 'Сб, 10:00 - 11:30', location: 'Главный корпус, ул. Фрунзе, 6, ауд. 205', teacher: 'Карелина Раиса Олеговна', teacherPhone: '+7 (999)-999-99-99' },
];

// ============================================
// SUB-COMPONENTS
// ============================================

// ── Переключатель детей ──────────────────────
// Figma: w:276 h:57 radius:16 gap:8
// Активная кнопка: bg:#BCDFFF radius:10
// Неактивная: bg:#F5F7FA radius:10
interface ChildSwitcherProps {
  children: ChildInfo[];
  activeId: string;
  onSelect: (id: string) => void;
}

const ChildSwitcher: FC<ChildSwitcherProps> = ({ children, activeId, onSelect }) => (
  <div className={styles.switcher}>
    {children.map((child) => (
      <button
        key={child.id}
        className={`${styles.switcherBtn} ${child.id === activeId ? styles.switcherBtnActive : styles.switcherBtnInactive}`}
        onClick={() => onSelect(child.id)}
        aria-pressed={child.id === activeId}
      >
        {/* Аватарка 26×26 */}
        <div className={styles.switcherAvatar}>
          {child.name[0]}
        </div>
        <span className={styles.switcherName}>{child.name}</span>
      </button>
    ))}
  </div>
);

// ── Карточка одного курса ────────────────────
// Figma: w:1472 h:124 radius:16 bg:#FFFFFF
// Внутри: w:1413 h:87 justify-content:space-between
interface CourseCardProps {
  course: CourseEnrollment;
  childName?: string;
  onJournal: () => void;
}

const CourseCard: FC<CourseCardProps> = ({ course, onJournal }) => (
  <div className={styles.courseCard}>
    <div className={styles.courseCardInner}>
      {/* Левая часть — название + 4 строки деталей */}
      <div className={styles.courseCardLeft}>
        {/* Заголовок: «Математика  9 класс» */}
        <div className={styles.courseCardTitle}>
          <span className={styles.courseSubject}>{course.subject}</span>
          <span className={styles.courseClass}>{course.classLabel}</span>
        </div>
        {/* Детали курса */}
        <div className={styles.courseDetails}>
          <div className={styles.courseDetailRow}>
            <span className={styles.courseDetailLabel}>ФИО преподавателя</span>
            <span className={styles.courseDetailValue}>{course.teacher}</span>
          </div>
          <div className={styles.courseDetailRow}>
            <span className={styles.courseDetailLabel}>Номер телефона преподавателя</span>
            <span className={styles.courseDetailValue}>{course.teacherPhone}</span>
          </div>
          <div className={styles.courseDetailRow}>
            <span className={styles.courseDetailLabel}>Место проведения</span>
            <span className={styles.courseDetailValue}>{course.location}</span>
          </div>
          <div className={styles.courseDetailRow}>
            <span className={styles.courseDetailLabel}>День и время проведения</span>
            <span className={styles.courseDetailValue}>{course.schedule}</span>
          </div>
        </div>
      </div>
      {/* Кнопка «Перейти в журнал» */}
      <button className={styles.journalLink} onClick={onJournal}>
        Перейти в журнал
        <img src={arrowRightIcon} alt="" className={styles.journalArrow} aria-hidden="true" />
      </button>
    </div>
  </div>
);

// Старая строка курса (для роли «ребёнок»)
const CourseRow: FC<{ course: CourseEnrollment }> = ({ course }) => (
  <div className={styles.courseRow}>
    <img src={folder} alt="" className={styles.folderCourse} />
    <span className={styles.courseText}>
      {course.subject} | {course.classLabel}
    </span>
    <img src={arrowDownIcon} alt="" className={styles.courseArrow} />
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export const CabinetProfile: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isParent = user?.role === 'parent';

  // Активный ребёнок в переключателе (первый по умолчанию)
  const firstChildId = user?.children?.[0]?.id ?? '';
  const [activeChildId, setActiveChildId] = useState(firstChildId);

  // Курсы активного ребёнка
  const activeCourses = MOCK_COURSES.filter((c) => c.childId === activeChildId);
  const activeChild = user?.children?.find((c) => c.id === activeChildId);

  const fullName = user
    ? `${user.name} ${user.surname} ${user.patronymic}`.trim()
    : 'Василий Пупкин Мупкин';

  const initials = user
    ? `${user.name[0]}${user.surname[0]}`
    : 'ВП';

  const phone = user?.phone ?? '+7 904 076 94 72';

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* ── Заголовок «Профиль» ──────────────────────── */}
        <h1 className={styles.title}>Профиль</h1>
        <hr className={styles.divider} />

        {/* ── Блок аватарка + ФИО + телефон ───────────── */}
        <div className={styles.infoBlock}>

          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={fullName} className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>{initials}</div>
          )}

          <div className={styles.userInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>ФИО:</span>
              <span className={styles.infoValueName}>{fullName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Номер телефона:</span>
              <span className={styles.infoValue}>{phone}</span>
            </div>
          </div>

        </div>

        <hr className={styles.divider} />

        {/* ── Блок курсов / детей ──────────────────────── */}
        <div className={styles.coursesBlock}>

          {/* Для родителя — две секции: Курсы и Дети */}
          {isParent ? (
            /* ── Родитель: переключатель детей + карточки курсов ── */
            <div className={styles.parentSections}>

              {/* Заголовок + переключатель */}
              <div className={styles.coursesHeader}>
                <h2 className={styles.coursesTitle}>Курсы</h2>
                {user?.children && user.children.length > 0 && (
                  <ChildSwitcher
                    children={user.children}
                    activeId={activeChildId}
                    onSelect={setActiveChildId}
                  />
                )}
              </div>

              {/* Карточки курсов активного ребёнка */}
              <div className={styles.courseCardsList}>
                {activeCourses.length > 0 ? (
                  activeCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onJournal={() => navigate('/cabinet/journal')}
                    />
                  ))
                ) : (
                  <p className={styles.emptyCourses}>Курсы не найдены</p>
                )}
              </div>

            </div>
          ) : (
            /* ── Ребёнок: собственные курсы, переключатель не нужен ── */
            <div className={styles.parentSections}>
              <h2 className={styles.coursesTitle}>Курсы</h2>
              <div className={styles.courseCardsList}>
                {MOCK_COURSES.filter((c) => c.childId === 'child-1').length > 0 ? (
                  MOCK_COURSES.filter((c) => c.childId === 'child-1').map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      childName={user?.name ?? ''}
                      onJournal={() => navigate('/cabinet/journal')}
                    />
                  ))
                ) : (
                  <p className={styles.emptyCourses}>Курсы не найдены</p>
                )}
              </div>
            </div>
          )}

        </div>

        <hr className={styles.divider} />

      </div>
    </section>
  );
};