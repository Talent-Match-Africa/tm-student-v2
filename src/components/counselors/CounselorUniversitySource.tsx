import styles from "./CounselorUniversitySource.module.css";

export function CounselorUniversitySource({ counselorId, university }: { counselorId: string; university: { id: string; name: string } }) {
  const tooltipId = `counselor-university-source-${counselorId}`;
  return <span className={styles.source} data-active="true"><span aria-describedby={tooltipId} className={styles.link}><span aria-hidden="true" className={styles.dot} /><strong>{university.name}</strong></span><span className={styles.popover} id={tooltipId} role="tooltip"><strong>Your university</strong><span>This counselor is active and available through your university guidance network.</span></span></span>;
}
