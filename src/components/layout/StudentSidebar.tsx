"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ArrowLeft01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { STUDENT_SIDEBAR_LINKS } from "@/constants/student-sidebar";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { StudentSidebarItem } from "./StudentSidebarItem";
import { isStudentSidebarLinkActive } from "./student-sidebar-utils";
import styles from "./StudentSidebar.module.css";

const SIDEBAR_PREF_KEY = "tm_student_sidebar_state";

interface StudentSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}

export function StudentSidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}: StudentSidebarProps) {
  const pathname = usePathname() ?? "";
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    try {
      const preference = window.localStorage.getItem(SIDEBAR_PREF_KEY);
      if (
        (preference === "collapsed" && !collapsed) ||
        (preference === "expanded" && collapsed)
      ) {
        onToggleCollapsed();
      }
    } catch {
      // Layout preferences are optional and contain no session information.
    }
    // The saved preference is read once after hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle() {
    const nextCollapsed = !collapsed;
    onToggleCollapsed();
    try {
      window.localStorage.setItem(
        SIDEBAR_PREF_KEY,
        nextCollapsed ? "collapsed" : "expanded",
      );
    } catch {
      // A storage failure must not block navigation.
    }
  }

  return (
    <aside
      aria-label="Student sidebar navigation"
      className={clsx(
        styles.sidebar,
        collapsed && styles.sidebarCollapsed,
        mobileOpen && styles.sidebarMobileOpen,
      )}
    >
      <div className={styles.sidebarSurface}>
        <div className={styles.brandRow}>
          <Link
            aria-label="Talent Match student dashboard"
            className={styles.brand}
            href="/dashboard"
            onClick={onCloseMobile}
          >
            <span className={styles.brandMark}>TM</span>
            <span className={styles.brandName}>Talent Match</span>
          </Link>
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            className={styles.toggleButton}
            onClick={toggle}
            type="button"
          >
            <HugeIcon
              icon={collapsed ? Menu01Icon : ArrowLeft01Icon}
              size={18}
            />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Student sections">
          <ul className={styles.navList}>
            {STUDENT_SIDEBAR_LINKS.map((item) => (
              <StudentSidebarItem
                active={isStudentSidebarLinkActive(pathname, item)}
                collapsed={collapsed}
                item={item}
                key={item.href}
                onClick={onCloseMobile}
              />
            ))}
          </ul>
        </nav>
        <p className={styles.copyright}>© {currentYear} Talent Match</p>
      </div>
    </aside>
  );
}
