import type { Metadata } from "next";
import { CounselorsManagementTable } from "@/components/counselors/CounselorsManagementTable";
import { parseCounselorFilters, readCounselorError } from "@/components/counselors/utils";
import { listCounselors } from "@/endpoints/student/list-counselors";
import { requireStudentSession } from "@/lib/student-session";

export const metadata: Metadata = { title: "Counselors | Talent Match Student", description: "Find and book an active counselor from your university." };

export default async function CounselorsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = parseCounselorFilters(await searchParams); const { accessToken } = await requireStudentSession("/counselors"); const result = await listCounselors(accessToken, filters.page, filters.search);
  return <CounselorsManagementTable data={result.ok ? result.payload : null} errorMessage={result.ok ? null : readCounselorError(result.payload)} filters={filters} />;
}
