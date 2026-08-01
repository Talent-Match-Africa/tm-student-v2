"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Loading03Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { useToast } from "@/components/shared/ToastProvider";
import type { StudentProfileMutationResponse } from "@/types/student-profile";
import {
  isSuccessfulMutation,
  readStudentProfileError,
  requestStudentProfile,
} from "./utils";
import styles from "./StudentEmailChangeConfirmation.module.css";

interface StudentEmailChangeConfirmationProps {
  token: string;
}

type ConfirmationState = "confirming" | "success" | "error";

export function StudentEmailChangeConfirmation({
  token,
}: StudentEmailChangeConfirmationProps) {
  const router = useRouter();
  const { showSuccessToast } = useToast();
  const startedRef = useRef(false);
  const [state, setState] = useState<ConfirmationState>("confirming");
  const [message, setMessage] = useState(
    "Verifying the secure link and updating your account email.",
  );

  const confirmEmail = useCallback(async () => {
    if (!token) {
      setState("error");
      setMessage(
        "This verification link is incomplete. Request a new link from your profile.",
      );
      return;
    }

    setState("confirming");
    setMessage("Verifying the secure link and updating your account email.");
    const result = await requestStudentProfile<StudentProfileMutationResponse>(
      "/api/student/profile/email-change/confirm",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      },
    );

    if (
      !result.ok ||
      !isSuccessfulMutation<StudentProfileMutationResponse>(result.payload)
    ) {
      setState("error");
      setMessage(
        readStudentProfileError(result.payload) ??
          result.transportError ??
          "The email verification could not be completed.",
      );
      return;
    }

    setState("success");
    setMessage(`Your student email is now ${result.payload.data.email}.`);
    showSuccessToast(result.payload.message);
    router.refresh();
  }, [router, showSuccessToast, token]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    window.history.replaceState({}, "", "/profile/email/confirm");
    void confirmEmail();
  }, [confirmEmail]);

  const icon =
    state === "success"
      ? CheckmarkCircle02Icon
      : state === "error"
        ? AlertCircleIcon
        : Loading03Icon;

  return (
    <section
      aria-labelledby="email-confirmation-title"
      aria-live="polite"
      className={styles.page}
    >
      <header className={styles.header}>
        <span>Student security</span>
        <h1 id="email-confirmation-title">Verify account email</h1>
        <p>The requested address is applied only after this secure check.</p>
      </header>

      <div className={styles.statusPanel} data-state={state}>
        <span className={styles.statusIcon} aria-hidden="true">
          <HugeIcon icon={icon} size={30} />
        </span>
        <div className={styles.copy}>
          <span>
            {state === "confirming"
              ? "Verification in progress"
              : "Verification result"}
          </span>
          <h2>
            {state === "confirming"
              ? "Confirming your email"
              : state === "success"
                ? "Email updated"
                : "Link could not be verified"}
          </h2>
          <p>{message}</p>
        </div>

        <div className={styles.actions}>
          {state === "error" && token ? (
            <AuthButton
              icon={RefreshIcon}
              onClick={() => void confirmEmail()}
              variant="secondary"
            >
              Try again
            </AuthButton>
          ) : null}
          <AuthButton
            disabled={state === "confirming"}
            icon={ArrowLeft01Icon}
            onClick={() => router.push("/profile")}
            variant={state === "success" ? "primary" : "secondary"}
          >
            Return to profile
          </AuthButton>
        </div>
      </div>
    </section>
  );
}
