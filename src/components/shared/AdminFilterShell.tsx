"use client";

import type { FormEvent, ReactNode } from "react";
import styles from "./AdminFilterShell.module.css";

interface AdminFilterShellProps {
  actionCount?: 1 | 2 | 3;
  actions: ReactNode;
  ariaLabel: string;
  children?: ReactNode;
  dateControls?: ReactNode;
  dialog?: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function AdminFilterShell({
  actionCount = 3,
  actions,
  ariaLabel,
  children,
  dateControls,
  dialog,
  onSubmit,
}: AdminFilterShellProps) {
  return (
    <section className={styles.panel} aria-label={ariaLabel}>
      <form className={styles.form} onSubmit={onSubmit}>
        {children ? (
          <div className={styles.leftControls}>{children}</div>
        ) : null}
        {dateControls ? (
          <div className={styles.dateControls}>{dateControls}</div>
        ) : null}
        <div className={styles.rightControls} data-action-count={actionCount}>
          {actions}
        </div>
      </form>
      {dialog}
    </section>
  );
}
