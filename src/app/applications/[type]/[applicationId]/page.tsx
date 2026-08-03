import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudentApplicationDetails } from "@/components/applications/details/StudentApplicationDetails";
import { getApplication } from "@/endpoints/student/get-application";
import { requireStudentSession } from "@/lib/student-session";

export const metadata: Metadata = {
  title: "Application Details | Talent Match Student",
  description: "Review your submitted application and supporting documents.",
};

export default async function ApplicationDetail({
  params,
}: {
  params: Promise<{ type: string; applicationId: string }>;
}) {
  const { type, applicationId } = await params;
  if (type !== "job-listings" && type !== "internships") notFound();
  const apiType = type === "job-listings" ? "jobs" : "internships";
  const { accessToken } = await requireStudentSession(
    `/applications/${type}/${applicationId}`,
  );
  const result = await getApplication(accessToken, apiType, applicationId);
  if (!result.ok) notFound();

  return (
    <StudentApplicationDetails
      apiType={apiType}
      application={result.payload.data}
      routeType={type}
    />
  );
}
