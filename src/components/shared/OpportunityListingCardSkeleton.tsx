import styles from "./OpportunityListingCardSkeleton.module.css";

export function OpportunityListingCardSkeleton() {
  return (
    <article aria-hidden="true" className={styles.card}>
      <header className={styles.ownerHeader}>
        <span className={`${styles.placeholder} ${styles.ownerImage}`} />
        <div className={styles.ownerCopy}>
          <span className={`${styles.placeholder} ${styles.ownerName}`} />
          <span className={`${styles.placeholder} ${styles.ownerType}`} />
        </div>
        <span className={`${styles.placeholder} ${styles.status}`} />
      </header>

      <div className={styles.body}>
        <div className={styles.titleBlock}>
          <span className={`${styles.placeholder} ${styles.eyebrow}`} />
          <span className={`${styles.placeholder} ${styles.title}`} />
        </div>

        <div className={styles.badges}>
          <span className={`${styles.placeholder} ${styles.badge}`} />
          <span className={`${styles.placeholder} ${styles.badge}`} />
          <span className={`${styles.placeholder} ${styles.badgeShort}`} />
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.actions}>
          <span className={`${styles.placeholder} ${styles.statAction}`} />
          <span className={styles.divider} />
          <span
            className={`${styles.placeholder} ${styles.applicationAction}`}
          />
          <span className={styles.divider} />
          <span className={`${styles.placeholder} ${styles.editAction}`} />
          <span className={styles.divider} />
          <span className={`${styles.placeholder} ${styles.deleteAction}`} />
        </div>
      </footer>
    </article>
  );
}
