import type { FC } from 'react';
import type { Course } from '../../../types/course';
import { useNavigate } from 'react-router-dom';
import styles from './CourseCard.module.css';

import clockIcon from '../../../assets/icons/clock.png';
import calendarIcon from '../../../assets/icons/icon.png';
import dollarIcon from '../../../assets/icons/dollar.png';

interface CourseCardProps extends Course {
  onDetailsClick?: () => void;
  onEnrollClick?: () => void;
}

export const CourseCard: FC<CourseCardProps> = ({
  id,
  slug,
  title,
  badge,
  badgeColor,
  duration,
  difficulty,
  lessonsCount,
  image,
  onDetailsClick,
  onEnrollClick,
}) => {
  const navigate = useNavigate(); // Хук для навигации

  const handleDetailsClick = () => {
    navigate(`/course/${slug}`); // Переход на страницу курса
  };
  return (
    <div className={styles.card}>
      
      {/* ЛЕВАЯ ЧАСТЬ - Изображение (248×211) */}
      <div className={styles.imageWrapper}>
        <img 
          src={image} 
          alt={title} 
          className={styles.image}
        />
      </div>
      
      {/* ПРАВАЯ ЧАСТЬ - Информация (456×211) */}
      <div className={styles.info}>
        
        {/* Заголовок: название + бейдж (357×58) */}
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <span 
            className={styles.badge}
            style={{ background: badgeColor }}
          >
            {badge}
          </span>
        </div>
        
        {/* ========================================
            СТАТИСТИКА - внешний контейнер (456×64)
            ======================================== */}
        <div className={styles.statsWrapper}>
          
          {/* Внутренний контейнер (244×64) */}
          <div className={styles.stats}>
            
            {/* ЛЕВАЯ КОЛОНКА - время и занятия (119×64) */}
            <div className={styles.statsLeft}>
              
              {/* Время (82×24) */}
              <div className={styles.statItem}>
                <img 
                  src={clockIcon} 
                  alt="" 
                  className={styles.statIcon}
                />
                <span className={styles.statText}>{duration}</span>
              </div>
              
              {/* Занятия (119×24) */}
              <div className={styles.statItem}>
                <img 
                  src={calendarIcon} 
                  alt="" 
                  className={styles.statIcon}
                />
                <span className={styles.statText}>{lessonsCount} занятия</span>
              </div>
              
            </div>
            
            {/* ПРАВАЯ КОЛОНКА - стоимость (93×64) */}
            <div className={styles.statsRight}>
              
              {/* Стоимость (93×24) */}
              <div className={styles.statItem}>
                <img 
                  src={dollarIcon} 
                  alt="" 
                  className={styles.statIcon}
                />
                <span className={styles.statText}>{difficulty}</span>
              </div>
              
            </div>
            
          </div>
          
        </div>
        
        {/* Кнопки действий (294×42) */}
        <div className={styles.buttons}>
          <button 
            className={styles.btnDetails}
            onClick={handleDetailsClick}
          >
            Подробнее
          </button>
          
          <button 
            className={styles.btnEnroll}
            onClick={onEnrollClick}
          >
            Записаться
          </button>
        </div>
        
      </div>
      
    </div>
  );
};