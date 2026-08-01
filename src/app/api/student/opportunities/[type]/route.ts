import { listStudentOpportunities } from "@/endpoints/student/list-opportunities";
import { isOpportunityRouteType, parseOpportunityFilters, toApiType } from "@/endpoints/student/opportunity-query";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isOpportunityRouteType(type)) return Response.json({ message: "Choose job listings or internships." }, { status: 400 });
  const query = Object.fromEntries(new URL(request.url).searchParams.entries());
  const filters = parseOpportunityFilters(query);
  return createAuthenticatedBackendResponse((token) => listStudentOpportunities(token, toApiType(type), filters));
}
