"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/components/shared/SelfService.module.css";

export function CancelAppointmentButton({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function cancel() {
    if (!window.confirm("Cancel this appointment?")) return;
    setPending(true);
    const response = await fetch(
      `/api/student/appointments/${appointmentId}/cancel`,
      { method: "PATCH" },
    );
    setPending(false);
    if (response.ok) router.refresh();
  }

  return (
    <button
      className={styles.danger}
      disabled={pending}
      onClick={cancel}
      type="button"
    >
      {pending ? "Cancelling…" : "Cancel"}
    </button>
  );
}
