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
  const [activeBadge, setActiveBadge] = useState(
    !collapsed && item.badge ? item.badge : null,
  );

  useEffect(() => {
    if (collapsed || !item.badge) {
      setActiveBadge(null);
      return;
    }

    const expiresAt = new Date(item.badge.expiresAt).getTime();

    const updateBadge = () => {
      setActiveBadge(Date.now() < expiresAt ? item.badge! : null);
    };

    updateBadge();

    const timeout = setTimeout(() => {
      setActiveBadge(null);
    }, Math.max(0, expiresAt - Date.now()));

    return () => clearTimeout(timeout);
  }, [collapsed, item.badge]);

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