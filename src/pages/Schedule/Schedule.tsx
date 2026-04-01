import type { FC } from 'react';
import { useState } from 'react';
import styles from './Schedule.module.css';

import searchIcon from '../../assets/icons/Search.png';
import classIcon from '../../assets/icons/graduation.png';
import teacherIcon from '../../assets/icons/person.png';
import arrowDownIcon from '../../assets/icons/angle-down.png';
import { CategoryBlock } from '../../components/CategoryBlock';

const mathematicsSchedule = [
  {
    id: '1',
    className: '1 класс',
    teacher: 'Фаткудинов Владислав Константинович',
    schedule: 'Воскресенье, 9:40',
    location: 'Главный корпус, ул. Фрунзе, 6, ауд. 205',
    startDate: '12 октября',
  },
  {
    id: '2',
    className: '1 класс',
    teacher: 'Фаткудинов Владислав Константинович',
    schedule: 'Воскресенье, 9:40',
    location: 'Главный корпус, ул. Фрунзе, 6, ауд. 205',
    startDate: '12 октября',
  },
  {
    id: '3',
    className: '1 класс',
    teacher: 'Фаткудинов Владислав Константинович',
    schedule: 'Воскресенье, 9:40',
    location: 'Главный корпус, ул. Фрунзе, 6, ауд. 205',
    startDate: '12 октября',
  },
  {
    id: '4',
    className: '1 класс',
    teacher: 'Фаткудинов Владислав Константинович',
    schedule: 'Воскресенье, 9:40',
    location: 'Главный корпус, ул. Фрунзе, 6, ауд. 205',
    startDate: '12 октября',
  },
  {
    id: '5',
    className: '1 класс',
    teacher: 'Фаткудинов Владислав Константинович',
    schedule: 'Воскресенье, 9:40',
    location: 'Главный корпус, ул. Фрунзе, 6, ауд. 205',
    startDate: '12 октября',
  },
];

export const Schedule: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isClassDropdowmOpen, setIsClassDropdownOpen] = useState(false);
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);

  return (
    <section className={styles.schedulePage}>
      <h1 className={styles.pageTitle}>
        Расписание занятий на 2025-2026 год
      </h1>
      
      <div className={styles.contentWrapper}>
        {/* поисковое поле*/}
        <div className={styles.searchBar}>
          <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img 
              src={searchIcon} 
              alt="" 
              className={styles.searchIcon}
            />
        </div>
        {/* Контейнер с расписанием */}
          <div className={styles.scheduleContainer}>
            
            {/* СТРОКА 1: Математика */}
            <div className={styles.scheduleRow}>
              
              {/* Фильтры */}
              <div className={styles.filtersRow}>
                
                {/* Фильтр "Класс" */}
                <div className={styles.filterButton1}>
                  <div className={styles.filterContent}>
                    <img 
                      src={classIcon} 
                      alt="" 
                      className={styles.filterIcon}
                    />
                    <span className={styles.filterText}>Класс</span>
                  </div>
                  <img 
                    src={arrowDownIcon} 
                    alt="" 
                    className={styles.arrowIcon}
                  />
                </div>
                
                {/* Фильтр "Преподаватель" */}
                <div className={styles.filterButton2}>
                  <div className={styles.filterContent}>
                    <img 
                      src={teacherIcon} 
                      alt="" 
                      className={styles.filterIcon}
                    />
                    <span className={styles.filterText}>Преподаватель</span>
                  </div>
                  <img 
                    src={arrowDownIcon} 
                    alt="" 
                    className={styles.arrowIcon}
                  />
                </div>
              </div>
              <CategoryBlock 
                title='Математика'
                schedules={mathematicsSchedule}
              />
            </div>
        </div>
      </div>
    </section>
  );
};