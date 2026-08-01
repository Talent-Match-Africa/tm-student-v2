"use client";
import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import type { ResourceFilters } from "@/types/resources";
import type { PageResponse, Resource } from "@/types/student-self-service";
import { ResourceManagementFilters } from "./ResourceManagementFilters";
import { ResourceManagementRow } from "./ResourceManagementRow";
import { buildResourcesHref } from "./utils";
import styles from "./ResourcesManagementTable.module.css";

export function ResourcesManagementTable({ errorMessage, filters, result }: { errorMessage: string | null; filters: ResourceFilters; result: PageResponse<Resource> | null }) {
  const router = useRouter(); const [isPending, startTransition] = useTransition(); const resources = result?.results ?? []; const count = result?.count ?? 0; const totalPages = result?.total_pages ?? 0; const documentCount = resources.filter((item) => item.type === "DOCUMENT").length; const videoCount = resources.filter((item) => item.type === "VIDEO").length; const navigate = useCallback((href: string) => startTransition(() => router.push(href)), [router]);
  return <div aria-busy={isPending} className={styles.workspace}><header className={styles.header}><div><p className={styles.eyebrow}>Learning and guidance library</p><h1>Resources</h1><p className={styles.description}>Explore secure documents and trusted videos selected for your student journey.</p></div><div className={styles.headerActions}><div className={styles.resultBadge}><strong>{count.toLocaleString()}</strong><span>Matched records</span></div><div className={styles.resultBadge}><strong>{documentCount + videoCount}</strong><span>Shown here</span></div></div></header>{errorMessage ? <div className={styles.alert} role="alert">{errorMessage}</div> : null}<ResourceManagementFilters filters={filters} isPending={isPending} onNavigate={navigate} /><section className={styles.tablePanel}><div className={styles.tableHeader}><strong>{count.toLocaleString()} resources</strong><span>Page {result?.page ?? filters.page} of {Math.max(1, totalPages)}</span></div><div className={styles.scroller}><table className={styles.table}><thead><tr><th>Resource</th><th>Content</th><th>Owner</th><th>Audience and date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{!errorMessage && resources.length ? resources.map((resource) => <ResourceManagementRow key={resource.id} resource={resource} />) : <tr><td className={styles.emptyCell} colSpan={6}><EmptyState actions={hasFilters(filters) ? [{ icon: Cancel01Icon, label: "Reset filters", onClick: () => navigate("/resources"), variant: "secondary" }] : undefined} icon={Archive01Icon} message={errorMessage ? "The resource library is unavailable right now. Reload the page to try again." : "No resources match the current search or filters."} title={errorMessage ? "Resources could not be loaded" : "No resources found"} /></td></tr>}</tbody></table></div></section><Pagination currentPage={result?.page ?? filters.page} getPageHref={(page) => buildResourcesHref({ ...filters, page })} label="Resources pagination" totalPages={totalPages} /></div>;
}
function hasFilters(filters: ResourceFilters) { return Boolean(filters.search || filters.type || filters.visibility || filters.createdFrom || filters.createdTo || filters.ordering !== "-published_at"); }
