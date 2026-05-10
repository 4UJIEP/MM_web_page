import type { FC } from 'react';
import { useState, useEffect } from 'react';
import styles from './TeacherLessonModal.module.css';
import fileIcon from '../../../assets/icons/folder.png';
import uploadIcon from '../../../assets/icons/app.png';
import deleteIcon from '../../../assets/icons/close-icon.png';

// ============================================
// TYPES
// ============================================

export interface TeacherLessonStudent {
    id: string;
    name: string;
    avatarUrl?: string;
    isPresent: boolean;
    score: number | null;
}

export interface TeacherLessonFile {
    name: string;
    size: string;
}

export interface TeacherLessonDetail {
    id: string;
    topic: string;
    date: string;
    students: TeacherLessonStudent[];
    files: TeacherLessonFile[];
    description: string;
    teacher: string;
    homework: string;
    homeworkFiles: TeacherLessonFile[];
}

type TabId = 'attendance' | 'files' | 'info';

interface Tab {
    id: TabId;
    label: string;
}

const TABS: Tab[] = [
    { id: 'attendance', label: 'Посещаемость' },
    { id: 'files', label: 'Файлы' },
    { id: 'info', label: 'Информация по занятию' },
];

// ============================================
// MOCK DATA
// TODO: заменить на fetch(`/api/lessons/${id}/teacher-detail`)
// ============================================

const MOCK_STUDENTS: TeacherLessonStudent[] = [
    { id: 's1', name: 'Вася П.М.', isPresent: true, score: 5 },
    { id: 's2', name: 'Вася П.М.', isPresent: true, score: 4 },
    { id: 's3', name: 'Вася П.М.', isPresent: true, score: 3 },
    { id: 's4', name: 'Вася П.М.', isPresent: true, score: 2 },
    { id: 's5', name: 'Вася П.М.', isPresent: true, score: 1 },
];

const MOCK_DETAIL: TeacherLessonDetail = {
    id: '1',
    topic: 'Решение простых задач. Графический диктант.',
    date: '7 марта, 2026, 16:00–18:00',
    students: MOCK_STUDENTS,
    files: [{ name: 'Файл-чн-нп.pdf', size: '1.2 МБ' }, { name: 'Задание-2.pdf', size: '340 КБ' }],
    description:
        'Сегодня мы прошли с детьми то-то то-то, чего-то и того-то, ' +
        'Сегодня мы прошли с детьми то-то то-то, чего-то и того-то.',
    teacher: 'Гарцева Карина Александровна',
    homework: 'Дома надо дэшку сделать',
    homeworkFiles: [{ name: 'Файл-нн-нп.pdf', size: '320 КБ' }],
};

async function fetchTeacherLessonDetail(id: string): Promise<TeacherLessonDetail> {
    await new Promise(r => setTimeout(r, 100));
    return { ...MOCK_DETAIL, id };
}

// ============================================
// ATTENDANCE TABLE
// ============================================

interface AttendanceTableProps {
    students: TeacherLessonStudent[];
    onTogglePresent: (studentId: string) => void;
    onScoreChange: (studentId: string, score: number | null) => void;
}

const AttendanceTable: FC<AttendanceTableProps> = ({ students, onTogglePresent, onScoreChange }) => (
    /* Таблица — w:627 br:16 border:0.6px #3E404480 bg:#fff */
    <div className={styles.table}>

        {/* Заголовок — w:627 h:70 br-top:16 bg:#F5F7FA
             Структура зеркалит строки: [Ученик 241px] | [Был flex] | [Балл 192px] */}
        <div className={styles.tableHeader}>
            <span className={styles.thStudent}>Ученик</span>
            <div className={styles.thDivider} />
            <span className={styles.thPresent}>Был</span>
            <div className={styles.thDivider} />
            <span className={styles.thScore}>Балл</span>
        </div>

        {/* Строки учеников */}
        <div className={styles.tableBody}>
            {students.map((student, idx) => (
                <div
                    key={student.id}
                    className={`${styles.tableRow} ${idx < students.length - 1 ? styles.tableRowBorder : ''}`}
                >
                    {/* Ученик — w:154 gap:14px */}
                    <div className={styles.tdStudent}>
                        {/* Фото — w:42 h:42 */}
                        {student.avatarUrl ? (
                            <img src={student.avatarUrl} alt="" className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarPlaceholder} />
                        )}
                        {/* Имя — Roboto 500 20px #21242B */}
                        <span className={styles.studentName}>{student.name}</span>
                    </div>

                    {/* Вертикальный разделитель */}
                    <div className={styles.colDivider} />

                    {/* Был — чекбокс */}
                    <div className={styles.tdPresent}>
                        <button
                            className={styles.checkBtn}
                            onClick={() => onTogglePresent(student.id)}
                            aria-label={student.isPresent ? 'Отметить отсутствие' : 'Отметить присутствие'}
                        >
                            <div className={`${styles.checkbox} ${student.isPresent ? styles.checkboxChecked : ''}`}>
                                {student.isPresent && (
                                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
                                        <path
                                            d="M1 4.5L4 7.5L10 1"
                                            stroke="#fff"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Вертикальный разделитель */}
                    <div className={styles.colDivider} />

                    {/* Балл */}
                    <div className={styles.tdScore}>
                        {student.isPresent ? (
                            <div className={styles.scoreBox}>
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={student.score ?? ''}
                                    placeholder="—"
                                    className={styles.scoreInput}
                                    onChange={e => {
                                        const v = e.target.value;
                                        onScoreChange(student.id, v === '' ? null : Number(v));
                                    }}
                                    aria-label="Балл"
                                />
                            </div>
                        ) : (
                            <span className={styles.scoreDash}>—</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ============================================
// FILE ROW — одна строка файла
// w:573 h:33 br:8 border:0.6px #00000033 p:8 10 8 8
// ============================================

interface FileRowProps {
    name: string;
    size: string;
    onDelete?: () => void;
}

const FileRow: FC<FileRowProps> = ({ name, size, onDelete }) => (
    <div className={styles.fileRow}>
        {/* Иконка файла — w:16 h:16 */}
        <img src={fileIcon} alt="" className={styles.fileRowIcon} />
        {/* Имя — Inter 500 12px #000 lh:140% ls:3% */}
        <span className={styles.fileRowName}>{name}</span>
        {/* Размер — Inter 500 12px #3E4044 */}
        <span className={styles.fileRowSize}>{size}</span>
        {/* Удалить — w:16 h:16 */}
        {onDelete && (
            <button className={styles.fileRowDelete} onClick={onDelete} aria-label="Удалить файл">
                <img src={deleteIcon} alt="" className={styles.fileRowIcon} />
            </button>
        )}
    </div>
);

// ============================================
// UPLOAD BUTTON — кнопка загрузки файла
// w:600 h:32 br:8 border:0.6px #00000033 p:8 10 8 8
// ============================================

const UploadButton: FC<{ onChange?: (files: FileList) => void }> = ({ onChange }) => (
    <label className={styles.uploadBtn}>
        {/* Иконка upload — w:16 h:16 */}
        <img src={uploadIcon} alt="" className={styles.uploadIcon} />
        {/* Текст — Inter 400 16px #3E4044 lh:140% ls:3% */}
        <span className={styles.uploadText}>Загрузить файл</span>
        <input
            type="file"
            className={styles.uploadInput}
            onChange={e => e.target.files && onChange?.(e.target.files)}
            aria-label="Загрузить файл"
        />
    </label>
);

// ============================================
// FILE SECTION — блок «Файлы к занятию» или «Домашнее задание»
// outer: w:618 h:177 br:16 bg:#F5F7FA
// inner: w:600 h:147 top:16 left:9 gap:8
// card: w:600 h:107 br:7 bg:#fff (заголовок + файлы)
// ============================================

interface FileSectionFile {
    name: string;
    size: string;
}

interface FileSectionProps {
    title: string;
    files: FileSectionFile[];
    onDeleteFile?: (idx: number) => void;
    onUpload?: (fileList: FileList) => void;
}

const FileSection: FC<FileSectionProps> = ({ title, files, onDeleteFile, onUpload }) => (
    /* Внешний контейнер — w:618 br:16 bg:#F5F7FA */
    <div className={styles.fileSection}>
        {/* Внутренний контейнер — w:600 top:16 left:9 gap:8 */}
        <div className={styles.fileSectionInner}>

            {/* Карточка с заголовком и списком файлов — w:600 br:7 bg:#fff */}
            <div className={styles.fileSectionCard}>
                {/* Заголовок — Roboto 500 20px #21242B top:16 left:16 */}
                <span className={styles.fileSectionTitle}>{title}</span>

                {/* Файлы */}
                {files.map((f, i) => (
                    <FileRow
                        key={i}
                        name={f.name}
                        size={f.size}
                        onDelete={onDeleteFile ? () => onDeleteFile(i) : undefined}
                    />
                ))}

                {files.length === 0 && (
                    <p className={styles.emptyText}>Нет файлов</p>
                )}
            </div>

            {/* Кнопка загрузки — w:600 h:32 br:8 border:0.6px #00000033 */}
            <UploadButton onChange={onUpload} />

        </div>
    </div>
);

// ============================================
// FILES TAB
// w:618 h:370 gap:16
// ============================================

interface FilesTabProps {
    lessonFiles: FileSectionFile[];
    homeworkFiles: FileSectionFile[];
    onDeleteLesson?: (idx: number) => void;
    onDeleteHomework?: (idx: number) => void;
    onUploadLesson?: (files: FileList) => void;
    onUploadHomework?: (files: FileList) => void;
}

const FilesTab: FC<FilesTabProps> = ({
    lessonFiles,
    homeworkFiles,
    onDeleteLesson,
    onDeleteHomework,
    onUploadLesson,
    onUploadHomework,
}) => (
    /* w:618 h:370 gap:16 */
    <div className={styles.filesTab}>
        <FileSection
            title="Файлы к занятию"
            files={lessonFiles}
            onDeleteFile={onDeleteLesson}
            onUpload={onUploadLesson}
        />
        <FileSection
            title="Домашнее задание"
            files={homeworkFiles}
            onDeleteFile={onDeleteHomework}
            onUpload={onUploadHomework}
        />
    </div>
);

// ============================================
// INFO TAB
// ============================================

const InfoTab: FC<{ detail: TeacherLessonDetail }> = ({ detail }) => (
    <div className={styles.infoTab}>
        <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Дата проведения</span>
            <span className={styles.infoValue}>{detail.date}</span>
        </div>
        <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Преподаватель</span>
            <span className={styles.infoValue}>{detail.teacher}</span>
        </div>
        {detail.description && (
            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Описание</span>
                <span className={styles.infoValue}>{detail.description}</span>
            </div>
        )}
        {detail.homework && (
            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Домашнее задание</span>
                <span className={styles.infoValue}>{detail.homework}</span>
            </div>
        )}
    </div>
);

// ============================================
// MODAL
// ============================================

interface TeacherLessonModalProps {
    lessonId: string | null;
    onClose: () => void;
}

export const TeacherLessonModal: FC<TeacherLessonModalProps> = ({ lessonId, onClose }) => {
    const [detail, setDetail] = useState<TeacherLessonDetail | null>(null);
    const [students, setStudents] = useState<TeacherLessonStudent[]>([]);
    const [lessonFiles, setLessonFiles] = useState<{ name: string; size: string }[]>([]);
    const [homeworkFiles, setHomeworkFiles] = useState<{ name: string; size: string }[]>([]);
    const [activeTab, setActiveTab] = useState<TabId>('attendance');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Загрузка данных
    useEffect(() => {
        if (!lessonId) { setDetail(null); setStudents([]); setError(null); return; }
        setIsLoading(true);
        setError(null);
        setActiveTab('attendance');
        fetchTeacherLessonDetail(lessonId)
            .then(d => {
                setDetail(d);
                setStudents(d.students);
                setLessonFiles(d.files);
                setHomeworkFiles(d.homeworkFiles);
            })
            .catch(() => setError('Не удалось загрузить данные занятия'))
            .finally(() => setIsLoading(false));
    }, [lessonId]);

    // Закрытие по Escape
    useEffect(() => {
        if (!lessonId) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [lessonId, onClose]);

    if (!lessonId) return null;

    const handleTogglePresent = (studentId: string) => {
        setStudents(prev =>
            prev.map(s =>
                s.id === studentId
                    ? { ...s, isPresent: !s.isPresent, score: s.isPresent ? null : s.score }
                    : s
            )
        );
    };

    const handleScoreChange = (studentId: string, score: number | null) => {
        setStudents(prev =>
            prev.map(s => s.id === studentId ? { ...s, score } : s)
        );
    };

    return (
        /* Overlay */
        <div
            className={styles.overlay}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-label="Подробности занятия"
        >
            {/* Модалка — w:705 h:603 br:16 */}
            <div className={styles.modal}>

                {/* Кнопка закрытия — ×  */}
                <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M1 1L17 17M17 1L1 17" stroke="#21242B" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {isLoading && <div className={styles.loading}>Загрузка...</div>}
                {error && <div className={styles.error}>{error}</div>}

                {detail && !isLoading && (
                    <>
                        {/* Заголовок + вкладки — w:598 h:82 top:81 left:39 gap:32 */}
                        <div className={styles.headerBlock}>

                            {/* Тема — Roboto 500 24px #21242B lh:100% ls:3% */}
                            <h2 className={styles.topic}>{detail.topic}</h2>

                            {/* Вкладки — w:417 h:22 gap:16 */}
                            <div className={styles.tabs} role="tablist">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        role="tab"
                                        aria-selected={activeTab === tab.id}
                                        className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        {tab.label}
                                        {/* Подчёркивание активной вкладки */}
                                        {activeTab === tab.id && (
                                            <span className={styles.tabUnderline} aria-hidden="true" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Содержимое вкладки */}
                        <div className={styles.tabContent} role="tabpanel">
                            {activeTab === 'attendance' && (
                                <AttendanceTable
                                    students={students}
                                    onTogglePresent={handleTogglePresent}
                                    onScoreChange={handleScoreChange}
                                />
                            )}
                            {activeTab === 'files' && (
                                <FilesTab
                                    lessonFiles={lessonFiles}
                                    homeworkFiles={homeworkFiles}
                                    onDeleteLesson={idx =>
                                        setLessonFiles(prev => prev.filter((_, i) => i !== idx))
                                    }
                                    onDeleteHomework={idx =>
                                        setHomeworkFiles(prev => prev.filter((_, i) => i !== idx))
                                    }
                                    onUploadLesson={files => {
                                        Array.from(files).forEach(f =>
                                            setLessonFiles(prev => [...prev, { name: f.name, size: `${(f.size / 1024).toFixed(0)} КБ` }])
                                        );
                                    }}
                                    onUploadHomework={files => {
                                        Array.from(files).forEach(f =>
                                            setHomeworkFiles(prev => [...prev, { name: f.name, size: `${(f.size / 1024).toFixed(0)} КБ` }])
                                        );
                                    }}
                                />
                            )}
                            {activeTab === 'info' && (
                                <InfoTab detail={detail} />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};