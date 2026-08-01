import { Calendar03Icon } from "@hugeicons/core-free-icons";
import type { DashboardAppointment } from "@/types/student-dashboard";
import { DashboardCountLink } from "./DashboardCountLink";
import { formatDashboardDate } from "./utils";
import styles from "./DashboardAttention.module.css";

export function DashboardAttention({ appointments }: { appointments: DashboardAppointment[] }) { return <section className={styles.section} aria-labelledby="dashboard-attention-title"><header className={styles.header}><div><span>Guidance schedule</span><h2 id="dashboard-attention-title">Coming up</h2></div><strong aria-label={`${appointments.length} upcoming appointments`}>{appointments.length}</strong></header><div className={styles.list}>{appointments.length ? appointments.map((item) => <DashboardCountLink count={1} description={`${item.counselor.name ?? "Counselor"} · ${formatDashboardDate(item.date)}`} href="/appointments?upcoming=true" icon={Calendar03Icon} key={item.id} label={item.subject} variant="attention" />) : <DashboardCountLink count={0} description="Book a confidential guidance session" href="/counselors" icon={Calendar03Icon} label="No upcoming sessions" variant="attention" />}</div></section>; }
