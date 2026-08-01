'use client';

import { type TextareaHTMLAttributes, useId } from 'react';
import clsx from 'clsx';
import type { IconSvgElement } from '@hugeicons/react';
import {
  FieldRequirementBadge,
  type FieldRequirement,
} from './FieldRequirementBadge';
import { HugeIcon } from './HugeIcon';
import styles from './TextareaField.module.css';

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon: IconSvgElement;
  label: string;
  error?: string;
  requirement?: FieldRequirement;
  requirementLabel?: string;
}

export function TextareaField({
  className,
  error,
  icon,
  id,
  label,
  requirement,
  requirementLabel,
  ...props
}: TextareaFieldProps) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;

  const describedBy =
    [props['aria-describedby'], error ? `${inputId}-error` : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div className={styles.field}>
      <label
        className={clsx(styles.label, 'tm-field-label-row')}
        htmlFor={inputId}
      >
        <span className="tm-field-label-text">{label}</span>
        <FieldRequirementBadge requirement={requirement}>
          {requirementLabel}
        </FieldRequirementBadge>
      </label>

      <div
        className={clsx(
          styles.control,
          error && styles.controlError,
          props.disabled && styles.controlDisabled,
        )}
      >
        <span className={styles.leadingIcon} aria-hidden="true">
          <HugeIcon icon={icon} size={20} />
        </span>

        <textarea
          {...props}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={clsx(styles.textarea, className)}
          id={inputId}
        />
      </div>

      {error ? (
        <p className="tm-field-error" id={`${inputId}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
