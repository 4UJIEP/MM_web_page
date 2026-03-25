import type {FC} from "react";
import styles from './Courses.module.css';
import { CourseCard } from "../ui/CourseCard";
import { coursesData } from "../../data/courses";


export const Courses: FC = () => {
const handleDetailsClick = (courseId: string) => {
    console.log('Подробнее о курсе:', courseId);
    // Навигация на страницу курса
    // navigate(`/courses/${courseId}`)
  };

  const handleEnrollClick = (courseId: string) => {
    console.log('Запись на курс:', courseId);
    // перейти на страницу
    // navigate(`/enroll/${courseId}`)
  };

  return (
    <section className={styles.courses}>
      <div className={styles.container}>
        
        <h2 className={styles.title}>Курсы</h2>
        
        <div className={styles.grid}>
          {coursesData.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              onDetailsClick={() => handleDetailsClick(course.id)}
              onEnrollClick={() => handleEnrollClick(course.id)}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
};