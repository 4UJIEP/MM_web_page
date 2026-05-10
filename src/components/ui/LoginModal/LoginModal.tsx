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

export const LoginModal: FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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
                placeholder="малый_ватафак"
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
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="1234567"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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