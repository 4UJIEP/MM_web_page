import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import styles from './MonthPicker.module.css';

import calendarIcon from '../../../assets/icons/Icon.png'; // заменить на иконку календаря когда будет

// ============================================
// TYPES
// ============================================

interface MonthPickerProps {
  /** Текущий выбранный месяц (0-11) — для отображения в пилюле */
  month: number;
  /** Текущий выбранный год — для отображения в пилюле */
  year: number;
  /**
   * Вызывается при клике на день в календаре.
   * Передаёт конкретную дату, на которую кликнул пользователь.
   */
  onChange: (date: Date) => void;
  /**
   * Любой день из текущей выбранной недели (обычно понедельник).
   * MonthPicker подсвечивает серым всю неделю этой даты.
   * Если не передан — выделяется неделя сегодняшнего дня.
   */
  selectedDate?: Date;
}

// ============================================
// HELPERS
// ============================================

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель',
  'Май', 'Июнь', 'Июль', 'Август',
  'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

/** Возвращает понедельник недели для переданной даты */
function getMondayOf(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay();
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
  return d;
}

/** Строит массив из 42 ячеек для сетки (6 строк × 7 дней) */
function buildCalendarGrid(
  month: number,
  year: number,
  selectedDate: Date,
): Array<{
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isInSelectedWeek: boolean;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Диапазон выбранной недели: Пн..Вс
  const weekMonday = getMondayOf(selectedDate);
  const weekSunday = new Date(weekMonday);
  weekSunday.setDate(weekMonday.getDate() + 6);

  const firstDay = new Date(year, month, 1);
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: Array<{
    date: number; month: number; year: number;
    isCurrentMonth: boolean; isToday: boolean;
    isInSelectedWeek: boolean;
  }> = [];

  const inWeek = (d: number, m: number, y: number): boolean => {
    const dt = new Date(y, m, d);
    dt.setHours(0, 0, 0, 0);
    return dt >= weekMonday && dt <= weekSunday;
  };

  // Хвост предыдущего месяца
  for (let i = startDow - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    cells.push({ date: d, month: m, year: y, isCurrentMonth: false, isToday: false, isInSelectedWeek: inWeek(d, m, y) });
  }

  // Текущий месяц
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    cellDate.setHours(0, 0, 0, 0);
    const isToday = cellDate.getTime() === today.getTime();
    cells.push({ date: d, month, year, isCurrentMonth: true, isToday, isInSelectedWeek: inWeek(d, month, year) });
  }

  // Начало следующего месяца
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    cells.push({ date: d, month: m, year: y, isCurrentMonth: false, isToday: false, isInSelectedWeek: inWeek(d, m, y) });
  }

  return cells;
}

// ============================================
// CALENDAR POPUP
// ============================================

interface CalendarPopupProps {
  month: number;
  year: number;
  /** Любой день из выбранной недели для подсветки */
  selectedDate: Date;
  /** Передаёт конкретную дату клика */
  onChange: (date: Date) => void;
  onClose: () => void;
}

const CalendarPopup: FC<CalendarPopupProps> = ({ month, year, selectedDate, onChange, onClose }) => {
  const [viewMonth, setViewMonth] = useState(month);
  const [viewYear, setViewYear] = useState(year);

  const cells = buildCalendarGrid(viewMonth, viewYear, selectedDate);

  const handlePrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else { setViewMonth(m => m - 1); }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else { setViewMonth(m => m + 1); }
  };

  const handleDayClick = (cell: typeof cells[0]) => {
    // ✅ Передаём точную дату — CabinetSchedule сам найдёт нужный понедельник
    const clicked = new Date(cell.year, cell.month, cell.date);
    onChange(clicked);
    onClose();
  };

  return (
    // w:318 h:308 br:12 border: 1px solid #D9D9D9 bg:#fff p:16
    <div className={styles.popup}>

      {/* w:286 h:36 gap:16 */}
      <div className={styles.popupHeader}>

        {/* Стрелка назад — w:36 h:36 */}
        <button className={styles.arrowButton} onClick={handlePrevMonth} aria-label="Предыдущий месяц">
          <div className={styles.arrowInner}>
            <div className={styles.arrowLeft} aria-hidden="true" />
          </div>
        </button>

        {/* Дропдауны — w:182 h:28 gap:8 */}
        <div className={styles.selectors}>

          {/* Месяц — w:87 h:28 */}
          <div className={styles.selectorBox}>
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
            <div className={styles.chevronDown} aria-hidden="true" />
          </div>

          {/* Год — w:87 h:28 */}
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
        <button className={styles.arrowButton} onClick={handleNextMonth} aria-label="Следующий месяц">
          <div className={styles.arrowInner}>
            <div className={styles.arrowRight} aria-hidden="true" />
          </div>
        </button>

      </div>

      {/* Календарная сетка — w:286 h:240 pt:16 */}
      <div className={styles.calendarGrid}>

        {/* Заголовки дней — w:286 h:20 gap:1 */}
        <div className={styles.dayNames}>
          {DAY_NAMES.map((d) => (
            <div key={d} className={styles.dayNameCell}>
              <span className={styles.dayNameText}>{d}</span>
            </div>
          ))}
        </div>

        {/* Числа — w:286 h:204 gap:1 */}
        <div className={styles.dayNumbers}>
          {cells.map((cell, i) => (
            <button
              key={i}
              className={[
                styles.dayCell,
                !cell.isCurrentMonth ? styles.dayCellOtherMonth : '',
                cell.isInSelectedWeek && !cell.isToday ? styles.dayCellWeek : '',
                cell.isToday ? styles.dayCellToday : '',
              ].join(' ')}
              onClick={() => handleDayClick(cell)}
              aria-label={`${cell.date} ${MONTH_NAMES[cell.month]} ${cell.year}`}
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
// MONTH PILL + обёртка
// ============================================

export const MonthPicker: FC<MonthPickerProps> = ({ month, year, onChange, selectedDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
      {/* Pill — w:124 h:32 gap:4 br:16 p:4 */}
      <button
        className={styles.pill}
        onClick={() => setIsOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <img src={calendarIcon} alt="" className={styles.pillIcon} />
        <span className={styles.pillLabel}>
          {MONTH_NAMES[month]} {year}
        </span>
      </button>

      {isOpen && (
        <CalendarPopup
          month={month}
          year={year}
          selectedDate={selectedDate ?? new Date()}
          onChange={onChange}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};