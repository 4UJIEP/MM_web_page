import { useRef, type FC } from 'react';
import { TeacherCard } from '../ui/TeacherCard';
import { teachersData } from '../../data/teacher';
import styles from './Teachers.module.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation} from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/swiper-bundle.css';

import arrowRight from '../../assets/arrow-right.png';
import arrowLeft from '../../assets/arrow-left.png';


export const Teachers: FC = () => {
  // реф для управления Swiper
  const swiperRef = useRef<SwiperType | null>(null);
  // Обработчик клика на кнопку "Курсы преподавателя"
  const handleCoursesClick = (teacherId: string) => {
    console.log('Курсы преподавателя:', teacherId);
    // navigate(`/teachers/${teacherId}`)
  };

  // Обработчик клика на "Смотреть всех преподавателей"
  const handleViewAllClick = () => {
    console.log('Смотреть всех преподавателей');
    // navigate('/teachers')
  };

  const handlePrevClick = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNextClick = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <section className={styles.teachers}>
      <div className={styles.container}>
        
        {/* Заголовок */}
        <h2 className={styles.title}>Наши преподаватели</h2>
        
        {/* SWIPER КАРУСЕЛЬ */}
        <div className={styles.carouselWrapper}>
          <button 
            className={styles.navButtonPrev}
            onClick={handlePrevClick}
            aria-label="Предыдущий преподаватель"
          >
            <img src={arrowLeft} alt="" />
          </button>
          <Swiper
            modules={[Navigation]}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            
            slidesPerView={3.5} 
            spaceBetween={16}
            
            navigation={false}
            pagination={false}
            loop={true}
            centeredSlides={false} 
            
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 16 },
              1440: { slidesPerView: 3.5, spaceBetween: 16 },
            }}
            
            className={styles.swiper}
          >
            
            {teachersData.map((teacher) => (
              <SwiperSlide key={teacher.id}>
                <TeacherCard
                  {...teacher}
                  onCoursesClick={() => handleCoursesClick(teacher.id)}
                />
              </SwiperSlide>
            ))}
            
          </Swiper>
          <button 
            className={styles.navButtonNext}
            onClick={handleNextClick}
            aria-label="Следующий преподаватель"
          >
            <img src={arrowRight} alt="" />
          </button>
        </div>
        
        {/* Кнопка "Смотреть всех преподавателей" */}
        <button 
          className={styles.viewAllButton}
          onClick={handleViewAllClick}
        >
          Смотреть всех преподавателей
        </button>
        
      </div>
    </section>
  );
};