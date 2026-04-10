import type {FC} from 'react';
import styles from './MonthPicker.module.css';
import { useState, useRef, useEffect } from 'react';

import calendarIcon from '../../../assets/icons/Icon.png';

interface MonthPickerProps {
    month: number;

    year: number;
    /** вызывается при выборе новой даты */
    onChange: (date: Date) => void;
}

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель',
  'Май', 'Июнь', 'Июль', 'Август',
  'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const MONTH_NAMES_SHORT = [
  'Янв', 'Фев', 'Март', 'Апр',
  'Май', 'Июнь', 'Июль', 'Авг',
  'Сент', 'Окт', 'Ноя', 'Дек',
];
 
const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

/** Возвращает массив ячеек для сетки календаря (42 ячейки = 6 недель) */
function buildCalendarGrid(month: number, year: number): Array<{
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}> {
  const today = new Date();
  const firstDay = new Date(year, month, 1);
  // getDay() возвращает 0=Вс, 1=Пн ... нам нужно начать с Пн
  const startDow = (firstDay.getDay() + 6) % 7; // 0=Пн, 6=Вс
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
 
  const cells = [];
 
  // Дни предыдущего месяца
  for (let i = startDow - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    cells.push({ date: d, month: m, year: y, isCurrentMonth: false, isToday: false });
  }
 
  // Дни текущего месяца
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    cells.push({ date: d, month, year, isCurrentMonth: true, isToday });
  }
 
  // Дни следующего месяца
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    cells.push({ date: d, month: m, year: y, isCurrentMonth: false, isToday: false });
  }
 
  return cells;
}
 
// ============================================
// CALENDAR POPUP
// ============================================
 
interface CalendarPopupProps {
  month: number;
  year: number;
  // передает конкретную дату
  onChange: (date: Date) => void;
  onClose: () => void;
}
 
const CalendarPopup: FC<CalendarPopupProps> = ({ month, year, onChange, onClose }) => {
  const [viewMonth, setViewMonth] = useState(month);
  const [viewYear, setViewYear] = useState(year);
 
  const cells = buildCalendarGrid(viewMonth, viewYear);
 
  const handlePrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else { setViewMonth(m => m - 1); }
  };
 
  const handleNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else { setViewMonth(m => m + 1); }
  };
 
  const handleDayClick = (cell: typeof cells[0]) => {
    // Передаём точную дату — CabinetSchedule сам найдёт нужный понедельник
    const clicked = new Date(cell.year, cell.month, cell.date);
    onChange(clicked);
    onClose();
  };
  return (
    // Попап — w:318 h:308 br:Radius/400 border top 1px #D9D9D9 bg:#fff p:Space/400
    <div className={styles.popup}>
 
      {/* ── Шапка: стрелки + дропдауны месяца и года ─── */}
      {/* w:286 h:36 gap:16 */}
      <div className={styles.popupHeader}>
 
        {/* Стрелка назад — w:36 h:36 br:Scale06 border p:Space/200 */}
        <button
          className={styles.arrowButton}
          onClick={handlePrevMonth}
          aria-label="Предыдущий месяц"
        >
          {/* inner w:20 h:20 → icon w:5 h:10 border 2px #1E1E1E */}
          <div className={styles.arrowInner}>
            <div className={styles.arrowLeft} aria-hidden="true" />
          </div>
        </button>
 
        {/* Окна месяца и года — w:182 h:28 gap:8 */}
        <div className={styles.selectors}>
 
          {/* Месяц — w:87 h:28 gap:8 border-bottom 1px #D9D9D9 */}
          <div className={styles.selectorBox}>
            {/* Текст — w:51 h:16 font Body/Medium #1E1E1E */}
            <select
              className={styles.selectorSelect}
              value={viewMonth}
              onChange={(e) => setViewMonth(Number(e.target.value))}
              aria-label="Выбор месяца"
            >
              {MONTH_NAMES.map((name, i) => (
                <option key={i} value={i}>{name}</option>
              ))}
            </select>
            {/* Стрелка вниз — w:16 h:16 */}
            <div className={styles.chevronDown} aria-hidden="true" />
          </div>
 
          {/* Год — w:87 h:28 gap:8 border-bottom 1px #D9D9D9 */}
          <div className={styles.selectorBox}>
            <select
              className={styles.selectorSelect}
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
              aria-label="Выбор года"
            >
              {Array.from({ length: 10 }, (_, i) => viewYear - 5 + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <div className={styles.chevronDown} aria-hidden="true" />
          </div>
 
        </div>
 
        {/* Стрелка вперёд */}
        <button
          className={styles.arrowButton}
          onClick={handleNextMonth}
          aria-label="Следующий месяц"
        >
          <div className={styles.arrowInner}>
            <div className={styles.arrowRight} aria-hidden="true" />
          </div>
        </button>
 
      </div>
 
      {/* ── Календарная сетка ───────────────────────────── */}
      {/* w:286 h:240 padding-top:Space/400 */}
      <div className={styles.calendarGrid}>
 
        {/* Заголовки дней — w:286 h:20 gap:1px */}
        <div className={styles.dayNames}>
          {DAY_NAMES.map((d) => (
            // Ячейка дня — w:40 h:20 → inner w:16 h:20 font XS #757575
            <div key={d} className={styles.dayNameCell}>
              <span className={styles.dayNameText}>{d}</span>
            </div>
          ))}
        </div>
 
        {/* Числа — w:286 h:204 gap:1px, 6 строк × 7 */}
        <div className={styles.dayNumbers}>
          {cells.map((cell, i) => (
            <button
              key={i}
              className={[
                styles.dayCell,
                !cell.isCurrentMonth ? styles.dayCellOtherMonth : '',
                cell.isToday ? styles.dayCellToday : '',
              ].join(' ')}
              onClick={() => handleDayClick(cell)}
              aria-label={`${cell.date} ${MONTH_NAMES_SHORT[cell.month]} ${cell.year}`}
              aria-current={cell.isToday ? 'date' : undefined}
            >
              {cell.date}
            </button>
          ))}
        </div>
 
      </div>
    </div>
  );
};
 
// ============================================
// MONTH PILL (кнопка-триггер) + обёртка
// ============================================
 
export const MonthPicker: FC<MonthPickerProps> = ({ month, year, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
 
  // Закрытие по клику вне компонента
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);
 
  return (
    <div className={styles.root} ref={ref}>
      {/* Month pill — w:124 h:32 gap:4 br:16 p:4 */}
      <button
        className={styles.pill}
        onClick={() => setIsOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {/* Иконка 24×24 */}
        <img
          src={calendarIcon}
          alt=""
          className={styles.pillIcon}
        />
        {/* Текст — w:105 h:23 Roboto 500 20px #21242B */}
        <span className={styles.pillLabel}>
          {MONTH_NAMES_SHORT[month]} {year}
        </span>
      </button>
 
      {/* Попап — top:165 left:59 по Figma (позиционируется относительно root) */}
      {isOpen && (
        <CalendarPopup
          month={month}
          year={year}
          onChange={onChange}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};