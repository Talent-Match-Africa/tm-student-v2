import { deleteDocument } from "@/endpoints/student/delete-document";
import { replaceDocument } from "@/endpoints/student/replace-document";
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;
  const formData = await request.formData();
  return createAuthenticatedBackendResponse((token) =>
    replaceDocument(token, documentId, formData),
  );
}
