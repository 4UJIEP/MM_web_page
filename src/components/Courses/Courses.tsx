import type {FC} from "react";
import styles from './Courses.module.css';

export const Courses: FC = () => {
    return (
        <section className={styles.courses}>
            <div className={styles.container}>
                <h2 className={styles.title}>Курсы</h2>
                <div className={styles.grid}>

                </div>
            </div>
        </section>
    );
};