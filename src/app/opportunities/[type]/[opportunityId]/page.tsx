import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OpportunityDetails } from "@/components/opportunities/details/OpportunityDetails";
import { getStudentOpportunity } from "@/endpoints/student/get-opportunity";
import {
  isOpportunityRouteType,
  toApiType,
} from "@/endpoints/student/opportunity-query";
import { requireStudentSession } from "@/lib/student-session";
import { listDocuments } from "@/endpoints/student/list-documents";

interface OpportunityDetailPageProps {
  params: Promise<{ type: string; opportunityId: string }>;
  searchParams: Promise<{ apply?: string }>;
}

export async function generateMetadata({
  params,
}: OpportunityDetailPageProps): Promise<Metadata> {
  const { type } = await params;
  return {
    title: type === "internships" ? "Internship Details" : "Job Details",
  };
}

export default async function OpportunityDetailPage({
  params,
  searchParams,
}: OpportunityDetailPageProps) {
  const { type, opportunityId } = await params;
  if (!isOpportunityRouteType(type)) notFound();
  const { accessToken } = await requireStudentSession(
    `/opportunities/${type}/${opportunityId}`,
  );
  const result = await getStudentOpportunity(
    accessToken,
    toApiType(type),
    opportunityId,
  );
  if (!result.ok) notFound();
  const documentsResult = await listDocuments(accessToken);
  const query = await searchParams;
  return (
    <OpportunityDetails
      autoOpenApplication={query.apply === "true"}
      latestDocument={documentsResult.ok ? documentsResult.payload.results[0] ?? null : null}
      opportunity={result.payload.data}
      type={type}
    />
  );
}
