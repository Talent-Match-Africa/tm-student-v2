import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudentApplicationCvUpload } from "@/components/applications/cv/StudentApplicationCvUpload";
import { getApplication } from "@/endpoints/student/get-application";
import { requireStudentSession } from "@/lib/student-session";

export const metadata: Metadata = {
  title: "Upload your CV | Talent Match Student",
  description: "Attach the CV your application is missing.",
};

export default async function ApplicationCvUpload({
  params,
}: {
  params: Promise<{ type: string; applicationId: string }>;
}) {
  const { type, applicationId } = await params;
  if (type !== "job-listings" && type !== "internships") notFound();
  const apiType = type === "job-listings" ? "jobs" : "internships";

  // Reminder links land here directly, so an unauthenticated student is sent
  // to sign in and returned to this exact page afterwards.
  const { accessToken } = await requireStudentSession(
    `/applications/${type}/${applicationId}/cv`,
  );
  const result = await getApplication(accessToken, apiType, applicationId);
  if (!result.ok) notFound();

  return (
    <StudentApplicationCvUpload
      application={result.payload.data}
      apiType={apiType}
      routeType={type}
    />
  );
}
