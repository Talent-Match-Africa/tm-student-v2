import styles from "./loading.module.css";

export default function OpportunityListLoading() {
  return (
    <div className={styles.workspace} role="status" aria-label="Loading opportunities">
      <div className={styles.header}>
        <span />
        <span />
      </div>
      <div className={styles.filter} />
      <div className={styles.content}>
        <div className={styles.rail} />
        <div className={styles.grid}>
          {Array.from({ length: 6 }, (_, index) => (
            <div className={styles.card} key={index} />
          ))}
        </div>
      </div>
      <span className={styles.srOnly}>Loading opportunities</span>
    </div>
  );
}
