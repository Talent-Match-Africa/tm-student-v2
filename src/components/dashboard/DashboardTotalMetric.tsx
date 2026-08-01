import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { formatDashboardCount } from "./utils";
import styles from "./DashboardTotalMetric.module.css";

export function DashboardTotalMetric({ badges, count, description, href, icon, label }: { badges: string[]; count: number; description: string; href: string; icon: IconSvgElement; label: string }) { return <Link className={styles.metric} href={href}><span className={styles.icon} aria-hidden="true"><HugeIcon icon={icon} size={19} /></span><span className={styles.copy}><span>{label}</span><strong>{formatDashboardCount(count)}</strong><small>{description}</small></span><span className={styles.access}>{badges.map((badge, index) => <span data-status={index === 0 ? "active" : undefined} key={badge}>{badge}</span>)}</span><span className={styles.arrow} aria-hidden="true"><HugeIcon icon={ArrowUpRight01Icon} size={16} /></span></Link>; }
