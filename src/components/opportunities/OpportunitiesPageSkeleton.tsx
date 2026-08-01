import { OpportunityListingCardSkeleton } from "@/components/shared/OpportunityListingCardSkeleton";
import styles from "./OpportunitiesPageSkeleton.module.css";

const CATEGORY_PLACEHOLDERS = Array.from({ length: 2 }, (_, index) => index);
const SIDEBAR_FIELD_PLACEHOLDERS = Array.from(
  { length: 10 },
  (_, index) => index,
);
const OPPORTUNITY_PLACEHOLDERS = Array.from(
  { length: 24 },
  (_, index) => index,
);

export function OpportunitiesPageSkeleton() {
  return (
    <div
      aria-label="Loading opportunities"
      aria-live="polite"
      className={styles.workspace}
      role="status"
    >
      <header className={styles.header} aria-hidden="true">
        <div className={styles.headerCopy}>
          <span className={styles.eyebrow} />
          <span className={styles.title} />
          <span className={styles.description} />
        </div>
        <div className={styles.headerActions}>
          <span className={styles.resultBadge} />
          <span className={styles.addButton} />
        </div>
      </header>
      <section className={styles.filterPanel}>
        <div className={styles.filterForm}>
          <div className={styles.searchControl}>
            <span className={styles.fieldLabel} />
            <span className={styles.fieldControl} />
          </div>
          <div className={styles.dateControls}>
            <div className={styles.dateControl}>
              <span className={styles.fieldLabel} />
              <span className={styles.fieldControl} />
            </div>
            <div className={styles.dateControl}>
              <span className={styles.fieldLabel} />
              <span className={styles.fieldControl} />
            </div>
          </div>
          <div className={styles.filterActions}>
            <span className={styles.filterPrimaryButton} />
            <span className={styles.filterButton} />
          </div>
        </div>
      </section>

      <div className={styles.contentLayout} aria-hidden="true">
        <aside className={styles.categoryRail}>
          <section className={styles.categoryPanel}>
            <span className={styles.categoryLabel} />
            <div className={styles.categories}>
              {CATEGORY_PLACEHOLDERS.map((category) => (
                <div className={styles.category} key={category}>
                  <span className={styles.categoryIcon} />
                  <span className={styles.categoryCopy}>
                    <span className={styles.categoryTitle} />
                    <span className={styles.categoryDescription} />
                    <span className={styles.categoryDescriptionShort} />
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.sidebarScroll}>
            <section className={styles.sidebarPanel}>
              <div className={styles.sidebarHeader}>
                <span className={styles.sidebarHeaderIcon} />
                <span className={styles.sidebarHeaderCopy}>
                  <span className={styles.sidebarTitle} />
                  <span className={styles.sidebarDescription} />
                </span>
              </div>
              <div className={styles.sidebarFields}>
                {SIDEBAR_FIELD_PLACEHOLDERS.map((field) => (
                  <div className={styles.sidebarField} key={field}>
                    <span className={styles.fieldLabel} />
                    <span className={styles.fieldControl} />
                  </div>
                ))}
              </div>
              <div className={styles.sidebarActions}>
                <span className={styles.sidebarButton} />
                <span className={styles.sidebarPrimaryButton} />
              </div>
            </section>
          </div>
        </aside>

        <main className={styles.results}>
          <section className={styles.feed}>
            {OPPORTUNITY_PLACEHOLDERS.map((opportunity) => (
              <OpportunityListingCardSkeleton key={opportunity} />
            ))}
          </section>
        </main>
      </div>

      <span className={styles.screenReaderOnly}>Loading opportunities...</span>
    </div>
  );
}
