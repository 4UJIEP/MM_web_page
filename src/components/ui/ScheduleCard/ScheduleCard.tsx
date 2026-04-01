import type { FC } from 'react';
import styles from './ScheduleCard.module.css';

// Импорт иконок
import clockIcon from '../../../assets/icons/clock.png';
import locationIcon from '../../../assets/icons/location.png';

interface ScheduleCardProps {
  /** Класс */
  className: string;
  
  /** ФИО преподавателя */
  teacher: string;
  
  /** День и время */
  schedule: string;
  
  /** Место проведения */
  location: string;
  
  /** Дата начала занятий */
  startDate: string;
}

export const ScheduleCard: FC<ScheduleCardProps> = ({
  className,
  teacher,
  schedule,
  location,
  startDate,
}) => {
  return (
    <div className={styles.card}>
      
      {/* Контейнер: Класс, преподаватель, время, место */}
      <div className={styles.infoContainer}>
        
        {/* Класс */}
        <div className={styles.classText}>{className}</div>
        
        {/* Преподаватель + Время */}
        <div className={styles.teacherScheduleContainer}>
          
          {/* ФИО преподавателя */}
          <div className={styles.teacherName}>{teacher}</div>
          
          {/* Время */}
          <div className={styles.scheduleTime}>
            <img src={clockIcon} alt="" className={styles.timeIcon} />
            <span className={styles.timeText}>{schedule}</span>
          </div>
          
        </div>
        
        {/* Место проведения */}
        <div className={styles.locationContainer}>
          <img src={locationIcon} alt="" className={styles.locationIcon} />
          <span className={styles.locationText}>{location}</span>
        </div>
        
      </div>
      
      {/* Начало занятий */}
      <div className={styles.startDate}>
        Начало занятий — {startDate}
      </div>
      
    </div>
  );
};