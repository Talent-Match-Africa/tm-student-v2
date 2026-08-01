"use client";
import Link from "next/link";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type { ApplicationRouteType } from "@/types/applications";
import { APPLICATION_TABS } from "./constants";
import styles from "./ApplicationTypeTabs.module.css";

export function ApplicationTypeTabs({ activeType }: { activeType: ApplicationRouteType }) {
  return <aside className={styles.rail}><p className={styles.railLabel}>Application queues</p><nav aria-label="Application type" className={styles.tabs}>{APPLICATION_TABS.map((tab) => <Link aria-current={activeType === tab.type ? "page" : undefined} className={styles.tab} data-active={activeType === tab.type ? "true" : "false"} href={tab.href} key={tab.type}><span className={styles.icon} aria-hidden="true"><HugeIcon icon={tab.icon} size={17} /></span><span className={styles.copy}><strong>{tab.label}</strong><small>{tab.description}</small></span></Link>)}</nav></aside>;
}
