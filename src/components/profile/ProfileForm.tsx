"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { StudentProfile } from "@/types/student-self-service";
import styles from "@/components/shared/SelfService.module.css";

export function ProfileForm({ profile }: { profile: StudentProfile }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/student/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = (await response.json()) as { message?: string };
    setPending(false);
    setFeedback(
      response.ok
        ? "Profile saved."
        : (payload.message ?? "Profile could not be saved."),
    );
    if (response.ok) router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label className={styles.field}>
        <span>First name</span>
        <input defaultValue={profile.firstname} name="firstname" required />
      </label>
      <label className={styles.field}>
        <span>Last name</span>
        <input defaultValue={profile.lastname} name="lastname" required />
      </label>
      <label className={styles.field}>
        <span>Phone number</span>
        <input
          defaultValue={profile.phone_number ?? ""}
          name="phone_number"
          type="tel"
        />
      </label>
      <label className={styles.field}>
        <span>Professional summary</span>
        <textarea
          defaultValue={profile.professionalism ?? ""}
          name="professionalism"
        />
      </label>
      {feedback ? <p aria-live="polite">{feedback}</p> : null}
      <button className={styles.action} disabled={pending} type="submit">
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
