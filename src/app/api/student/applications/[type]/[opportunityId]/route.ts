import { NextResponse, type NextRequest } from "next/server";
import { createStudentApplication } from "@/endpoints/student/create-application";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";
import type { OpportunityApiType } from "@/types/opportunities";

const MAX_REQUEST_BYTES = 22 * 1024 * 1024;
const ALLOWED_TEXT_FIELDS = new Set([
  "cover_letter",
  "experience_summary",
  "work_history",
]);
const ALLOWED_FILE_FIELDS = new Set(["document", "cover_letter_document"]);

interface ApplicationRouteProps {
  params: Promise<{ type: string; opportunityId: string }>;
}

export async function POST(
  request: NextRequest,
  { params }: ApplicationRouteProps,
) {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      {
        status: "error",
        code: "student_application_request_too_large",
        message: "The application files are too large.",
      },
      {
        status: 413,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
  const { type, opportunityId } = await params;
  if (!isApiType(type) || !isRecordId(opportunityId)) {
    return NextResponse.json(
      {
        status: "error",
        code: "student_application_route_invalid",
        message: "The application destination is invalid.",
      },
      {
        status: 400,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
  const incoming = await request.formData();
  const formData = new FormData();
  for (const [key, value] of incoming.entries()) {
    if (
      (typeof value === "string" && ALLOWED_TEXT_FIELDS.has(key)) ||
      (value instanceof File && ALLOWED_FILE_FIELDS.has(key))
    ) {
      formData.append(key, value);
    }
  }
  return createAuthenticatedBackendResponse((accessToken) =>
    createStudentApplication(accessToken, type, opportunityId, formData),
  );
}

function isApiType(value: string): value is OpportunityApiType {
  return value === "jobs" || value === "internships";
}

function isRecordId(value: string) {
  return /^(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f-]{27})$/i.test(value);
}
