import type { Metadata } from "next";
import { StudentEmailChangeConfirmation } from "@/components/profile/StudentEmailChangeConfirmation";
import { requireStudentSession } from "@/lib/student-session";

export const metadata: Metadata = { title: "Verify Email", description: "Verify a new Talent Match student email address." };

export default async function StudentEmailConfirmationPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  await requireStudentSession(`/profile/email/confirm${token ? `?token=${encodeURIComponent(token)}` : ""}`);
  return <StudentEmailChangeConfirmation token={token} />;
}
