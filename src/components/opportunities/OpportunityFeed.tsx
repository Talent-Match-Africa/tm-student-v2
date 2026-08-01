"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase01Icon, Cancel01Icon, GraduationCapIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { BackToTopButton } from "@/components/shared/BackToTopButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { OpportunityListingCardSkeleton } from "@/components/shared/OpportunityListingCardSkeleton";
import { buildOpportunityApiHref } from "@/endpoints/student/opportunity-query";
import type { OpportunityFilters, OpportunityListResponse, OpportunityRouteType } from "@/types/opportunities";
import { StudentOpportunityCard } from "./StudentOpportunityCard";
import styles from "./OpportunityFeed.module.css";

interface Props { errorMessage: string | null; filters: OpportunityFilters; initialData: OpportunityListResponse | null; onReset: () => void; type: OpportunityRouteType }

export function OpportunityFeed({ errorMessage, filters, initialData, onReset, type }: Props) {
  const [items, setItems] = useState(initialData?.results ?? []);
  const [nextPage, setNextPage] = useState(initialData?.next ?? null);
  const [loadError, setLoadError] = useState(errorMessage);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const filtered = Boolean(filters.search || filters.createdFrom || filters.createdTo || filters.workFlexibility || filters.industrySector || filters.location || filters.status !== "ACTIVE" || filters.ordering !== "-created_at");

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || loadError || !nextPage) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) void loadMore(); }, { rootMargin: "480px 0px" });
    observer.observe(target); return () => observer.disconnect();
  });

  async function loadMore() {
    if (!nextPage || loadingRef.current) return;
    loadingRef.current = true; setLoading(true); setLoadError(null);
    try {
      const response = await fetch(buildOpportunityApiHref(type, { ...filters, page: nextPage }), { headers: { Accept: "application/json" } });
      const payload = (await response.json()) as OpportunityListResponse & { message?: string };
      if (!response.ok || !Array.isArray(payload.results)) { setLoadError(payload.message ?? "More opportunities could not be loaded."); return; }
      setItems((current) => { const ids = new Set(current.map((item) => item.id)); return [...current, ...payload.results.filter((item) => !ids.has(item.id))]; });
      setNextPage(payload.next);
    } catch { setLoadError("More opportunities could not be loaded. Check your connection and try again."); }
    finally { loadingRef.current = false; setLoading(false); }
  }

  if (!items.length) return <EmptyState actions={filtered ? [{ icon: Cancel01Icon, label: "Reset filters", onClick: onReset }] : undefined} icon={loadError ? Search01Icon : type === "job-listings" ? Briefcase01Icon : GraduationCapIcon} message={loadError ?? (filtered ? "No opportunities match the current search and filters." : "No opportunities are available yet.")} title={loadError ? "Unable to load opportunities" : filtered ? "No matching records" : "No opportunities yet"} />;
  return (
    <section className={styles.feed} aria-label="Opportunity results"><div className={styles.grid} role="list">{items.map((item) => <div className={styles.gridItem} key={item.id} role="listitem"><StudentOpportunityCard opportunity={item} type={type} /></div>)}{loading ? Array.from({ length: 3 }, (_, index) => <div className={styles.gridItem} key={`loading-${index}`}><OpportunityListingCardSkeleton /></div>) : null}</div>
      {loadError ? <div className={styles.loadError} role="alert"><span>{loadError}</span><button onClick={() => void loadMore()} type="button">Try again</button></div> : null}
      <div aria-hidden="true" className={styles.sentinel} ref={sentinelRef} />
      {!nextPage && items.length ? <p className={styles.endMessage}>All matching opportunities are shown.</p> : null}<BackToTopButton />
    </section>
  );
}
