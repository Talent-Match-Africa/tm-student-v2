"use client";
import { useCallback, useTransition } from "react";
import { Calendar03Icon, Cancel01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { AuthButton } from "@/components/shared/AuthButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import type { Counselor, PageResponse } from "@/types/student-self-service";
import { CounselorFilters } from "./CounselorFilters";
import { CounselorsManagementRow } from "./CounselorsManagementRow";
import { buildCounselorsHref, type CounselorFilters as Filters } from "./utils";
import styles from "./CounselorsManagementTable.module.css";

export function CounselorsManagementTable({ data, errorMessage, filters }: { data: PageResponse<Counselor> | null; errorMessage: string | null; filters: Filters }) {
  const router = useRouter(); const [isPending, startTransition] = useTransition(); const count = data?.count ?? 0; const totalPages = data?.total_pages ?? 0;
  const navigate = useCallback((href: string) => startTransition(() => router.push(href)), [router]);
  return <div aria-busy={isPending} className={styles.workspace}><header className={styles.header}><div><p className={styles.eyebrow}>University support network</p><h1>Counselors</h1><p className={styles.description}>Find an active counselor from your university and book confidential career-guidance sessions.</p></div><div className={styles.headerActions}><div className={styles.resultBadge}><strong>{count.toLocaleString()}</strong><span>Matched records</span></div><AuthButton className={styles.addButton} icon={Calendar03Icon} onClick={() => navigate("/appointments")} type="button">My appointments</AuthButton></div></header>{errorMessage ? <div className={styles.alert} role="alert">{errorMessage}</div> : null}<CounselorFilters filters={filters} isPending={isPending} onNavigate={navigate} /><section className={styles.tablePanel}><div className={styles.tableHeader}><strong>{count.toLocaleString()} counselors</strong><span>Page {data?.page ?? filters.page} of {Math.max(1, totalPages)}</span></div><div className={styles.scroller}><table className={styles.table}><thead><tr><th>Counselor</th><th>Contact</th><th>University</th><th>Guidance</th><th>Status</th><th>Actions</th></tr></thead><tbody>{!errorMessage && data?.results.length ? data.results.map((counselor) => <CounselorsManagementRow counselor={counselor} key={counselor.id} />) : <tr><td className={styles.emptyCell} colSpan={6}><EmptyState actions={filters.search ? [{ icon: Cancel01Icon, label: "Reset filters", onClick: () => navigate("/counselors"), variant: "secondary" }] : undefined} icon={UserGroupIcon} message={errorMessage ? "The counselor directory is unavailable right now. Reload the page to try again." : "No active counselors from your university match this search."} title={errorMessage ? "Counselors could not be loaded" : "No counselors found"} /></td></tr>}</tbody></table></div></section><Pagination currentPage={data?.page ?? filters.page} getPageHref={(page) => buildCounselorsHref({ ...filters, page })} label="Counselors pagination" totalPages={totalPages} /></div>;
}
