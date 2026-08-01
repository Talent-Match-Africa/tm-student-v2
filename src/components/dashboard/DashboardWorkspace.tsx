import type { StudentDashboardResponse } from "@/types/student-dashboard";
import { DashboardActivity } from "./DashboardActivity";
import { DashboardAttention } from "./DashboardAttention";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardOutcomes } from "./DashboardOutcomes";
import { DashboardShortcuts } from "./DashboardShortcuts";
import { DashboardTotals } from "./DashboardTotals";
import styles from "./DashboardWorkspace.module.css";

export function DashboardWorkspace({ data, name }: { data: StudentDashboardResponse["data"]; name: string }) { return <div className={styles.workspace}><DashboardHeader hasDocument={data.completion.has_document} name={name} profilePercent={data.completion.profile_percent} /><DashboardShortcuts /><DashboardTotals data={data} /><div className={styles.operationalGrid}><DashboardActivity statuses={data.applications_by_status} /><DashboardAttention appointments={data.upcoming_appointments} /></div><DashboardOutcomes resources={data.recent_resources} /></div>; }
