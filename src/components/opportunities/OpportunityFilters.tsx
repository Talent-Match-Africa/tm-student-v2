"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Cancel01Icon,
  FilterHorizontalIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { buildOpportunityHref } from "@/endpoints/student/opportunity-query";
import type {
  OpportunityFilters as OpportunityFilterValues,
  OpportunityRouteType,
} from "@/types/opportunities";
import styles from "./OpportunityFilters.module.css";
import { OpportunityFilterSelect } from "./OpportunityFilterSelect";

interface OpportunityFiltersProps {
  filters: OpportunityFilterValues;
  type: OpportunityRouteType;
}

export function OpportunityFilters({
  filters,
  type,
}: OpportunityFiltersProps) {
  const router = useRouter();
  const [search, setSearch] = useState(filters.search ?? "");
  const [advanced, setAdvanced] = useState(false);
  const [values, setValues] = useState(filters);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(
      buildOpportunityHref(type, {
        ...values,
        page: 1,
        search: search.trim().length >= 3 ? search.trim() : null,
      }),
    );
  }

  function reset() {
    setSearch("");
    router.push(`/opportunities/${type}`);
  }

  return (
    <>
      <form
        aria-label="Opportunity filters"
        className={styles.filterShell}
        onSubmit={submit}
      >
        <label className={styles.searchField}>
          <span>Search opportunities</span>
          <span className={styles.inputShell}>
            <HugeIcon icon={Search01Icon} size={18} />
            <input
              autoComplete="off"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Title, sector, or location"
              type="search"
              value={search}
            />
          </span>
        </label>
        <button
          className={styles.secondaryButton}
          onClick={() => setAdvanced(true)}
          type="button"
        >
          <HugeIcon icon={FilterHorizontalIcon} size={17} />
          Filters
        </button>
        <button className={styles.primaryButton} type="submit">
          Apply
        </button>
        <button className={styles.secondaryButton} onClick={reset} type="button">
          <HugeIcon icon={Cancel01Icon} size={17} />
          Reset
        </button>
      </form>

      {advanced ? (
        <div className={styles.backdrop} role="presentation">
          <section
            aria-labelledby="opportunity-filter-title"
            aria-modal="true"
            className={styles.dialog}
            role="dialog"
          >
            <header>
              <div>
                <span>Refine discovery</span>
                <h2 id="opportunity-filter-title">Opportunity filters</h2>
              </div>
              <button
                aria-label="Close filters"
                onClick={() => setAdvanced(false)}
                type="button"
              >
                ×
              </button>
            </header>
            <div className={styles.dialogFields}>
              <OpportunityFilterSelect
                label="Availability"
                onChange={(status) =>
                  setValues((current) => ({ ...current, status }))
                }
                options={["ACTIVE", "OPEN", "UPCOMING", "CLOSED", "ALL"]}
                value={values.status}
              />
              <OpportunityFilterSelect
                label="Work mode"
                onChange={(workFlexibility) =>
                  setValues((current) => ({
                    ...current,
                    workFlexibility: workFlexibility || null,
                  }))
                }
                options={["", "REMOTE", "HYBRID", "ONSITE"]}
                value={values.workFlexibility ?? ""}
              />
              <label>
                <span>Industry sector</span>
                <input
                  maxLength={100}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      industrySector: event.target.value || null,
                    }))
                  }
                  value={values.industrySector ?? ""}
                />
              </label>
              <label>
                <span>Location</span>
                <input
                  maxLength={100}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      location: event.target.value || null,
                    }))
                  }
                  value={values.location ?? ""}
                />
              </label>
              <OpportunityFilterSelect
                label="Order"
                onChange={(ordering) =>
                  setValues((current) => ({ ...current, ordering }))
                }
                options={["-created_at", "created_at", "deadline", "title"]}
                value={values.ordering}
              />
            </div>
            <footer>
              <button
                className={styles.secondaryButton}
                onClick={() => setAdvanced(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className={styles.primaryButton}
                onClick={() => {
                  setAdvanced(false);
                  router.push(
                    buildOpportunityHref(type, {
                      ...values,
                      page: 1,
                      search:
                        search.trim().length >= 3 ? search.trim() : null,
                    }),
                  );
                }}
                type="button"
              >
                Apply filters
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
