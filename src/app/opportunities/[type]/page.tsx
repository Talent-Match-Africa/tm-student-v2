import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OpportunityWorkspace } from "@/components/opportunities/OpportunityWorkspace";
import {
  isOpportunityRouteType,
  parseOpportunityFilters,
  toApiType,
} from "@/endpoints/student/opportunity-query";
import { listStudentOpportunities } from "@/endpoints/student/list-opportunities";
import { requireStudentSession } from "@/lib/student-session";

interface OpportunityListPageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: OpportunityListPageProps): Promise<Metadata> {
  const { type } = await params;
  return {
    title: type === "internships" ? "Internships" : "Job Listings",
  };
}

export default async function OpportunityListPage({
  params,
  searchParams,
}: OpportunityListPageProps) {
  const { type } = await params;
  if (!isOpportunityRouteType(type)) notFound();
  const query = await searchParams;
  const filters = parseOpportunityFilters(query);
  const nextPath = `/opportunities/${type}`;
  const { accessToken } = await requireStudentSession(nextPath);
  const result = await listStudentOpportunities(
    accessToken,
    toApiType(type),
    filters,
  );

  return (
    <OpportunityWorkspace
      data={result.ok ? result.payload : null}
      errorMessage={result.ok ? null : readMessage(result.payload)}
      filters={filters}
      type={type}
    />
  );
}

function readMessage(payload: unknown) {
  if (typeof payload !== "object" || payload === null)
    return "Opportunities could not be loaded.";
  const message = (payload as Record<string, unknown>).message;
  return typeof message === "string"
    ? message
    : "Opportunities could not be loaded.";
}
