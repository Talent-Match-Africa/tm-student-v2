"use client";

import type { FormEventHandler, ReactNode, Ref } from "react";
import styles from "./ManagementFormShell.module.css";

interface ManagementFormShellProps {
  actions: ReactNode;
  banner?: ReactNode;
  children: ReactNode;
  description: string;
  eyebrow: string;
  formError?: ReactNode;
  formRef?: Ref<HTMLFormElement>;
  headerAction?: ReactNode;
  isSaving?: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  progressPercent: number;
  savingLabel?: string;
  stepDescription?: string;
  stepLabel: string;
  stepNavigation: ReactNode;
  stepTitle: string;
  title: string;
  titleId: string;
}

export function ManagementFormShell({
  actions,
  banner,
  children,
  description,
  eyebrow,
  formError,
  formRef,
  headerAction,
  isSaving = false,
  onSubmit,
  progressPercent,
  savingLabel = "Saving changes",
  stepDescription,
  stepLabel,
  stepNavigation,
  stepTitle,
  title,
  titleId,
}: ManagementFormShellProps) {
  const boundedProgress = Math.min(100, Math.max(0, progressPercent));

  return (
    <section className={styles.page} aria-labelledby={titleId}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1 id={titleId}>{title}</h1>
          <p>{description}</p>
        </div>
        {headerAction ? (
          <div className={styles.headerAction}>{headerAction}</div>
        ) : null}
      </header>

      {banner}

      <div className={styles.progressTrack} aria-hidden="true">
        <span
          className={styles.progressFill}
          style={{ width: `${boundedProgress}%` }}
        />
      </div>

      <form className={styles.shell} onSubmit={onSubmit} ref={formRef}>
        {stepNavigation}

        <div className={styles.formPanel}>
          {isSaving ? (
            <div
              aria-live="polite"
              className={styles.savingOverlay}
              role="status"
            >
              <span className={styles.spinner} aria-hidden="true" />
              <span>{savingLabel}</span>
            </div>
          ) : null}

          <header className={styles.formHeader}>
            <span>{stepLabel}</span>
            <h2>{stepTitle}</h2>
            {stepDescription ? <p>{stepDescription}</p> : null}
          </header>

          {formError}

          <div className={styles.content}>{children}</div>

          <footer className={styles.actions}>{actions}</footer>
        </div>
      </form>
    </section>
  );
}
