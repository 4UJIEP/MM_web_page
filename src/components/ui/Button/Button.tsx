import type { FC, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

//варианты кнопок
type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

// Расширяем стандартные пропсы HTML кнопки
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button: FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props  // остальные HTML атрибуты (onClick, disabled и т.д.)
}) => {
  // cобираем классы через шаблонную строку
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};