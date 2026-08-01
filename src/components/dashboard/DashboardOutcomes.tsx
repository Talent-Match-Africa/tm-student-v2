import { File01Icon, Video01Icon } from "@hugeicons/core-free-icons";
import type { DashboardResource } from "@/types/student-dashboard";
import { DashboardCountLink } from "./DashboardCountLink";
import { formatDashboardDate } from "./utils";
import styles from "./DashboardOutcomes.module.css";

export function DashboardOutcomes({ resources }: { resources: DashboardResource[] }) { return <section className={styles.section} aria-labelledby="dashboard-outcomes-title"><header className={styles.header}><div><span>Career library</span><h2 id="dashboard-outcomes-title">Recent resources</h2></div><p>Recently published guidance selected for your student journey.</p></header><div className={styles.grid}>{resources.length ? resources.map((item) => <DashboardCountLink count={1} description={`${item.type === "VIDEO" ? "Video" : "Document"} · ${formatDashboardDate(item.publishedAt)}`} href={`/resources?search=${encodeURIComponent(item.name)}`} icon={item.type === "VIDEO" ? Video01Icon : File01Icon} key={item.id} label={item.name} variant="outcome" />) : <DashboardCountLink count={0} description="Explore available career guidance" href="/resources" icon={File01Icon} label="Browse resources" variant="outcome" />}</div></section>; }
