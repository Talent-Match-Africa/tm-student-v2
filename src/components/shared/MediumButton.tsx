"use client";

import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeIcon } from "./HugeIcon";
import styles from "./MediumButton.module.css";

interface MediumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconSvgElement;
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: "primary" | "secondary" | "danger";
}

export function MediumButton({
  children,
  className,
  disabled,
  icon,
  isLoading = false,
  loadingLabel = "Please wait",
  type = "button",
  variant = "secondary",
  ...props
}: MediumButtonProps) {
  return (
    <button
      aria-busy={isLoading}
      className={clsx(styles.button, styles[variant], className)}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <HugeIcon icon={icon} size={14} />
      )}
      <span>{isLoading ? loadingLabel : children}</span>
    </button>
  );
}
