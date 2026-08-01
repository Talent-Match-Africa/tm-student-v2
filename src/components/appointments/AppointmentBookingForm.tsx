"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Calendar03Icon, Message01Icon, SentIcon, UserIcon } from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import { InputField } from "@/components/shared/InputField";
import { SelectField } from "@/components/shared/SelectField";
import { TextareaField } from "@/components/shared/TextareaField";
import type { Counselor } from "@/types/student-self-service";
import styles from "./AppointmentBookingForm.module.css";

export function AppointmentBookingForm({ counselors, initialCounselorId, onBooked }: { counselors: Counselor[]; initialCounselorId?: string; onBooked?: () => void }) {
  const router = useRouter(); const [feedback, setFeedback] = useState(""); const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setPending(true); setFeedback(""); const form = event.currentTarget; const data = new FormData(form); const date = new Date(String(data.get("date"))); if (Number.isNaN(date.getTime())) { setPending(false); setFeedback("Choose a valid future appointment date."); return; } try { const response = await fetch("/api/student/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ counselor_id: data.get("counselor_id"), date: date.toISOString(), subject: data.get("subject"), message: data.get("message") }) }); const payload = await response.json() as { message?: string }; if (!response.ok) { setFeedback(payload.message ?? "The appointment could not be booked."); return; } form.reset(); router.refresh(); onBooked?.(); } catch { setFeedback("The appointment could not be booked. Check your connection and try again."); } finally { setPending(false); } }
  const options = [{ label: "Select a counselor", value: "" }, ...counselors.map((item) => ({ label: `${item.name} · ${item.university.name}`, value: item.id }))];
  return <form className={styles.form} onSubmit={submit}><SelectField defaultValue={initialCounselorId ?? ""} icon={UserIcon} isSearchable label="Counselor" name="counselor_id" options={options} required /><InputField icon={Calendar03Icon} label="Date and time" min={minimumDate()} name="date" required type="datetime-local" /><InputField icon={Message01Icon} label="Subject" maxLength={255} name="subject" placeholder="What would you like to discuss?" required /><TextareaField icon={Message01Icon} label="Message" maxLength={5000} name="message" placeholder="Share the context your counselor should know." required rows={5} />{feedback ? <p className={styles.feedback} role="alert">{feedback}</p> : null}<footer className={styles.actions}><AuthButton disabled={!counselors.length} icon={SentIcon} isLoading={pending} loadingLabel="Booking appointment" type="submit">Book appointment</AuthButton></footer></form>;
}
function minimumDate() { const date = new Date(Date.now() + 60_000); const offset = date.getTimezoneOffset(); return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16); }
