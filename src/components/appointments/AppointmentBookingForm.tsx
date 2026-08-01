"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Counselor } from "@/types/student-self-service";
import styles from "@/components/shared/SelfService.module.css";

export function AppointmentBookingForm({
  counselors,
  initialCounselorId,
}: {
  counselors: Counselor[];
  initialCounselorId?: string;
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFeedback("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/student/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        counselor_id: data.get("counselor_id"),
        date: new Date(String(data.get("date"))).toISOString(),
        subject: data.get("subject"),
        message: data.get("message"),
      }),
    });
    const payload = (await response.json()) as { message?: string };
    setPending(false);
    if (!response.ok) {
      setFeedback(payload.message ?? "The appointment could not be booked.");
      return;
    }
    event.currentTarget.reset();
    setFeedback("Your appointment has been booked.");
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label className={styles.field}>
        <span>Counselor</span>
        <select
          defaultValue={initialCounselorId ?? ""}
          name="counselor_id"
          required
        >
          <option disabled value="">
            Select a counselor
          </option>
          {counselors.map((counselor) => (
            <option key={counselor.id} value={counselor.id}>
              {counselor.name} · {counselor.university.name}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        <span>Date and time</span>
        <input name="date" required type="datetime-local" />
      </label>
      <label className={styles.field}>
        <span>Subject</span>
        <input maxLength={160} name="subject" required />
      </label>
      <label className={styles.field}>
        <span>Message</span>
        <textarea maxLength={2000} name="message" required />
      </label>
      {feedback ? <p aria-live="polite">{feedback}</p> : null}
      <button className={styles.action} disabled={pending} type="submit">
        {pending ? "Booking…" : "Book appointment"}
      </button>
    </form>
  );
}
