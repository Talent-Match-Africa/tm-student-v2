import { NextResponse, type NextRequest } from "next/server";
import { attachApplicationDocument } from "@/endpoints/student/attach-application-document";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";
import type { OpportunityApiType } from "@/types/opportunities";

const MAX_REQUEST_BYTES = 12 * 1024 * 1024;

interface RouteProps {
  params: Promise<{ type: string; applicationId: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > MAX_REQUEST_BYTES) {
    return errorResponse("The CV file is too large.", 413);
  }

  const { type, applicationId } = await params;
  if (!isApiType(type) || !isRecordId(applicationId)) {
    return errorResponse("The application destination is invalid.", 400);
  }

  // Forward the CV alone: this route must never be able to change any other
  // part of a submitted application.
  const incoming = await request.formData();
  const document = incoming.get("document");
  if (!(document instanceof File)) {
    return errorResponse("Attach your CV to complete this application.", 422);
  }
  const formData = new FormData();
  formData.append("document", document);

  return createAuthenticatedBackendResponse((accessToken) =>
    attachApplicationDocument(accessToken, type, applicationId, formData),
  );
}

function isApiType(value: string): value is OpportunityApiType {
  return value === "jobs" || value === "internships";
}

function isRecordId(value: string) {
  return /^(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f-]{27})$/i.test(value);
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { status: "error", message },
    { status, headers: { "Cache-Control": "private, no-store" } },
  );
}
