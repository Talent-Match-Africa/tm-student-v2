import Link from "next/link";
import Image from "next/image";
import { Pagination } from "@/components/shared/Pagination";
import styles from "@/components/shared/SelfService.module.css";
import { listCounselors } from "@/endpoints/student/list-counselors";
import { requireStudentSession } from "@/lib/student-session";

export default async function CounselorsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const { accessToken } = await requireStudentSession("/counselors");
  const result = await listCounselors(accessToken, page, query.search ?? null);
  const data = result.ok ? result.payload : null;

  return (
    <section className={styles.workspace}>
      <header className={styles.header}>
        <div>
          <p>Student guidance</p>
          <h2>Career counselors</h2>
          <span>
            Find a counselor from your university and plan your next move.
          </span>
        </div>
        <span className={styles.badge}>{data?.count ?? 0} counselors</span>
      </header>
      <form className={styles.filters}>
        <label>
          <span>Search</span>
          <input
            defaultValue={query.search}
            name="search"
            placeholder="Counselor name"
          />
        </label>
        <button type="submit">Apply</button>
      </form>
      {data?.results.length ? (
        <>
          <div className={styles.grid}>
            {data.results.map((counselor) => (
              <article className={styles.card} key={counselor.id}>
                <span>{counselor.university.name}</span>
                <div className={styles.avatar}>
                  {counselor.image_url ? (
                    <Image
                      alt=""
                      height={48}
                      src={counselor.image_url}
                      unoptimized
                      width={48}
                    />
                  ) : (
                    counselor.name.slice(0, 1)
                  )}
                </div>
                <h3>{counselor.name}</h3>
                <p>{counselor.email}</p>
                <footer>
                  <span>{counselor.phone_number ?? "Available online"}</span>
                  <Link
                    className={styles.action}
                    href={`/appointments?counselor=${counselor.id}`}
                  >
                    Book session
                  </Link>
                </footer>
              </article>
            ))}
          </div>
          <Pagination
            currentPage={data.page}
            totalPages={data.total_pages}
            getPageHref={(nextPage) =>
              `/counselors?page=${nextPage}${query.search ? `&search=${encodeURIComponent(query.search)}` : ""}`
            }
          />
        </>
      ) : (
        <div className={styles.empty}>No counselors match this view.</div>
      )}
    </section>
  );
}
