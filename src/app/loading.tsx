import styles from "@/components/shared/SelfService.module.css";

export default function Loading() {
  return (
    <div aria-busy="true" className={styles.empty}>
      Loading your student workspace…
    </div>
  );
}
