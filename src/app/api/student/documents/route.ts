import { uploadDocument } from "@/endpoints/student/upload-document";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function POST(request: Request) {
  const formData = await request.formData();
  return createAuthenticatedBackendResponse((token) =>
    uploadDocument(token, formData),
  );
}
