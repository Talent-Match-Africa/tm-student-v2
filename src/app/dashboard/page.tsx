import type { Metadata } from "next";
import { DashboardErrorState } from "@/components/dashboard/DashboardErrorState";
import { DashboardWorkspace } from "@/components/dashboard/DashboardWorkspace";
import { firstName, readDashboardError } from "@/components/dashboard/utils";
import { getStudentDashboard } from "@/endpoints/student/get-dashboard";
import { requireStudentSession } from "@/lib/student-session";

export const metadata: Metadata = { title: "Dashboard | Talent Match Student", description: "Review your Talent Match student journey and next actions." };

export default async function DashboardPage() { const { accessToken, profile } = await requireStudentSession("/dashboard"); const result = await getStudentDashboard(accessToken); if (!result.ok) return <DashboardErrorState message={readDashboardError(result.payload)} />; const displayName = profile.profile?.displayName?.trim() || profile.name?.trim() || "there"; return <DashboardWorkspace data={result.payload.data} name={firstName(displayName)} />; }
