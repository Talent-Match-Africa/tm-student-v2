import styles from "./AdminFilterSkeleton.module.css";

interface AdminFilterSkeletonProps {
  actionCount?: 2 | 3;
  showSearch?: boolean;
}

export function AdminFilterSkeleton({
  actionCount = 3,
  showSearch = true,
}: AdminFilterSkeletonProps) {
  return (
    <section aria-hidden="true" className={styles.panel}>
      <div className={styles.form}>
        {showSearch ? (
          <div className={styles.searchControl}>
            <span className={styles.label} />
            <span className={styles.field} />
          </div>
        ) : null}

        <div className={styles.dateControls}>
          <div className={styles.dateControl}>
            <span className={styles.label} />
            <span className={styles.field} />
          </div>
          <div className={styles.dateControl}>
            <span className={styles.label} />
            <span className={styles.field} />
          </div>
        </div>

        <div className={styles.actions} data-action-count={actionCount}>
          {actionCount === 3 ? <span className={styles.button} /> : null}
          <span className={styles.primaryButton} />
          <span className={styles.button} />
        </div>
      </div>
    </section>
  );
}
