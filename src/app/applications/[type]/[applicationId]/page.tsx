import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationDocumentButton } from "@/components/applications/ApplicationDocumentButton";
import { getApplication } from "@/endpoints/student/get-application";
import { requireStudentSession } from "@/lib/student-session";
import styles from "@/components/shared/SelfService.module.css";
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
  const item = result.payload.data;
  return (
    <section className={styles.workspace}>
      <Link href={`/applications/${type}`}>← Back to applications</Link>
      <header className={styles.header}>
        <div>
          <p>{item.opportunity.owner.name}</p>
          <h2>{item.opportunity.title ?? "Application"}</h2>
          <span>
            Submitted{" "}
            {new Date(item.created_at).toLocaleDateString("en-RW", {
              dateStyle: "long",
            })}
          </span>
        </div>
        <span className={styles.badge}>{item.status.replaceAll("_", " ")}</span>
      </header>
      <div className={styles.details}>
        <main className={styles.panel}>
          <span>Submission</span>
          <h3>Cover letter</h3>
          <p>{item.cover_letter ?? "No cover letter was included."}</p>
          {item.experience_summary ? (
            <>
              <h3>Experience summary</h3>
              <p>{item.experience_summary}</p>
            </>
          ) : null}
        </main>
        <aside className={styles.panel}>
          <span>Documents</span>
          <h3>Submitted files</h3>
          <div className={styles.actions}>
            {item.documents.primary ? (
              <ApplicationDocumentButton
                href={`/api/student/application-documents/${apiType}/${item.id}/document`}
                label="Open document"
              />
            ) : null}
            {item.documents.cover_letter ? (
              <ApplicationDocumentButton
                href={`/api/student/application-documents/${apiType}/${item.id}/cover-letter`}
                label="Open cover letter"
              />
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
