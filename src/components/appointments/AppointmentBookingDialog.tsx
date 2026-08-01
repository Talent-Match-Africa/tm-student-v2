"use client";
import { Cancel01Icon, CalendarAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type { Counselor } from "@/types/student-self-service";
import { AppointmentBookingForm } from "./AppointmentBookingForm";
import styles from "./AppointmentBookingDialog.module.css";

export function AppointmentBookingDialog({ counselors, initialCounselorId, onClose, open }: { counselors: Counselor[]; initialCounselorId?: string; onClose: () => void; open: boolean }) {
  if (!open) return null;
  return <><button aria-label="Close booking dialog" className={styles.backdrop} onClick={onClose} type="button" /><section aria-labelledby="book-appointment-title" aria-modal="true" className={styles.dialog} role="dialog"><header className={styles.header}><span className={styles.icon} aria-hidden="true"><HugeIcon icon={CalendarAdd01Icon} size={20} /></span><div><span className={styles.eyebrow}>New guidance session</span><h2 id="book-appointment-title">Book an appointment</h2></div><button aria-label="Close" className={styles.closeButton} onClick={onClose} type="button"><HugeIcon icon={Cancel01Icon} size={15} /></button></header><p>Choose a counselor from your university and provide enough context for a productive session.</p><AppointmentBookingForm counselors={counselors} initialCounselorId={initialCounselorId} onBooked={onClose} /></section></>;
}
