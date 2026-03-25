import type { FC } from 'react';
import { useState } from 'react';
import styles from './FAQItem.module.css';

import plusIcon from '../../../assets/icons/plusIcon.png';

interface FAQItemProps {
  /** Вопрос */
  question: string;
  
  /** Ответ */
  answer: string;
  
  /** Открыт ли по умолчанию */
  defaultOpen?: boolean;
}

export const FAQItem: FC<FAQItemProps> = ({
  question,
  answer,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.faqItem}>
      
      {/* Контейнер для вопроса и кнопки */}
      <div className={styles.questionContainer}>
        
        {/* Вопрос */}
        <h3 className={styles.question}>{question}</h3>
        
        {/* Кнопка открытия/закрытия */}
        <button 
          className={`${styles.toggleButton} ${isOpen ? styles.open : ''}`}
          onClick={toggleOpen}
          aria-label={isOpen ? 'Закрыть ответ' : 'Открыть ответ'}
        >
          <img src={plusIcon} alt="" />
        </button>
        
      </div>
      
      
      {/* Ответ (показывается только если открыто) */}
      {isOpen && (
        <div className={styles.answer}>
          {answer}
        </div>
      )}
      
      {/* Gap 16px */}
      
      {/* Разделительная линия */}
      <div className={styles.divider} />
      
    </div>
  );
};