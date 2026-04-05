import { useRef } from 'react';
import type { FC } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { InfoCard } from '../../components/ui/InfoCard';
import { coursesDetailData } from '../../data/coursesDetail';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/swiper-bundle.css';

import styles from './CourseDetail.module.css';

// Импорт стрелок
import arrowLeftIcon from '../../assets/arrow-left.png';
import arrowRightIcon from '../../assets/arrow-right.png';

export const CourseDetail: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const swiperRef = useRef<SwiperType | null>(null);

  // Получаем данные курса
  const courseData = slug ? coursesDetailData[slug] : null;

  // Редирект если курс не найден
  if (!courseData) {
    return <Navigate to="/" replace />;
  }

  const handlePrevClick = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNextClick = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <section className={styles.courseDetailPage}>
      
      {/* Hero блок */}
      <div className={styles.heroBlock}>
        
        {/* Левая часть: Текст */}
        <div className={styles.textContent}>
          <h1 className={styles.title}>{courseData.title}</h1>
          
          <div className={styles.description}>
            {courseData.heroDescription.map((text, index) => (
              <p key={index} className={styles.paragraph}>
                {text}
              </p>
            ))}
          </div>
        </div>
        
        {/* Правая часть: Картинки */}
        <div className={styles.decorativeElements}>
          <img 
            src={courseData.images.flower1} 
            alt="" 
            className={styles.flower1}
          />
          
          <img 
            src={courseData.images.mainImage} 
            alt="" 
            className={styles.girlImg}
          />
          
          <img 
            src={courseData.images.flower2} 
            alt="" 
            className={styles.flower2}
          />
        </div>
        
      </div>
      
      {/*УСЛОВНАЯ КАРУСЕЛЬ - только если hasCarousel = true */}
      {courseData.hasCarousel && courseData.infoCards && (
        <div className={styles.carouselSection}>
          
          <button 
            className={styles.navButtonPrev}
            onClick={handlePrevClick}
            aria-label="Предыдущая карточка"
          >
            <img src={arrowLeftIcon} alt="" />
          </button>
          
          <Swiper
            modules={[Navigation, Pagination]}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            
            slidesPerView={2.6}
            spaceBetween={16}
            
            navigation={false}
            pagination={{ clickable: true }}
            
            loop={true}
            centeredSlides={false}
            
            className={styles.swiper}
          >
            
            {courseData.infoCards.map((card, index) => (
              <SwiperSlide key={index}>
                <InfoCard
                  title={card.title}
                  introText={card.introText}
                  topicsTitle={card.topicsTitle}
                  topics={card.topics}
                />
              </SwiperSlide>
            ))}
            
          </Swiper>
          
          <button 
            className={styles.navButtonNext}
            onClick={handleNextClick}
            aria-label="Следующая карточка"
          >
            <img src={arrowRightIcon} alt="" />
          </button>
          
        </div>
      )}
    
    </section>
  );
};