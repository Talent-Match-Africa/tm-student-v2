"use client";

import { MinusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useEffect, useRef } from "react";
import { HugeIcon } from "@/components/shared/HugeIcon";
import styles from "./SelectionCheckbox.module.css";

interface SelectionCheckboxProps {
  checked: boolean;
  description?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  label: string;
  name?: string;
  onChange: (checked: boolean) => void;
  presentation?: "compact" | "labeled";
}

export function SelectionCheckbox({
  checked,
  description,
  disabled = false,
  indeterminate = false,
  label,
  name,
  onChange,
  presentation = "compact",
}: SelectionCheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={styles.control}
      data-presentation={presentation}
      title={presentation === "compact" ? label : undefined}
    >
      <input
        aria-checked={indeterminate ? "mixed" : checked}
        aria-label={presentation === "compact" ? label : undefined}
        checked={checked}
        disabled={disabled}
        name={name}
        onChange={(event) => onChange(event.target.checked)}
        ref={inputRef}
        type="checkbox"
      />
      <span aria-hidden="true" className={styles.indicator}>
        <HugeIcon icon={indeterminate ? MinusSignIcon : Tick02Icon} size={14} />
      </span>
      {presentation === "labeled" ? (
        <span className={styles.copy}>
          <strong>{label}</strong>
          {description ? <small>{description}</small> : null}
        </span>
      ) : null}
    </label>
  );
}
