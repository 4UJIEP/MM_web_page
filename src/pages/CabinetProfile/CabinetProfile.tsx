import type { FC } from 'react';
import styles from './CabinetProfile.module.css';
import { useAuth } from '../../context/AuthContext';

import { useNavigate } from 'react-router-dom';

import arrowDownIcon from '../../assets/icons/angle-down.png';

//----------
// потом заменяться на данные из api
//----------
interface CourseEnrollment {
    id: string;
    title: string;
    classLabel: string;
}

const MOCK_COURSES: CourseEnrollment[] = [
    { id: '1', title: 'Математика', classLabel: '9 класс' },
    { id: '2', title: 'Шахматы', classLabel: '9 класс' },
];

interface CourseRowProps {
    course: CourseEnrollment;
}

const CourseRow: FC<CourseRowProps> = ({ course }) => (
    <div className={styles.courseRow}>
        <span className={styles.courseText}>
            {course.title} | {course.classLabel}
        </span>
        <img
            src={arrowDownIcon}
            alt=""
            className={styles.courseArrow}
        />
    </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
 
export const CabinetProfile: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
 
  const handleLogout = () => {
    logout();
    navigate('/');
  };
 
  const fullName = user
    ? `${user.name} ${user.surname} ${user.patronymic}`
    : 'Василий Пупкин Мупкин';
 
  // Инициалы для аватарки-заглушки
  const initials = user
    ? `${user.name[0]}${user.surname[0]}`
    : 'ВП';
 
  // phone брать из user.phone когда появится в AuthUser
  const phone = '+7 904 076 94 72';
 
  return (
    <section className={styles.section}>
      <div className={styles.container}>
 
        {/* ── Заголовок «Профиль» ──────── */}
        <h1 className={styles.title}>Профиль</h1>
 
        {/* ── Разделитель 1 ────────────── */}
        <hr className={styles.divider} />
 
        {/* ── Блок аватарка + ФИО + телефон ─────────────── */}
        <div className={styles.infoBlock}>
 
          {/* Аватарка */}
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={fullName}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {initials}
            </div>
          )}
 
          {/* Данные пользователя  */}
          <div className={styles.userInfo}>
 
            {/* ФИО  */}
            <div className={styles.infoRow}>
              {/* «ФИО:» — w:82 h:38 Roboto 600 32px #21242B */}
              <span className={styles.infoLabel}>ФИО:</span>
              {/* Имя — w:390 h:38 Roboto 600 32px #333 */}
              <span className={styles.infoValueName}>{fullName}</span>
            </div>
 
            {/* Телефон — w:555 h:38 gap:15 */}
            <div className={styles.infoRow}>
              {/* «Номер телефона:» — w:275 h:38 Roboto 600 32px #21242B */}
              <span className={styles.infoLabel}>Номер телефона:</span>
              {/* Номер — w:265 h:38 Roboto 600 32px #21242B */}
              <span className={styles.infoValue}>{phone}</span>
            </div>
 
          </div>
        </div>
 
        {/* ── Разделитель 2 — top:321 left:65 ───────────── */}
        <hr className={styles.divider} />
 
        {/* ── Блок курсов — top:337 left:64 w:239 h:122 gap:32 */}
        <div className={styles.coursesBlock}>
 
          {/* «Курсы» — w:239 h:28 Roboto 500 24px #21242B */}
          <h2 className={styles.coursesTitle}>Курсы</h2>
 
          {/* Список курсов — w:239 h:62 gap:16 */}
          <div className={styles.coursesList}>
            {MOCK_COURSES.map((course) => (
              <CourseRow key={course.id} course={course} />
            ))}
          </div>
 
        </div>
 
        {/* ── Разделитель 3 — top:478 left:64 ───────────── */}
        <hr className={styles.divider} />
 
      </div>
    </section>
  );
};
 