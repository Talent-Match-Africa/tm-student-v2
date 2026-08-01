import { notFound } from "next/navigation";
import { ApplicationWorkspace } from "@/components/applications/ApplicationWorkspace";
import { isApplicationRouteType, parseApplicationFilters, toApplicationApiType } from "@/endpoints/student/application-query";
import { listApplications } from "@/endpoints/student/list-applications";
import { requireStudentSession } from "@/lib/student-session";

export default async function ApplicationsPage({ params, searchParams }: { params: Promise<{ type: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { type } = await params; if (!isApplicationRouteType(type)) notFound(); const query = await searchParams; const filters = parseApplicationFilters(query); const { accessToken } = await requireStudentSession(`/applications/${type}`); const result = await listApplications(accessToken, toApplicationApiType(type), filters.page, filters.status, filters.search);
  return <ApplicationWorkspace errorMessage={result.ok ? null : readMessage(result.payload)} filters={filters} initialData={result.ok ? result.payload : null} type={type} />;
}
function readMessage(payload: unknown) { return typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string" ? payload.message : "Applications could not be loaded."; }
