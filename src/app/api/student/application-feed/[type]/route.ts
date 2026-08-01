import { parseApplicationFilters, isApplicationRouteType, toApplicationApiType } from "@/endpoints/student/application-query";
import { listApplications } from "@/endpoints/student/list-applications";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isApplicationRouteType(type)) {
    return Response.json({ message: "Choose job listings or internships." }, { status: 400 });
  }
  const filters = parseApplicationFilters(Object.fromEntries(new URL(request.url).searchParams.entries()));
  return createAuthenticatedBackendResponse((token) =>
    listApplications(token, toApplicationApiType(type), filters),
  );
}
