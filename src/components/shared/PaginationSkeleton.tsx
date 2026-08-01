import styles from "./PaginationSkeleton.module.css";

export function PaginationSkeleton() {
  return (
    <footer aria-hidden="true" className={styles.pagination}>
      <span className={`${styles.placeholder} ${styles.pageButton}`} />
      <span className={`${styles.placeholder} ${styles.pageStatus}`} />
      <span className={`${styles.placeholder} ${styles.pageButton}`} />
    </footer>
  );
}
