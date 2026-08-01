"use client";

import { useState } from "react";
import {
  CheckmarkCircle02Icon,
  LockPasswordIcon,
  Mail01Icon,
  SentIcon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { InputField } from "@/components/shared/InputField";
import styles from "./StudentProfileEmailStep.module.css";
import { formatEmailChangeExpiry } from "./utils";

interface StudentProfileEmailStepProps {
  currentEmail: string;
  currentPassword: string;
  errors: Record<string, string>;
  isVerified: boolean;
  newEmail: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewEmailChange: (value: string) => void;
  pendingEmailChange: {
    new_email: string;
    expires_at: string;
  } | null;
}

export function StudentProfileEmailStep({
  currentEmail,
  currentPassword,
  errors,
  isVerified,
  newEmail,
  onCurrentPasswordChange,
  onNewEmailChange,
  pendingEmailChange,
}: StudentProfileEmailStepProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.section}>
      <div className={styles.currentEmail}>
        <div className={styles.currentIcon} aria-hidden="true">
          <HugeIcon icon={Mail01Icon} size={20} />
        </div>
        <div>
          <span>Current account email</span>
          <strong>{currentEmail || "No email assigned"}</strong>
        </div>
        <span className={styles.verified} data-verified={isVerified}>
          <HugeIcon icon={CheckmarkCircle02Icon} size={14} />
          {isVerified ? "Verified" : "Verification required"}
        </span>
      </div>

      {pendingEmailChange ? (
        <div className={styles.pending} role="status">
          <HugeIcon icon={SentIcon} size={19} />
          <div>
            <strong>Verification pending</strong>
            <span>
              Open the single-use link sent to {pendingEmailChange.new_email}.
              It expires{" "}
              {formatEmailChangeExpiry(pendingEmailChange.expires_at)}. Your
              current email remains active until verification succeeds.
            </span>
          </div>
        </div>
      ) : null}

      <div className={styles.fields}>
        <InputField
          autoCapitalize="none"
          autoComplete="email"
          error={errors.new_email}
          icon={Mail01Icon}
          label="New email address"
          name="new_email"
          onChange={(event) => onNewEmailChange(event.target.value)}
          placeholder="admin.operations@talentmatch.rw"
          preserveCase
          requirement="required"
          spellCheck={false}
          type="email"
          value={newEmail}
        />
        <InputField
          autoComplete="current-password"
          error={errors.current_password}
          icon={LockPasswordIcon}
          label="Current password"
          name="email_current_password"
          onChange={(event) => onCurrentPasswordChange(event.target.value)}
          preserveCase
          requirement="required"
          rightElement={
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              <HugeIcon
                icon={showPassword ? ViewOffIcon : ViewIcon}
                size={16}
              />
            </button>
          }
          type={showPassword ? "text" : "password"}
          value={currentPassword}
        />
      </div>

      <p className={styles.guidance}>
        The address changes only after you open the verification link. Links
        expire after 30 minutes and older requests are invalidated
        automatically.
      </p>
    </div>
  );
}
