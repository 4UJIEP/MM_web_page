import type { FC } from 'react';
import { FAQItem } from '../ui/FAQItem';
import styles from './FAQ.module.css';
import { faqData } from "../../data/faqData";

import boyBook from '../../assets/boyQuestion.png';
import question1 from '../../assets/icons/questionIcon-1.png';
import question2 from '../../assets/icons/questionIcon-2.png';
import question3 from '../../assets/icons/questionIcon-3.png';


export const FAQ: FC = () => {
  return (
    <section className={styles.faq}>
      <div className={styles.container}>
        
        {/* Заголовок */}
        <h2 className={styles.title}>~Часто задаваемые вопросы~</h2>
        
        {/* Контейнер с двумя частями */}
        <div className={styles.content}>
          
          {/* ЛЕВАЯ ЧАСТЬ - Декоративные картинки */}
          <div className={styles.leftSide}>
            <img 
              src={boyBook}
              alt='Мальчик с книгой'
              className={styles.boyBook}
            />
            <img
              src={question1}
              alt=''
              className={styles.questionIcon1} 
            />
            <img
              src={question2}
              alt=''
              className={styles.questionIcon2} 
            />
            <img
              src={question3}
              alt=''
              className={styles.questionIcon3} 
            />
          
          </div>
          
          {/* ПРАВАЯ ЧАСТЬ - Аккордеон с вопросами */}
          <div className={styles.rightSide}>
            {faqData.map((faq) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={faq.defaultOpen}
              />
            ))}
          </div>
          
        </div>
        
      </div>
    </section>
  );
};