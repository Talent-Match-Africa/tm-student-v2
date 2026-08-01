import Link from "next/link";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { formatDashboardCount } from "./utils";
import styles from "./DashboardCountLink.module.css";

export function DashboardCountLink({ count, description, href, icon, label, variant }: { count: number; description: string; href: string; icon: IconSvgElement; label: string; variant: "attention" | "outcome" }) { return <Link className={styles.link} data-variant={variant} href={href}><span className={styles.icon} aria-hidden="true"><HugeIcon icon={icon} size={17} /></span><span className={styles.copy}><span>{label}</span><small>{description}</small></span><strong>{formatDashboardCount(count)}</strong><span className={styles.arrow} aria-hidden="true"><HugeIcon icon={ArrowRight01Icon} size={15} /></span></Link>; }
