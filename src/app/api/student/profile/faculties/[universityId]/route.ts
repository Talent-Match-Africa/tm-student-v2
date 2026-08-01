import { listProfileFaculties } from "@/endpoints/student/list-profile-faculties";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function GET(_request: Request, { params }: { params: Promise<{ universityId: string }> }) {
  const { universityId } = await params;
  return createAuthenticatedBackendResponse(() => listProfileFaculties(universityId));
}
