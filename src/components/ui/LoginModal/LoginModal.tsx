import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import styles from './LoginModal.module.css';

// Импорт иконки закрытия
import closeIcon from '../../../assets/icons/close-icon.png';

interface LoginModalProps {
  /** Открыто ли модальное окно */
  isOpen: boolean;

  /** Функция закрытия модального окна */
  onClose: () => void;

  /** Функция обработки входа */
  onLogin?: (login: string, password: string) => void;
}

// ── Иконка «глаз открыт» ──
const EyeOpenIcon: FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M1 9C1 9 4 3 9 3s8 6 8 6-3 6-8 6S1 9 1 9Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

// ── Иконка «глаз закрыт» ──
const EyeOffIcon: FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M2 2l14 14M7.5 7.6A2.5 2.5 0 0 0 11.4 11.4M5.3 5.4C3.3 6.6 2 9 2 9s3 6 7 6c1.5 0 2.9-.5 4-1.4M8 3.1C8.3 3 8.6 3 9 3c4 0 7 6 7 6a13 13 0 0 1-1.7 2.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LoginModal: FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Если модалка закрыта, не рендерим ничего
  if (!isOpen) return null;

  // Обработчик отправки формы
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isAgreed) {
      alert('Необходимо согласие на обработку персональных данных');
      return;
    }

    if (onLogin) {
      onLogin(login, password);
    }
    // Убрать потом - сейчас для проверки работы
    console.log('Login:', login, 'Password:', password);
  };

  // Закрытие по клику на overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>

      {/* Модальное окно */}
      <div className={styles.modal}>

        {/* Кнопка закрытия */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <img src={closeIcon} alt="" />
        </button>

        {/* Контейнер содержимого */}
        <div className={styles.container}>

          {/* Заголовок "Вход" */}
          <h2 className={styles.title}>Вход</h2>

          {/* Форма */}
          <form className={styles.formContainer} onSubmit={handleSubmit}>

            {/* Поле Логин */}
            <div className={styles.inputGroup}>
              <label htmlFor="login" className={styles.label}>
                Логин
              </label>
              <input
                id="login"
                type="text"
                className={styles.input}
                placeholder="логин_матфак"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </div>

            {/* Поле Пароль */}
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Пароль
              </label>
              <div className={styles.passwordWrap}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="1234567"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOpenIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            {/* Забыли пароль? */}
            <div className={styles.forgotPassword}>
              <a href="#"
                className={styles.forgotLink}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={(e) => {
                  e.preventDefault();
                  setShowTooltip(prev => !prev);
                }}
              >
                Забыли пароль?
              </a>
              {showTooltip && (
                <div className={styles.tooltip}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  Восстановление пароля осуществляется администратором сайта.<br />
                  Пожалуйста, обратитесь к администратору Малого матфака
                  для получения нового пароля :)
                </div>
              )}
            </div>

            {/* Кнопка Войти */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isAgreed}
            >
              Войти
            </button>

            {/* Чекбокс с политикой конфиденциальности */}
            <div className={styles.agreementContainer}>
              <input
                id="agreement"
                type="checkbox"
                className={styles.checkbox}
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <label htmlFor="agreement" className={styles.agreementText}>
                Я ознакомился с{' '}
                <a href="#" className={styles.link}>
                  Политикой конфиденциальности
                </a>{' '}
                и даю согласие на обработку моих персональных данных
              </label>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};