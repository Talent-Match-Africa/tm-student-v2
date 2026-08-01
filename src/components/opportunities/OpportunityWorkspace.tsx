import { OpportunityFilters } from "./OpportunityFilters";
import { OpportunityTypeTabs } from "./OpportunityTypeTabs";
import { StudentOpportunityCard } from "./StudentOpportunityCard";
import { Pagination } from "@/components/shared/Pagination";
import { buildOpportunityHref } from "@/endpoints/student/opportunity-query";
import type {
  OpportunityFilters as FilterValues,
  OpportunityListResponse,
  OpportunityRouteType,
} from "@/types/opportunities";
import styles from "./OpportunityWorkspace.module.css";

interface OpportunityWorkspaceProps {
  data: OpportunityListResponse | null;
  errorMessage: string | null;
  filters: FilterValues;
  type: OpportunityRouteType;
}

export function OpportunityWorkspace({
  data,
  errorMessage,
  filters,
  type,
}: OpportunityWorkspaceProps) {
  const label = type === "job-listings" ? "Job listings" : "Internships";
  return (
    <section className={styles.workspace}>
      <header className={styles.header}>
        <div>
          <p>Student opportunities</p>
          <h2>{label}</h2>
          <span>
            Discover opportunities available to you and your university.
          </span>
        </div>
        <div className={styles.resultBadge}>
          <strong>{(data?.count ?? 0).toLocaleString()}</strong>
          <span>Matched opportunities</span>
        </div>
      </header>

      <OpportunityFilters filters={filters} type={type} />

      <div className={styles.content}>
        <aside>
          <OpportunityTypeTabs activeType={type} />
        </aside>
        <main>
          {errorMessage ? (
            <div className={styles.empty} role="alert">
              <span>Unable to load opportunities</span>
              <h3>Discovery is temporarily unavailable.</h3>
              <p>{errorMessage}</p>
            </div>
          ) : data?.results.length ? (
            <>
              <div className={styles.grid}>
                {data.results.map((opportunity) => (
                  <StudentOpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    type={type}
                  />
                ))}
              </div>
              <Pagination
                currentPage={data.page}
                getPageHref={(page) =>
                  buildOpportunityHref(type, { ...filters, page })
                }
                label={`${label} pagination`}
                totalPages={data.total_pages}
              />
            </>
          ) : (
            <div className={styles.empty}>
              <span>No matching records</span>
              <h3>Try widening your search.</h3>
              <p>
                Reset one or more filters to see opportunities available to
                your university.
              </p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
