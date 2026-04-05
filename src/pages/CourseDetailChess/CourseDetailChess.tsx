import { use, useRef, type FC } from 'react';
import styles from './CourseDetailMath.module.css';
import boyImg from '../../assets/chess-boy.png';
import flower1Img from '../../assets/flower1.png';
import flower2Img from '../../assets/flower2.png';


export const CourseDetailChess: FC = () => {
    return (
        <section className={styles.courseDetailPage}>
            <div>


                <div className={styles.textContent}>

                    {/* Заголовок */}
                    <h1 className={styles.title}>Математика</h1>

                    {/* Описание (4 параграфа) */}
                    <div className={styles.description}>

                        {/* Параграф 1 */}
                        <p className={styles.paragraph}>
                            Курс рассчитан на 20 часов. Ребята изучат основы шахмат,
                            получат необходимую дебютную базу и навыки игры
                            в эндшпиле.
                        </p>

                        {/* Параграф 2 */}
                        <p className={styles.paragraph}>
                            Вот только некоторые темы, которые рассмотрят наши юные шахматисты:
                        </p>

                        {/* Параграф 3 */}
                        <p className={styles.paragraph}>
                            Позиционирование фигур
                            Решение шахматных задач
                            Принципы дебютных построений
                            Пешечные структуры, их преимущества и недостатки
                            Основые принципы атаки и защиты в миттельшпиле
                            Приемы шахматного анализа партий
                            Основы игры в эндшпиле
                        </p>

                        {/* Параграф 4 */}
                        <p className={styles.paragraph}>
                            У нас ребята узнают, что шахматы — это интересно!Занятия ведут:Игрок сборной ОмГУ, победитель международных онлайн-турниров Петров Владимир Юрьевич
                            Игрок сборной ОмГУ, победитель первенства Омской области Майер Роберт Витальевич
                        </p>

                    </div>
                </div>
                <div className={styles.decorativeElements}>
                    
                    <img 
                        src={flower2Img}
                        alt=''
                        className={styles.flower2}
                    />
                    <img
                        src={boyImg}
                        alt='мальчик'
                        className={styles.boyImg}
                    />
                    <img 
                        src={flower1Img}
                        alt=''
                        className={styles.flower1}
                    />
                </div>
            </div>
        </section>
    );
};