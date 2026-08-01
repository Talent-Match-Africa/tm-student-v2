import Link from "next/link";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/shared/Pagination";
import { listApplications } from "@/endpoints/student/list-applications";
import { requireStudentSession } from "@/lib/student-session";
import styles from "@/components/shared/SelfService.module.css";
export default async function ApplicationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  const { type } = await params;
  if (type !== "job-listings" && type !== "internships") notFound();
  const q = await searchParams;
  const page = Math.max(1, Number(q.page) || 1);
  const apiType = type === "job-listings" ? "jobs" : "internships";
  const { accessToken } = await requireStudentSession(`/applications/${type}`);
  const result = await listApplications(
    accessToken,
    apiType,
    page,
    q.status ?? null,
    q.search && q.search.length >= 3 ? q.search : null,
  );
  const data = result.ok ? result.payload : null;
  return (
    <section className={styles.workspace}>
      <header className={styles.header}>
        <div>
          <p>Personal pipeline</p>
          <h2>My applications</h2>
          <span>Follow every submission from applied to final outcome.</span>
        </div>
        <span className={styles.badge}>{data?.count ?? 0} applications</span>
      </header>
      <nav className={styles.tabs}>
        <Link
          className={type === "job-listings" ? styles.active : ""}
          href="/applications/job-listings"
        >
          Job listings
        </Link>
        <Link
          className={type === "internships" ? styles.active : ""}
          href="/applications/internships"
        >
          Internships
        </Link>
      </nav>
      <form className={styles.filters}>
        <label>
          <span>Search</span>
          <input
            defaultValue={q.search}
            minLength={3}
            name="search"
            placeholder="Opportunity or owner"
          />
        </label>
        <label>
          <span>Status</span>
          <select defaultValue={q.status ?? ""} name="status">
            <option value="">All statuses</option>
            {[
              "APPLIED",
              "UNDER_REVIEW",
              "SHORTLISTED",
              "REJECTED",
              "HIRED",
              "WITHDRAWN",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <button>Apply</button>
      </form>
      {data?.results.length ? (
        <>
          <div className={styles.grid}>
            {data.results.map((item) => (
              <article className={styles.card} key={item.id}>
                <span>{item.opportunity.owner.name}</span>
                <h3>{item.opportunity.title ?? "Opportunity"}</h3>
                <div className={styles.meta}>
                  <span>
                    {new Date(item.created_at).toLocaleDateString("en-RW")}
                  </span>
                  <span className={styles.status} data-status={item.status}>
                    {item.status.replaceAll("_", " ")}
                  </span>
                </div>
                <footer>
                  <span>
                    {item.documents.primary
                      ? "Document attached"
                      : "No document"}
                  </span>
                  <Link
                    className={styles.action}
                    href={`/applications/${type}/${item.id}`}
                  >
                    View application
                  </Link>
                </footer>
              </article>
            ))}
          </div>
          <Pagination
            currentPage={data.page}
            totalPages={data.total_pages}
            getPageHref={(p) =>
              `/applications/${type}?page=${p}${q.status ? `&status=${q.status}` : ""}${q.search ? `&search=${encodeURIComponent(q.search)}` : ""}`
            }
          />
        </>
      ) : (
        <div className={styles.empty}>
          No applications match this view. Browse Opportunities when you are
          ready to take your next step.
        </div>
      )}
    </section>
  );
}
