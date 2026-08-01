"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CancelAppointmentButton({ appointmentId }: { appointmentId: string }) {
  const router = useRouter(); const [pending, setPending] = useState(false);
  async function cancel() { if (!window.confirm("Cancel this appointment?")) return; setPending(true); try { const response = await fetch(`/api/student/appointments/${appointmentId}/cancel`, { method: "PATCH" }); if (response.ok) router.refresh(); } finally { setPending(false); } }
  return <button data-danger="true" disabled={pending} onClick={() => void cancel()} type="button">{pending ? "Cancelling…" : "Cancel"}</button>;
}
