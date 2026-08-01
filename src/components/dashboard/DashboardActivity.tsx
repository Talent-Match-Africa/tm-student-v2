import { Briefcase01Icon, CancelCircleIcon, SentIcon, StarIcon, ViewIcon } from "@hugeicons/core-free-icons";
import type { StudentDashboardResponse } from "@/types/student-dashboard";
import { DashboardActivityMetric } from "./DashboardActivityMetric";
import styles from "./DashboardActivity.module.css";

const DEFINITIONS = [
  { key: "APPLIED", label: "Applied", description: "Submissions received", icon: SentIcon },
  { key: "UNDER_REVIEW", label: "Under review", description: "Owner review in progress", icon: ViewIcon },
  { key: "SHORTLISTED", label: "Shortlisted", description: "Moved to the next step", icon: StarIcon },
  { key: "HIRED", label: "Hired", description: "Successful applications", icon: Briefcase01Icon },
  { key: "REJECTED", label: "Not selected", description: "Closed application decisions", icon: CancelCircleIcon },
  { key: "WITHDRAWN", label: "Withdrawn", description: "Applications you withdrew", icon: CancelCircleIcon },
] as const;
export function DashboardActivity({ statuses }: { statuses: StudentDashboardResponse["data"]["applications_by_status"] }) { return <section className={styles.section} aria-labelledby="dashboard-activity-title"><header className={styles.header}><div><span>Personal pipeline</span><h2 id="dashboard-activity-title">Application movement</h2></div><p>Your applications grouped by their latest status.</p></header><div className={styles.grid}>{DEFINITIONS.map((item) => <DashboardActivityMetric count={statuses[item.key] ?? 0} description={item.description} href="/applications/job-listings" icon={item.icon} key={item.key} label={item.label} />)}</div></section>; }
