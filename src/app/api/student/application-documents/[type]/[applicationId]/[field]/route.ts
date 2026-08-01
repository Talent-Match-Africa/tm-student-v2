import { getApplicationDocumentAccess } from "@/endpoints/student/get-application-document-access";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ applicationId: string; field: string; type: string }> },
) {
  const { applicationId, field, type } = await params;
  if (
    (type !== "jobs" && type !== "internships") ||
    (field !== "document" && field !== "cover-letter")
  ) {
    return Response.json({ message: "Invalid document request." }, { status: 400 });
  }
  return createAuthenticatedBackendResponse((token) =>
    getApplicationDocumentAccess(token, type, applicationId, field),
  );
}
