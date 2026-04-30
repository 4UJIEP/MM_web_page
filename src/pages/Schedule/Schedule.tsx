import type { FC } from "react";
import { useState } from "react";
import styles from "./Schedule.module.css";

import searchIcon from "../../assets/icons/Search.png";
import classIcon from "../../assets/icons/graduation.png";
import teacherIcon from "../../assets/icons/person.png";
import { CategoryBlock } from "../../components/CategoryBlock";
import { FilterDropdown, CLASS_OPTIONS } from "../../components/ui/FilterDropdown";
import type { FilterOption } from "../../components/ui/FilterDropdown";

// ============================================
// MOCK DATA
// TODO: заменить на scheduleApi.getAll()
// ============================================

const ALL_SCHEDULES = [
  { id: "1", subject: "Математика", className: "1 класс", teacher: "Захарова Юлия Викторовна", schedule: "Воскресенье, 9:40", location: "Главный корпус, ул. Фрунзе, 6, ауд. 205", startDate: "12 октября" },
  { id: "2", subject: "Математика", className: "3 класс", teacher: "Скасырская Ева Сергеевна", schedule: "Суббота, 10:00", location: "Главный корпус, ул. Фрунзе, 6, ауд. 301", startDate: "14 октября" },
  { id: "3", subject: "Математика", className: "5 класс", teacher: "Круглова Ирина Алексеевна", schedule: "Воскресенье, 11:00", location: "Главный корпус, ул. Фрунзе, 6, ауд. 205", startDate: "12 октября" },
  { id: "4", subject: "Информатика", className: "3 класс", teacher: "Захарова Юлия Викторовна", schedule: "Суббота, 12:00", location: "Главный корпус, ул. Фрунзе, 6, ауд. 410", startDate: "13 октября" },
  { id: "5", subject: "Информатика", className: "7 класс", teacher: "Мещеряков Евгений Александрович", schedule: "Воскресенье, 13:00", location: "Главный корпус, ул. Фрунзе, 6, ауд. 410", startDate: "12 октября" },
  { id: "6", subject: "Шахматы", className: "1 класс", teacher: "Карелина Раиса Олеговна", schedule: "Суббота, 9:00", location: "Главный корпус, ул. Фрунзе, 6, ауд. 102", startDate: "13 октября" },
  { id: "7", subject: "Шахматы", className: "4 класс", teacher: "Карелина Раиса Олеговна", schedule: "Воскресенье, 10:00", location: "Главный корпус, ул. Фрунзе, 6, ауд. 102", startDate: "12 октября" },
  { id: "8", subject: "Куборо", className: "2 класс", teacher: "Сокольникова Алла Михайловна", schedule: "Суббота, 14:00", location: "Главный корпус, ул. Фрунзе, 6, ауд. 205", startDate: "13 октября" },
  { id: "9", subject: "Куборо", className: "5 класс", teacher: "Сокольникова Алла Михайловна", schedule: "Воскресенье, 15:00", location: "Главный корпус, ул. Фрунзе, 6, ауд. 205", startDate: "12 октября" },
];

// ── Форматирование ФИО → «Фамилия И.О.» ──────
// «Захарова Юлия Викторовна» → «Захарова Ю.В.»
function shortName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const [last, first, middle] = parts;
  if (!last) return fullName;
  const firstInitial = first ? first[0] + "." : "";
  const middleInitial = middle ? middle[0] + "." : "";
  return [last, firstInitial + middleInitial].filter(Boolean).join(" ");
}

// Уникальные преподаватели из данных
// value = полное ФИО (для фильтрации), label = сокращение (для отображения)
const TEACHER_OPTIONS: FilterOption[] = [
  ...new Map(
    ALL_SCHEDULES.map((s) => [s.teacher, { value: s.teacher, label: shortName(s.teacher) }])
  ).values(),
];

const SUBJECTS = ["Математика", "Информатика", "Шахматы", "Куборо"] as const;

// ============================================
// COMPONENT
// ============================================

export const Schedule: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Фильтры — отдельные для каждого предмета
  // key = subject name, value = массив выбранных значений
  const [classFilters, setClassFilters] = useState<Record<string, string[]>>({});
  const [teacherFilters, setTeacherFilters] = useState<Record<string, string[]>>({});

  // ── Фильтрация для конкретного предмета ───
  const getFiltered = (subject: string) => {
    const selectedClasses = classFilters[subject] ?? [];
    const selectedTeachers = teacherFilters[subject] ?? [];
    const q = searchQuery.toLowerCase().trim();

    return ALL_SCHEDULES
      .filter((s) => s.subject === subject)
      .filter((s) => selectedClasses.length === 0 || selectedClasses.includes(s.className.replace(" класс", "")))
      .filter((s) => selectedTeachers.length === 0 || selectedTeachers.includes(s.teacher))
      .filter((s) =>
        !q ||
        s.teacher.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q) ||
        s.schedule.toLowerCase().includes(q)
      );
  };

  const handleClassChange = (subject: string, vals: string[]) => setClassFilters((p) => ({ ...p, [subject]: vals }));
  const handleTeacherChange = (subject: string, vals: string[]) => setTeacherFilters((p) => ({ ...p, [subject]: vals }));

  return (
    <section className={styles.schedulePage}>
      <div className={styles.container}>

        <h1 className={styles.title}>Расписание занятий на 2025-2026 год</h1>

        <div className={styles.contentWrapper}>

          {/* ── Поисковое поле ────────────────── */}
          <div className={styles.searchBar}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Поиск по расписанию"
            />
            <img src={searchIcon} alt="" className={styles.searchIcon} aria-hidden="true" />
          </div>

          {/* ── Блоки расписания ──────────────── */}
          <div className={styles.scheduleContainer}>
            {SUBJECTS.map((subject) => (
              <div key={subject} className={styles.scheduleRow}>

                {/* Фильтры */}
                <div className={styles.filtersRow}>
                  <FilterDropdown
                    icon={classIcon}
                    label="Класс"
                    options={CLASS_OPTIONS}
                    selected={classFilters[subject] ?? []}
                    onChange={(vals) => handleClassChange(subject, vals)}
                  />
                  <FilterDropdown
                    icon={teacherIcon}
                    label="Преподаватель"
                    options={TEACHER_OPTIONS}
                    selected={teacherFilters[subject] ?? []}
                    onChange={(vals) => handleTeacherChange(subject, vals)}
                  />
                </div>

                <CategoryBlock
                  title={subject}
                  schedules={getFiltered(subject)}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};