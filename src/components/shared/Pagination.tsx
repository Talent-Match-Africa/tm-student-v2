import Link from "next/link";
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
  if (totalPages <= 1) return null;
  return (
    <footer className={styles.pagination} aria-label={label}>
      {currentPage <= 1 ? (
        <span aria-disabled="true" className={styles.pageButton}>
          Previous
        </span>
      ) : (
        <Link
          className={styles.pageButton}
          href={getPageHref(currentPage - 1)}
        >
          Previous
        </Link>
      )}
      <span className={styles.pageStatus}>
        Page {currentPage} of {totalPages}
      </span>
      {currentPage >= totalPages ? (
        <span aria-disabled="true" className={styles.pageButton}>
          Next
        </span>
      ) : (
        <Link
          className={styles.pageButton}
          href={getPageHref(currentPage + 1)}
        >
          Next
        </Link>
      )}
    </footer>
  );
}
