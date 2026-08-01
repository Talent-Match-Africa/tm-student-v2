import { getResourceAccess } from "@/endpoints/student/get-resource-access";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resourceId: string }> },
) {
  const { resourceId } = await params;
  return createAuthenticatedBackendResponse((token) =>
    getResourceAccess(token, resourceId),
  );
}
