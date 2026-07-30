"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";
import type { PublicAuthProfile } from "@/types/auth";
import { StudentSidebar } from "./StudentSidebar";
import { StudentTopNav } from "./StudentTopNav";
import styles from "./StudentWorkspaceShell.module.css";

interface StudentWorkspaceShellProps {
  children: ReactNode;
  profile: PublicAuthProfile;
}

export function StudentWorkspaceShell({
  children,
  profile,
}: StudentWorkspaceShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <StudentSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapsed={() => setCollapsed((current) => !current)}
      />
      <button
        aria-label="Close student navigation"
        className={clsx(
          styles.mobileOverlay,
          mobileOpen && styles.mobileOverlayVisible,
        )}
        onClick={() => setMobileOpen(false)}
        type="button"
      />
      <div className={styles.workspace}>
        <StudentTopNav
          onOpenSidebar={() => setMobileOpen(true)}
          profile={profile}
        />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
