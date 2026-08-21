import { getEventForm } from "@/endpoints/student/get-event-form";
import {
  saveEventForm,
  type SaveEventFormInput,
} from "@/endpoints/student/save-event-form";
import { createAuthenticatedBackendResponse } from "@/lib/student-api-route";

export async function GET() {
  return createAuthenticatedBackendResponse(getEventForm);
}

export async function POST(request: Request) {
  const input = (await request.json()) as SaveEventFormInput;
  return createAuthenticatedBackendResponse((token) => saveEventForm(token, input));
}
