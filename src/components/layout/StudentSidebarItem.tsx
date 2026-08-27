import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

import type { StudentSidebarLink } from "@/constants/student-sidebar";
import { HugeIcon } from "@/components/shared/HugeIcon";

import styles from "./StudentSidebar.module.css";

interface StudentSidebarItemProps {
  active: boolean;
  collapsed: boolean;
  item: StudentSidebarLink;
  onClick: () => void;
}

export function StudentSidebarItem({
  active,
  collapsed,
  item,
  onClick,
}: StudentSidebarItemProps) {
  const [now, setNow] = useState(() => Date.now());

  const expiresAt = item.badge
    ? new Date(item.badge.expiresAt).getTime()
    : null;

  useEffect(() => {
    if (collapsed || expiresAt === null) {
      return;
    }

    const remaining = expiresAt - Date.now();

    if (remaining <= 0) {
      return;
    }

    const timeout = setTimeout(() => {
      setNow(Date.now());
    }, remaining);

    return () => clearTimeout(timeout);
  }, [collapsed, expiresAt]);

  const activeBadge =
    !collapsed &&
    item.badge &&
    expiresAt !== null &&
    expiresAt > now
      ? item.badge
      : null;

  return (
    <li className={styles.navItem}>
      <Link
        aria-current={active ? "page" : undefined}
        aria-label={collapsed ? item.label : undefined}
        className={clsx(styles.navLink, active && styles.navLinkActive)}
        href={item.href}
        onClick={onClick}
        title={collapsed ? item.label : undefined}
      >
        <span className={styles.navIcon} aria-hidden="true">
          <HugeIcon icon={item.icon} size={19} />
        </span>

        <span className={styles.navLabel}>{item.label}</span>

        {activeBadge && (
          <span className={styles.newBadge}>{activeBadge.label}</span>
        )}
      </Link>
    </li>
  );
}