import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { StudentWorkspaceShell } from "@/components/layout/StudentWorkspaceShell";
import { requireStudentSession } from "@/lib/student-session";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Talent Match Student",
    template: "%s | Talent Match Student",
  },
  description:
    "Discover opportunities and manage your Talent Match student journey.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const headerStore = await headers();
  const nextPath = headerStore.get("x-student-next-path") ?? "/dashboard";
  const { profile } = await requireStudentSession(nextPath);

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <StudentWorkspaceShell profile={profile}>
          {children}
        </StudentWorkspaceShell>
      </body>
    </html>
  );
}
