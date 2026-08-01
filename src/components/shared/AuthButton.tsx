'use client';

import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import type { IconSvgElement } from '@hugeicons/react';
import { HugeIcon } from './HugeIcon';
import styles from './AuthButton.module.css';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconSvgElement;
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function AuthButton({
  children,
  className = '',
  disabled,
  icon,
  isLoading = false,
  loadingLabel = 'Please wait',
  type = 'button',
  variant = 'primary',
  ...props
}: AuthButtonProps) {
  return (
    <button
      aria-busy={isLoading}
      className={clsx(styles.button, styles[variant], className)}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      <span className={styles.iconBox} aria-hidden="true">
        {isLoading ? (
          <span className={clsx(styles.spinner, 'animate-spin')} />
        ) : (
          <HugeIcon icon={icon} size={16} />
        )}
      </span>

      <span className={styles.label}>
        {isLoading ? loadingLabel : children}
      </span>
    </button>
  );
}
