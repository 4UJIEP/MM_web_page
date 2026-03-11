import type {FC} from 'react';
import styles from './Hero.module.css';

import boyImg from '../../assets/boy.png';
import cursorImg from '../../assets/cursor.png';
import flower1Img from '../../assets/flower1.png';
import flower2Img from '../../assets/flower2.png';

export const Hero: FC = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                {/* ВНЕШНИЙ БЛОК (1600×841) */}
                <div className={styles.outerBlock}>
                    {/* ПРЯМОУГОЛЬНИК (1472×757) */}
                    <div className={styles.card}>
                        {/* Левая часть - текстовый контент */}
                        <div className={styles.content}>
                            <div className={styles.badge}>
                                Продолжаем традиции с 1979 года
                            </div>
                            <h1 className={styles.title}>
                                Малый Матфак ФЦТМК
                            </h1>
                            <p className={styles.description}>
                                Школа дополнительного образования школьников
                                на базе ФЦТМК ОмГУ им. Ф.М. Достоевского
                            </p>
                            {/* Разделительная линия */}
                            <hr className={styles.divider} />
                            <p className={styles.quote}>
                                "Учим детей думать самостоятельно,
                                превращая сложные задачи из проблемы
                                в увлекательный интеллектуальный вызов!"
                            </p>
                            <div className={styles.ctaContainer}>
                                <p className={styles.enrollment}>
                                    Идет набор на 2025-2026 учебный год!
                                </p>
                                <a href='/recording' className={styles.recordLink}>
                                    Записаться в группу
                                </a>
                            </div>
                        </div>
                        {/* Правая часть - изображение */}
                        <div className={styles.decorativeElements}>
                        
                            <img src={flower2Img} alt="цветок за мальчиком" className={styles.flower2} />
            
                            {/* Boy (мальчик) */}
                            <img 
                                src={boyImg}
                                alt="Ученик Малого Матфака" 
                                className={styles.boyImage}
                            />
                            
                            <img src={flower1Img} alt="цветок поверх мальчика" className={styles.flower1} />
                            
                            {/* Cursor (курсор мыши) */}
                            <img 
                                src={cursorImg}
                                alt="курсор" 
                                className={styles.cursorImage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
};
