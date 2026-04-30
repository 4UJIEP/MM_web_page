import { useState, useRef, useEffect, type FC } from 'react';
import { createPortal } from 'react-dom';
import styles from './FilterDropdown.module.css';

// ============================================
// TYPES
// ============================================

export interface FilterOption {
    value: string;
    label: string;
}

interface FilterDropdownProps {
    /** Иконка слева от названия фильтра */
    icon: string;
    /** Название фильтра (например «Класс») */
    label: string;
    /** Список опций */
    options: FilterOption[];
    /** Выбранные значения (мультиселект) */
    selected: string[];
    /** Колбэк при нажатии «Готово» */
    onChange: (selected: string[]) => void;
}

// ============================================
// CLASSES (1–11)
// Константа вынесена сюда — использовать при инициализации
// ============================================

export const CLASS_OPTIONS: FilterOption[] = Array.from({ length: 11 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} класс`,
}));

// ============================================
// COMPONENT
// ============================================

export const FilterDropdown: FC<FilterDropdownProps> = ({
    icon,
    label,
    options,
    selected,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState<string[]>(selected);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // ── Позиционирование дропдауна под кнопкой ──
    const openDropdown = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
            });
        }
        setDraft(selected);   // сбрасываем черновик к текущему выбору
        setIsOpen(true);
    };

    // ── Закрытие по клику вне дропдауна ──────────
    useEffect(() => {
        if (!isOpen) return;

        const handleOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                !buttonRef.current?.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [isOpen]);

    // ── Тоггл одной опции ────────────────────────
    const toggleOption = (value: string) => {
        setDraft((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value],
        );
    };

    // ── «Готово» — применяем черновик ────────────
    const handleApply = () => {
        onChange(draft);
        setIsOpen(false);
    };

    // ── Иконка стрелки ───────────────────────────
    const isActive = selected.length > 0;
    const buttonLabel = isActive
        ? `${label}: ${selected.length}`
        : label;

    return (
        <>
            {/* ── Кнопка фильтра ─────────────────────── */}
            <button
                ref={buttonRef}
                className={`${styles.filterButton} ${isActive ? styles.filterButtonActive : ''} ${isOpen ? styles.filterButtonOpen : ''}`}
                onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={styles.filterLeft}>
                    <img src={icon} alt="" className={styles.filterIcon} aria-hidden="true" />
                    <span className={styles.filterText}>{buttonLabel}</span>
                </span>
                <svg
                    className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    aria-hidden="true"
                >
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* ── Дропдаун через Portal ─────────────── */}
            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    className={styles.dropdown}
                    style={{ top: dropdownPos.top, left: dropdownPos.left }}
                    role="listbox"
                    aria-multiselectable="true"
                    aria-label={label}
                >
                    {/* Скроллируемый список опций */}
                    <div className={styles.optionsList}>
                        {options.map((opt) => {
                            const checked = draft.includes(opt.value);
                            return (
                                <label key={opt.value} className={styles.optionRow}>
                                    <span className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
                                        {checked && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                                                <path d="M1 4L3.5 6.5L9 1" stroke="#0088FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </span>
                                    <input
                                        type="checkbox"
                                        className={styles.hiddenInput}
                                        checked={checked}
                                        onChange={() => toggleOption(opt.value)}
                                        aria-label={opt.label}
                                    />
                                    <span className={styles.optionLabel}>{opt.label}</span>
                                </label>
                            );
                        })}
                    </div>

                    {/* Кнопка «Готово» */}
                    <button className={styles.applyButton} onClick={handleApply}>
                        Готово
                    </button>
                </div>,
                document.body,
            )}
        </>
    );
};