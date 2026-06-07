/**
 * Интерфейс преподавателя
 */
export interface Teacher {
  /** Уникальный идентификатор */
  id: string;
  
  /** Фамилия */
  lastName: string;
  
  /** Имя */
  firstName: string;
  
  /** Отчество */
  middleName: string;
  
  /** Путь к фотографии */
  photo?: string;
  
  /** Звания и достижения */
  achievements: string[];
}