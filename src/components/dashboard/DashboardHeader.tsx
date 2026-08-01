import { CheckmarkCircle02Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import styles from "./DashboardHeader.module.css";

export function DashboardHeader({ hasDocument, name, profilePercent }: { hasDocument: boolean; name: string; profilePercent: number }) {
  return <header className={styles.header}><div className={styles.copy}><span>Student journey</span><h1>Welcome back, {name}</h1><p>Keep your profile ready, track your applications, and prepare for what comes next.</p></div><div className={styles.context} aria-label="Profile readiness"><div><span className={styles.contextIcon} aria-hidden="true"><HugeIcon icon={CheckmarkCircle02Icon} size={17} /></span><p><span>Profile readiness</span><strong>{profilePercent}% complete</strong></p></div><div><span className={styles.contextIcon} aria-hidden="true"><HugeIcon icon={File01Icon} size={17} /></span><p><span>Career document</span><strong>{hasDocument ? "Document ready" : "Document needed"}</strong></p></div></div></header>;
}
