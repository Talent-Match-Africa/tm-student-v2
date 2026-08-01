"use client";

import { useRouter } from "next/navigation";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  getPageHref: (page: number) => string;
  label?: string;
  totalPages: number;
}

export function Pagination({
  currentPage,
  getPageHref,
  label = "Pagination",
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  if (totalPages <= 1) return null;
  return (
    <footer className={styles.pagination} aria-label={label}>
      <button
        className={styles.pageButton}
        disabled={currentPage <= 1}
        onClick={() => router.push(getPageHref(currentPage - 1))}
        type="button"
      >
        Previous
      </button>
      <span className={styles.pageStatus}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className={styles.pageButton}
        disabled={currentPage >= totalPages}
        onClick={() => router.push(getPageHref(currentPage + 1))}
        type="button"
      >
        Next
      </button>
    </footer>
  );
}
