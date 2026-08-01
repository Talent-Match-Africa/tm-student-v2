import { deleteDocument } from "@/endpoints/student/delete-document";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;
  return createAuthenticatedBackendResponse((token) =>
    deleteDocument(token, documentId),
  );
}
