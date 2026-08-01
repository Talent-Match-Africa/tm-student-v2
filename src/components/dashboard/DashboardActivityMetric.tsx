import Link from "next/link";
import { MinusSignIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { formatDashboardCount } from "./utils";
import styles from "./DashboardActivityMetric.module.css";

export function DashboardActivityMetric({ count, description, href, icon, label }: { count: number; description: string; href: string; icon: IconSvgElement; label: string }) { return <Link className={styles.metric} href={href}><span className={styles.icon} aria-hidden="true"><HugeIcon icon={icon} size={17} /></span><span className={styles.copy}><span>{label}</span><small>{description}</small></span><strong>{formatDashboardCount(count)}</strong><span aria-label="Current application count" className={styles.trend} data-trend="NONE"><HugeIcon icon={MinusSignIcon} size={13} />Current</span></Link>; }
