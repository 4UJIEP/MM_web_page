import type {FC} from 'react';
import { useRef } from 'react';
import { Swiper , SwiperSlide} from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import styles from './CategoryBlock.module.css';
import { ScheduleCard } from '../ui/ScheduleCard';


import 'swiper/swiper-bundle.css';

import arrowLeftIcon from '../../assets/arrow-left.png';
import arrowRightIcon from '../../assets/arrow-right.png';

interface ScheduleItem {
  id: string;
  className: string;
  teacher: string;
  schedule: string;
  location: string;
  startDate: string;
}

interface CategoryBlockProps {
  /** Название категории */
  title: string;
  
  /** Массив занятий */
  schedules: ScheduleItem[];
}

export const CategoryBlock: FC<CategoryBlockProps> = ({
  title,
  schedules,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrevClick = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNextClick = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <div className={styles.categoryBlock}>
      
      {/* Контейнер (1467×285) */}
      <div className={styles.container}>
        
        {/* Заголовок категории (1419×54) */}
        <div className={styles.titleContainer}>
          <div className={styles.titleWrapper}>
            <span className={styles.title}>{title}</span>
          </div>
        </div>
        
        {/* Карточки с каруселью (1488×247) */}
        <div className={styles.cardsContainer}>
          
          {/* Левая стрелка */}
          <button 
            className={styles.navButtonPrev}
            onClick={handlePrevClick}
            aria-label="Предыдущий"
          >
            <img src={arrowLeftIcon} alt="" />
          </button>
          
          {/* Swiper карусель */}
          <Swiper
            modules={[Navigation, Pagination]}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            
            slidesPerView={3.3} // 3 полных + 1 обрезанная
            spaceBetween={20}
            
            navigation={false}
            pagination={{ clickable: true }}
            
            loop={true}
            
            className={styles.swiper}
          >
            
            {schedules.map((item) => (
              <SwiperSlide key={item.id}>
                <ScheduleCard
                  className={item.className}
                  teacher={item.teacher}
                  schedule={item.schedule}
                  location={item.location}
                  startDate={item.startDate}
                />
              </SwiperSlide>
            ))}
            
          </Swiper>
          
          {/* Правая стрелка */}
          <button 
            className={styles.navButtonNext}
            onClick={handleNextClick}
            aria-label="Следующий"
          >
            <img src={arrowRightIcon} alt="" />
          </button>
          
        </div>
        
      </div>
      
    </div>
  );
};