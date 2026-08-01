import { ResourceAccessButton } from "@/components/resources/ResourceAccessButton";
import { Pagination } from "@/components/shared/Pagination";
import styles from "@/components/shared/SelfService.module.css";
import { listResources } from "@/endpoints/student/list-resources";
import { requireStudentSession } from "@/lib/student-session";

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; type?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const { accessToken } = await requireStudentSession("/resources");
  const result = await listResources(
    accessToken,
    page,
    query.search ?? null,
    query.type ?? null,
  );
  const data = result.ok ? result.payload : null;

  return (
    <section className={styles.workspace}>
      <header className={styles.header}>
        <div>
          <p>Career library</p>
          <h2>Resources</h2>
          <span>Practical guidance selected for your student journey.</span>
        </div>
        <span className={styles.badge}>{data?.count ?? 0} resources</span>
      </header>
      <form className={styles.filters}>
        <label>
          <span>Search</span>
          <input
            defaultValue={query.search}
            name="search"
            placeholder="Search resources"
          />
        </label>
        <label>
          <span>Format</span>
          <select defaultValue={query.type ?? ""} name="type">
            <option value="">All formats</option>
            <option>DOCUMENT</option>
            <option>VIDEO</option>
          </select>
        </label>
        <button type="submit">Apply</button>
      </form>
      {data?.results.length ? (
        <>
          <div className={styles.grid}>
            {data.results.map((resource) => (
              <article className={styles.card} key={resource.id}>
                <span>{resource.type}</span>
                <h3>{resource.name}</h3>
                <p>
                  {resource.description ?? "A Talent Match career resource."}
                </p>
                <div className={styles.meta}>
                  <span>{resource.owner?.name ?? "Talent Match"}</span>
                  {resource.file_name ? (
                    <span>{resource.file_name}</span>
                  ) : null}
                </div>
                <footer>
                  <span>
                    {resource.published_at
                      ? new Date(resource.published_at).toLocaleDateString(
                          "en-RW",
                        )
                      : "Available now"}
                  </span>
                  {resource.type === "VIDEO" && resource.video_url ? (
                    <a
                      className={styles.action}
                      href={resource.video_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Watch video
                    </a>
                  ) : (
                    <ResourceAccessButton resourceId={resource.id} />
                  )}
                </footer>
              </article>
            ))}
          </div>
          <Pagination
            currentPage={data.page}
            totalPages={data.total_pages}
            getPageHref={(nextPage) =>
              `/resources?page=${nextPage}${query.type ? `&type=${query.type}` : ""}${query.search ? `&search=${encodeURIComponent(query.search)}` : ""}`
            }
          />
        </>
      ) : (
        <div className={styles.empty}>No resources match these filters.</div>
      )}
    </section>
  );
}
