import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import vkIcon from '../../assets/icons/vkontakte.png';
import appIcon from '../../assets/icons/app.png';
import logo from '../../assets/logoUn.png';

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <h3 className={styles.heading}>Навигация по сайту</h3>
          <div className={styles.linksContainer}>
            <ul className={styles.links}>
              <li><Link to="/courses">Курсы</Link></li>
              <li><Link to="/teachers">Наши преподаватели</Link></li>
              <li><Link to="/olympiads">Олимпиады</Link></li>
              <li><Link to="/news">Новости</Link></li>
              <li><Link to="/schedule">Расписание</Link></li>
              <li><Link to="/contacts">Контакты</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.rightColumn}>
          <h3 className={styles.rightHeading}>Остались вопросы? Напишите нам в группе в ВК или позвоните по номеру телефона</h3>
          <div className={styles.contactsColumn}>
            <div className={styles.contactRow}>
              <img className={styles.contactIcon} src={vkIcon} alt="VK icon" />
              <span className={styles.contactText}>Малый матфак</span>
            </div>

            <div className={styles.contactRow}>
              <img className={styles.contactIcon} src={appIcon} alt="Phone icon" />
              <span className={styles.contactText}>+7 (999) 460-86-19</span>
            </div>
          </div>
          <p className={styles.workTime}>Прием звонков: 9:00-14:00 и 19:00-21:00</p>
        </div>
        <div className={styles.bottom}>
            <img src={logo} alt="Университет" className={styles.logo} />
        </div>
      </div>
    </footer>
  );
};