"use client";

import {
  Calendar03Icon,
  Cancel01Icon,
  FilterHorizontalIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { AdminFilterShell } from "@/components/shared/AdminFilterShell";
import { AuthButton } from "@/components/shared/AuthButton";
import { InputField } from "@/components/shared/InputField";
import styles from "./EventFilters.module.css";

export function EventFilters({
}: EventFiltersProps) {

  return (
    <AdminFilterShell
      actions={
        <>
          <AuthButton
            className={styles.utilityButton}
            icon={FilterHorizontalIcon}
            // isLoading={isPending}
            type="submit"
          >
            Apply
          </AuthButton>
          <AuthButton
            className={styles.utilityButton}
            // disabled={!hasOpportunityFilters(filters)}
            icon={Cancel01Icon}
            // onClick={reset}
            variant="secondary"
          >
            Reset
          </AuthButton>
        </>
      }
      ariaLabel="Event filters"
      dateControls={
        <>
          <div className={styles.dateField}>
            <InputField
              icon={Calendar03Icon}
              label="From date"
              name="created_from"
            //   onChange={(event) => setCreatedFrom(event.target.value)}
              type="date"
            //   value={createdFrom}
            />
          </div>
          <div className={styles.dateField}>
            <InputField
              icon={Calendar03Icon}
              label="To date"
              name="created_to"
            //   onChange={(event) => setCreatedTo(event.target.value)}
              type="date"
            //   value={createdTo}
            />
          </div>
        </>
      }
      onSubmit={onsubmit}
    >
      <div className={styles.searchField}>
        <InputField
          autoComplete="off"
          icon={Search01Icon}
          label="Search events"
          name="search"
        //   onChange={(event) => setSearch(event.target.value)}
          placeholder="Search events"
          type="search"
        //   value={search}
        />
      </div>
    </AdminFilterShell>
  );
}
