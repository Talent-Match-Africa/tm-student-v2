'use client';

import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import type { IconSvgElement } from '@hugeicons/react';
import {
  FieldRequirementBadge,
  type FieldRequirement,
} from './FieldRequirementBadge';
import { HugeIcon } from './HugeIcon';
import styles from './InputField.module.css';

export interface InputFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  icon: IconSvgElement;
  label: string;
  error?: string;
  requirement?: FieldRequirement;
  requirementLabel?: string;
  rightElement?: ReactNode;
  preserveCase?: boolean;
}

export function InputField({
  className,
  error,
  icon,
  id,
  label,
  requirement,
  requirementLabel,
  rightElement,
  preserveCase = false,
  ...props
}: InputFieldProps) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;

  const describedBy = [
    props['aria-describedby'],
    error ? `${inputId}-error` : undefined,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={clsx(styles.field, preserveCase && styles.preserveCase)}>
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
          className,
        )}
        data-invalid={error ? 'true' : undefined}
      >
        <span className={styles.leadingIcon} aria-hidden="true">
          <HugeIcon icon={icon} size={20} />
        </span>

        <input
          {...props}
          aria-describedby={describedBy}
          aria-invalid={error ? true : props['aria-invalid']}
          className={clsx(
            styles.input,
            rightElement && styles.inputWithRightElement,
          )}
          id={inputId}
        />

        {rightElement ? (
          <span className={styles.rightElement}>{rightElement}</span>
        ) : null}
      </div>

      {error ? (
        <p className="tm-field-error" id={`${inputId}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
