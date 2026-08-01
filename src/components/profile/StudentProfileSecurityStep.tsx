"use client";

import { useState } from "react";
import {
  LockPasswordIcon,
  SecurityCheckIcon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { InputField } from "@/components/shared/InputField";
import styles from "./StudentProfileSecurityStep.module.css";
import { getPasswordRequirements } from "./utils";

interface StudentProfileSecurityStepProps {
  confirmPassword: string;
  currentPassword: string;
  errors: Record<string, string>;
  newPassword: string;
  onConfirmPasswordChange: (value: string) => void;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
}

export function StudentProfileSecurityStep({
  confirmPassword,
  currentPassword,
  errors,
  newPassword,
  onConfirmPasswordChange,
  onCurrentPasswordChange,
  onNewPasswordChange,
}: StudentProfileSecurityStepProps) {
  const [visibleField, setVisibleField] = useState<string | null>(null);
  const requirements = getPasswordRequirements(newPassword);

  function visibilityButton(field: string) {
    const visible = visibleField === field;
    return (
      <button
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisibleField(visible ? null : field)}
        type="button"
      >
        <HugeIcon icon={visible ? ViewOffIcon : ViewIcon} size={16} />
      </button>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.securityNotice}>
        <span aria-hidden="true">
          <HugeIcon icon={SecurityCheckIcon} size={21} />
        </span>
        <div>
          <strong>Secure password change</strong>
          <p>
            Your current browser stays signed in. Every other active session is
            disconnected after the password changes.
          </p>
        </div>
      </div>

      <div className={styles.fields}>
        <InputField
          autoComplete="current-password"
          error={errors.current_password}
          icon={LockPasswordIcon}
          label="Current password"
          name="password_current_password"
          onChange={(event) => onCurrentPasswordChange(event.target.value)}
          preserveCase
          requirement="required"
          rightElement={visibilityButton("current")}
          type={visibleField === "current" ? "text" : "password"}
          value={currentPassword}
        />
        <InputField
          autoComplete="new-password"
          error={errors.new_password}
          icon={LockPasswordIcon}
          label="New password"
          name="new_password"
          onChange={(event) => onNewPasswordChange(event.target.value)}
          preserveCase
          requirement="required"
          rightElement={visibilityButton("new")}
          type={visibleField === "new" ? "text" : "password"}
          value={newPassword}
        />
        <InputField
          autoComplete="new-password"
          error={errors.confirm_password}
          icon={LockPasswordIcon}
          label="Confirm new password"
          name="confirm_password"
          onChange={(event) => onConfirmPasswordChange(event.target.value)}
          preserveCase
          requirement="required"
          rightElement={visibilityButton("confirm")}
          type={visibleField === "confirm" ? "text" : "password"}
          value={confirmPassword}
        />
      </div>

      <ul className={styles.requirements} aria-label="Password requirements">
        {requirements.map((requirement) => (
          <li data-met={requirement.met} key={requirement.key}>
            <HugeIcon icon={SecurityCheckIcon} size={13} />
            {requirement.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
