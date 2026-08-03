import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './FieldRequirementBadge.module.css';

export type FieldRequirement = 'required' | 'optional' | 'conditional';

interface FieldRequirementBadgeProps {
  children?: ReactNode;
  requirement?: FieldRequirement;
}

const defaultRequirementLabels: Record<FieldRequirement, string> = {
  conditional: 'Required when needed',
  optional: 'Optional',
  required: 'Required',
};

export function FieldRequirementBadge({
  children,
  requirement,
}: FieldRequirementBadgeProps) {
  if (!requirement) {
    return null;
  }

  return (
    <span
      className={clsx(
        styles.badge,
        styles[requirement],
        'tm-field-requirement',
        `tm-field-requirement-${requirement}`,
      )}
    >
      {children ?? defaultRequirementLabels[requirement]}
    </span>
  );
}
