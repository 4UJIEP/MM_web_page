import type { FC, ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import styles from './CreateLessonModal.module.css';
import fileIcon from '../../../assets/icons/folder.png';
import uploadIcon from '../../../assets/icons/app.png';
import deleteIcon from '../../../assets/icons/close-icon.png';
import locationIcon from '../../../assets/icons/location.png';
import personIcon from '../../../assets/icons/person.png';

// ============================================
// TYPES
// ============================================

interface LessonFile {
    name: string;
    size: string;
}

interface StudentRow {
    id: string;
    name: string;
    avatarUrl?: string;
    isPresent: boolean;
    score: string;
}

interface CreateLessonForm {
    topic: string;
    description: string;
    date: string;
    location: string;
    lessonFiles: LessonFile[];
    homeworkFiles: LessonFile[];
}

type TabId = 'attendance' | 'files' | 'info';

interface Tab { id: TabId; label: string; }

const TABS: Tab[] = [
    { id: 'attendance', label: 'Посещаемость' },
    { id: 'files', label: 'Файлы' },
    { id: 'info', label: 'Информация по занятию' },
];

// Заглушка учеников — TODO: получать из API по courseGroupId
const MOCK_STUDENTS: StudentRow[] = [
    { id: 's1', name: 'Вася П.М.', isPresent: false, score: '' },
    { id: 's2', name: 'Вася П.М.', isPresent: false, score: '' },
    { id: 's3', name: 'Вася П.М.', isPresent: false, score: '' },
    { id: 's4', name: 'Вася П.М.', isPresent: false, score: '' },
    { id: 's5', name: 'Вася П.М.', isPresent: false, score: '' },
];

// ============================================
// HELPERS
// ============================================

function formatFileSize(bytes: number): string {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
    return `${Math.round(bytes / 1024)} КБ`;
}

// ============================================
// ATTENDANCE TABLE
// ============================================

interface AttendanceTableProps {
    students: StudentRow[];
    onToggle: (id: string) => void;
    onScore: (id: string, val: string) => void;
}

const AttendanceTable: FC<AttendanceTableProps> = ({ students, onToggle, onScore }) => (
    <div className={styles.table}>
        {/* Заголовок */}
        <div className={styles.tableHeader}>
            <span className={styles.thStudent}>Ученик</span>
            <div className={styles.thDivider} />
            <span className={styles.thPresent}>Был</span>
            <div className={styles.thDivider} />
            <span className={styles.thScore}>Балл</span>
        </div>

        {/* Строки */}
        <div className={`${styles.tableBody} ${styles.tableBodyScroll}`}>
            {students.map((s, idx) => (
                <div
                    key={s.id}
                    className={`${styles.tableRow} ${idx < students.length - 1 ? styles.tableRowBorder : ''}`}
                >
                    {/* Ученик */}
                    <div className={styles.tdStudent}>
                        {s.avatarUrl
                            ? <img src={s.avatarUrl} alt="" className={styles.avatar} />
                            : <div className={styles.avatarPlaceholder} />
                        }
                        <span className={styles.studentName}>{s.name}</span>
                    </div>

                    <div className={styles.colDivider} />

                    {/* Был */}
                    <div className={styles.tdPresent}>
                        <button
                            className={styles.checkBtn}
                            onClick={() => onToggle(s.id)}
                            aria-label={s.isPresent ? 'Отметить отсутствие' : 'Отметить присутствие'}
                        >
                            <div className={`${styles.checkbox} ${s.isPresent ? styles.checkboxChecked : ''}`}>
                                {s.isPresent && (
                                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
                                        <path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>

                    <div className={styles.colDivider} />

                    {/* Балл */}
                    <div className={styles.tdScore}>
                        {s.isPresent ? (
                            <div className={styles.scoreBox}>
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={s.score}
                                    placeholder="—"
                                    className={styles.scoreInput}
                                    onChange={e => onScore(s.id, e.target.value)}
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
// FILE ROW
// ============================================

const FileRow: FC<{ name: string; size: string; onDelete: () => void }> = ({ name, size, onDelete }) => (
    <div className={styles.fileRow}>
        <img src={fileIcon} alt="" className={styles.fileRowIcon} />
        <span className={styles.fileRowName}>{name}</span>
        <span className={styles.fileRowSize}>{size}</span>
        <button className={styles.fileRowDelete} onClick={onDelete} aria-label="Удалить файл">
            <img src={deleteIcon} alt="" className={styles.fileRowIcon} />
        </button>
    </div>
);

// ============================================
// UPLOAD BUTTON
// ============================================

const UploadButton: FC<{ onChange: (files: FileList) => void }> = ({ onChange }) => (
    <label className={styles.uploadBtn}>
        <img src={uploadIcon} alt="" className={styles.uploadIcon} />
        <span className={styles.uploadText}>Загрузить файл</span>
        <input
            type="file"
            className={styles.uploadInput}
            onChange={e => e.target.files && onChange(e.target.files)}
        />
    </label>
);

// ============================================
// FILE SECTION
// ============================================

const FileSection: FC<{
    title: string;
    files: LessonFile[];
    onDelete: (i: number) => void;
    onUpload: (fl: FileList) => void;
}> = ({ title, files, onDelete, onUpload }) => (
    <div className={styles.fileSection}>
        <div className={styles.fileSectionInner}>
            <div className={styles.fileSectionCard}>
                <span className={styles.fileSectionTitle}>{title}</span>
                {files.map((f, i) => (
                    <FileRow key={i} name={f.name} size={f.size} onDelete={() => onDelete(i)} />
                ))}
                {files.length === 0 && <p className={styles.emptyText}>Нет файлов</p>}
            </div>
            <UploadButton onChange={onUpload} />
        </div>
    </div>
);

// ============================================
// FILES TAB
// ============================================

const FilesTab: FC<{
    lessonFiles: LessonFile[];
    homeworkFiles: LessonFile[];
    onDeleteLesson: (i: number) => void;
    onDeleteHomework: (i: number) => void;
    onUploadLesson: (fl: FileList) => void;
    onUploadHomework: (fl: FileList) => void;
}> = (props) => (
    <div className={styles.filesTab}>
        <FileSection
            title="Файлы к занятию"
            files={props.lessonFiles}
            onDelete={props.onDeleteLesson}
            onUpload={props.onUploadLesson}
        />
        <FileSection
            title="Домашнее задание"
            files={props.homeworkFiles}
            onDelete={props.onDeleteHomework}
            onUpload={props.onUploadHomework}
        />
    </div>
);

// ============================================
// INFO TAB — поля формы
// ============================================

const InfoTab: FC<{
    form: CreateLessonForm;
    onChange: (field: keyof CreateLessonForm, val: string) => void;
}> = ({ form, onChange }) => (
    <div className={styles.infoTab}>
        {/* Описание к занятию */}
        <div className={styles.infoField}>
            <label className={styles.infoLabel}>Описание к занятию</label>
            <input
                type="text"
                className={styles.infoInput}
                value={form.description}
                onChange={e => onChange('description', e.target.value)}
                placeholder=""
            />
        </div>

        {/* Дата проведения */}
        <div className={styles.infoField}>
            <label className={styles.infoLabel}>Дата проведения</label>
            <input
                type="text"
                className={styles.infoInput}
                value={form.date}
                onChange={e => onChange('date', e.target.value)}
                placeholder="дд.мм.гггг чч:мм – чч:мм"
            />
        </div>

        {/* Место проведения */}
        <div className={styles.infoField}>
            <label className={styles.infoLabel}>Место проведения</label>
            <div className={styles.infoInputWrap}>
                <img src={locationIcon} alt="" className={styles.infoInputIcon} />
                <input
                    type="text"
                    className={`${styles.infoInput} ${styles.infoInputWithIcon}`}
                    value={form.location}
                    onChange={e => onChange('location', e.target.value)}
                    placeholder="Главный корпус, ул. Фрунзе, 6, ауд. 205"
                />
            </div>
        </div>
    </div>
);

// ============================================
// MODAL
// ============================================

interface CreateLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: {
        form: CreateLessonForm;
        students: StudentRow[];
    }) => void;
}

const EMPTY_FORM: CreateLessonForm = {
    topic: '',
    description: '',
    date: '',
    location: '',
    lessonFiles: [],
    homeworkFiles: [],
};

export const CreateLessonModal: FC<CreateLessonModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [activeTab, setActiveTab] = useState<TabId>('attendance');
    const [form, setForm] = useState<CreateLessonForm>(EMPTY_FORM);
    const [students, setStudents] = useState<StudentRow[]>(MOCK_STUDENTS);

    // Сброс при закрытии
    useEffect(() => {
        if (!isOpen) {
            setForm(EMPTY_FORM);
            setStudents(MOCK_STUDENTS);
            setActiveTab('attendance');
        }
    }, [isOpen]);

    // Escape
    useEffect(() => {
        if (!isOpen) return;
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', h);
        return () => document.removeEventListener('keydown', h);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleFormField = (field: keyof CreateLessonForm, val: string) =>
        setForm(prev => ({ ...prev, [field]: val }));

    const handleToggle = (id: string) =>
        setStudents(prev => prev.map(s =>
            s.id === id ? { ...s, isPresent: !s.isPresent, score: s.isPresent ? '' : s.score } : s
        ));

    const handleScore = (id: string, val: string) =>
        setStudents(prev => prev.map(s => s.id === id ? { ...s, score: val } : s));

    const addFiles = (field: 'lessonFiles' | 'homeworkFiles', fl: FileList) => {
        const next = Array.from(fl).map(f => ({ name: f.name, size: formatFileSize(f.size) }));
        setForm(prev => ({ ...prev, [field]: [...prev[field], ...next] }));
    };

    const deleteFile = (field: 'lessonFiles' | 'homeworkFiles', idx: number) =>
        setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));

    const handleSubmit = () => {
        onSubmit?.({ form, students });
        onClose();
    };

    return (
        <div
            className={styles.overlay}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-label="Создать занятие"
        >
            {/* Модалка — w:705 br:16 */}
            <div className={styles.modal}>

                {/* Кнопка × */}
                <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M1 1L17 17M17 1L1 17" stroke="#21242B" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Название занятия (редактируемое) */}
                <div className={styles.topicWrap}>
                    <input
                        type="text"
                        className={styles.topicInput}
                        value={form.topic}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormField('topic', e.target.value)}
                        placeholder="Название занятия"
                        aria-label="Название занятия"
                    />
                </div>

                {/* Вкладки */}
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
                            {activeTab === tab.id && <span className={styles.tabUnderline} aria-hidden="true" />}
                        </button>
                    ))}
                </div>

                {/* Контент вкладки */}
                <div className={styles.tabContent} role="tabpanel">
                    {activeTab === 'attendance' && (
                        <AttendanceTable
                            students={students}
                            onToggle={handleToggle}
                            onScore={handleScore}
                        />
                    )}
                    {activeTab === 'files' && (
                        <FilesTab
                            lessonFiles={form.lessonFiles}
                            homeworkFiles={form.homeworkFiles}
                            onDeleteLesson={i => deleteFile('lessonFiles', i)}
                            onDeleteHomework={i => deleteFile('homeworkFiles', i)}
                            onUploadLesson={fl => addFiles('lessonFiles', fl)}
                            onUploadHomework={fl => addFiles('homeworkFiles', fl)}
                        />
                    )}
                    {activeTab === 'info' && (
                        <InfoTab form={form} onChange={handleFormField} />
                    )}
                </div>

                {/* Кнопки — w:292 h:42 gap:16, прижаты вправо */}
                <div className={styles.footerBtns}>
                    {/* Отмена — w:100 h:42 br:8 bg:#E5E6E9 shadow */}
                    <button className={styles.btnCancel} onClick={onClose}>
                        Отмена
                    </button>
                    {/* Создать занятие — w:176 h:42 br:8 bg:#D9EDFF shadow */}
                    <button className={styles.btnSubmit} onClick={handleSubmit}>
                        Создать занятие
                    </button>
                </div>

            </div>
        </div>
    );
};