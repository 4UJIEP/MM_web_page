import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CabinetProfile.module.css';
import { useAuth } from '../../context/AuthContext';
import type { ChildInfo } from '../../context/AuthContext';

import arrowDownIcon from '../../assets/icons/angle-down.png';

// ============================================
// MOCK DATA
// TODO: заменить на данные из API /api/cabinet/profile
// ============================================

interface CourseEnrollment {
  id: string;
  title: string;
  classLabel: string;
}

const MOCK_COURSES: CourseEnrollment[] = [
  { id: '1', title: 'Математика', classLabel: '9 класс' },
  { id: '2', title: 'Шахматы', classLabel: '9 класс' },
];

// ============================================
// SUB-COMPONENTS
// ============================================

const CourseRow: FC<{ course: CourseEnrollment }> = ({ course }) => (
  <div className={styles.courseRow}>
    <span className={styles.courseText}>
      {course.title} | {course.classLabel}
    </span>
    <img src={arrowDownIcon} alt="" className={styles.courseArrow} />
  </div>
);

// Карточка ребёнка для родителя
const ChildRow: FC<{ child: ChildInfo }> = ({ child }) => (
  <div className={styles.courseRow}>
    {/* Аватарка ребёнка-заглушка */}
    <div className={styles.childAvatar}>
      {child.name[0]}
    </div>
    <span className={styles.courseText}>{child.name}</span>
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
            <div className={styles.parentSections}>

              {/* Курсы ребёнка */}
              <div className={styles.section_inner}>
                <h2 className={styles.coursesTitle}>Курсы</h2>
                <div className={styles.coursesList}>
                  {MOCK_COURSES.map((course) => (
                    <CourseRow key={course.id} course={course} />
                  ))}
                </div>
              </div>

              {/* Дети */}
              {user?.children && user.children.length > 0 && (
                <div className={styles.section_inner}>
                  <h2 className={styles.coursesTitle}>
                    {user.children.length === 1 ? 'Ребёнок' : 'Дети'}
                  </h2>
                  <div className={styles.coursesList}>
                    {user.children.map((child) => (
                      <ChildRow key={child.id} child={child} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Для ребёнка — только курсы */
            <>
              <h2 className={styles.coursesTitle}>Курсы</h2>
              <div className={styles.coursesList}>
                {MOCK_COURSES.map((course) => (
                  <CourseRow key={course.id} course={course} />
                ))}
              </div>
            </>
          )}

        </div>

        <hr className={styles.divider} />

      </div>
    </section>
  );
};