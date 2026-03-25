import type { FC } from 'react';
import type { Teacher } from '../../../types/teacher';
import styles from './TeacherCard.module.css';

import starIcon from '../../../assets/icons/star.png';

interface TeacherCardProps extends Teacher {
  /** Обработчик клика на кнопку "Курсы преподавателя" */
  onCoursesClick?: () => void;
}

export const TeacherCard: FC<TeacherCardProps> = ({
  lastName,
  firstName,
  middleName,
  photo,
  achievements,
  onCoursesClick,
}) => {
  // Формируем полное имя
  const fullName = `${firstName} ${middleName}\n${lastName}`;

  return (
    <div className={styles.card}>
      
      {/* Внутренний контейнер */}
      <div className={styles.container}>
        
        {/* ВЕРХНЯЯ ЧАСТЬ - Имя, фото, звания */}
        <div className={styles.topSection}>
          
          {/* Блок: ФИО + Фото */}
          <div className={styles.namePhotoBlock}>
            
            {/* ФИО */}
            <h3 className={styles.name}>{fullName}</h3>
            
            {/* Фотография */}
            <div className={styles.photoWrapper}>
              <img 
                src={photo} 
                alt={`${firstName} ${lastName}`} 
                className={styles.photo}
              />
            </div>
            
          </div>
          
          {/* Звания и достижения */}
          <div className={styles.achievements}>
            {achievements.map((achievement, index) => (
              <div key={index} className={styles.achievementItem}>
                {/* Иконка звёздочки */}
                <img 
                  src={starIcon} 
                  alt="" 
                  className={styles.starIcon}
                />
                {/* Текст звания */}
                <span className={styles.achievementText}>
                  {achievement}
                </span>
              </div>
            ))}
          </div>
          
        </div>
        
        {/* КНОПКА "Курсы преподавателя" */}
        <button 
          className={styles.coursesButton}
          onClick={onCoursesClick}
        >
          Курсы преподавателя
        </button>
        
      </div>
      
    </div>
  );
};