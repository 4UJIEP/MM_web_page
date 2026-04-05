import type { FC } from 'react';
import styles from './InfoCard.module.css';

interface InfoCardProps {
  /** Заголовок (например, "Младшая школа (1-4 классы)") */
  title: string;
  
  /** Вступительные параграфы */
  introText: string[];
  
  /** Заголовок списка тем */
  topicsTitle: string;
  
  /** Список тем */
  topics: string[];
}

export const InfoCard: FC<InfoCardProps> = ({
  title,
  introText,
  topicsTitle,
  topics,
}) => {
  return (
    <div className={styles.card}>
      
      {/* Контейнер текстового контента */}
      <div className={styles.content}>
        
        {/* Заголовок + Вступительный текст */}
        <div className={styles.headerSection}>
          
          {/* Заголовок */}
          <h3 className={styles.title}>{title}</h3>
          
          {/* Вступительный текст */}
          <div className={styles.intro}>
            {introText.map((text, index) => (
              <p key={index} className={styles.introParagraph}>
                {text}
              </p>
            ))}
          </div>
          
        </div>
        
        {/* Список тем */}
        <div className={styles.topicsSection}>
          
          {/* Заголовок списка */}
          <h4 className={styles.topicsTitle}>{topicsTitle}</h4>
          
          {/* Темы */}
          <ul className={styles.topicsList}>
            {topics.map((topic, index) => (
              <li key={index} className={styles.topicItem}>
                {topic}
              </li>
            ))}
          </ul>
          
        </div>
        
      </div>
      
    </div>
  );
};