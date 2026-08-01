"use client";

import Link from "next/link";
import { InboxIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import clsx from "clsx";
import { AuthButton } from "./AuthButton";
import { HugeIcon } from "./HugeIcon";
import styles from "./EmptyState.module.css";

export interface EmptyStateAction {
  href?: string;
  icon: IconSvgElement;
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
}

interface EmptyStateProps {
  action?: EmptyStateAction;
  actions?: EmptyStateAction[];
  className?: string;
  eyebrow?: string;
  icon?: IconSvgElement;
  message: string;
  title: string;
}

export function EmptyState({
  action,
  actions,
  className,
  eyebrow = "Nothing to show",
  icon = InboxIcon,
  message,
  title,
}: EmptyStateProps) {
  /*
   * Keep supporting the existing `action` prop so other places using
   * EmptyState do not immediately break.
   */
  const availableActions = actions ?? (action ? [action] : []);

  return (
    <section className={clsx(styles.emptyState, className)} role="status">
      <div className={styles.graphics} aria-hidden="true">
        <span className={styles.orbit} />
        <span className={styles.dotOne} />
        <span className={styles.dotTwo} />
        <span className={styles.dotThree} />
        <span className={styles.panelOne} />
        <span className={styles.panelTwo} />
      </div>

      <div className={styles.iconWrap} aria-hidden="true">
        <HugeIcon icon={icon} size={30} />
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>

      {availableActions.length > 0 ? (
        <div className={styles.actions}>
          {availableActions.map((item) => (
            <EmptyStateActionButton action={item} key={item.label} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function EmptyStateActionButton({ action }: { action: EmptyStateAction }) {
  if (action.href) {
    return (
      <Link className={styles.actionLink} href={action.href}>
        <span className={styles.actionIcon} aria-hidden="true">
          <HugeIcon icon={action.icon} size={16} />
        </span>

        <span>{action.label}</span>
      </Link>
    );
  }

  return (
    <div className={styles.actionButtonWrap}>
      <AuthButton
        className={styles.actionButton}
        icon={action.icon}
        onClick={action.onClick}
        type="button"
        variant={action.variant}
      >
        {action.label}
      </AuthButton>
    </div>
  );
}
