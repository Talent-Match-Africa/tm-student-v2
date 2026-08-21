"use client";

import { useState, type FormEvent } from "react";
import {
  Briefcase01Icon,
  Building03Icon,
  Cancel01Icon,
  FilterHorizontalIcon,
  Location01Icon,
  SortByDown02Icon,
  StatusIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { InputField } from "@/components/shared/InputField";
import { SelectionCheckbox } from "@/components/shared/SelectionCheckbox";
import { SelectField } from "@/components/shared/SelectField";
import styles from "./EventSidebarFilters.module.css";
import { OPPORTUNITY_ORDERING_OPTIONS } from "../opportunities/constants";

export function EventSidebarFilters({
}: EventSidebarFiltersProps) {
  return (
    <section
      className={styles.panel}
      aria-labelledby="event-filter-title"
    >
      <header className={styles.header}>
        <span className={styles.headerIcon} aria-hidden="true">
          <HugeIcon icon={FilterHorizontalIcon} size={15} />
        </span>
        <div>
          <h2 id="event-filter-title">Filter results</h2>
          <p>Refine the current event feed.</p>
        </div>
      </header>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.fields}>
          <InputField
            icon={Briefcase01Icon}
            label="Industry sector"
            name="industry_sector"
            // onChange={(event) =>
            //   setDraft((current) => ({
            //     ...current,
            //     industrySector: event.target.value,
            //   }))
            // }
            placeholder="Technology"
            requirement="optional"
            // value={draft.industrySector ?? ""}
          />
          <InputField
            icon={Location01Icon}
            label="Location"
            name="location"
            // onChange={(event) =>
            //   setDraft((current) => ({
            //     ...current,
            //     location: event.target.value,
            //   }))
            // }
            placeholder="Kigali"
            requirement="optional"
            // value={draft.location ?? ""}
          />
          <InputField
            icon={Location01Icon}
            label="Province"
            name="province"
            // onChange={(event) =>
            //   setDraft((current) => ({
            //     ...current,
            //     province: event.target.value,
            //   }))
            // }
            placeholder="Kigali City"
            requirement="optional"
            // value={draft.province ?? ""}
          />
          <InputField
            icon={Location01Icon}
            label="District"
            name="district"
            // onChange={(event) =>
            //   setDraft((current) => ({
            //     ...current,
            //     district: event.target.value,
            //   }))
            // }
            placeholder="Gasabo"
            requirement="optional"
            // value={draft.district ?? ""}
          />
          <SelectField
            icon={SortByDown02Icon}
            label="Sort results"
            name="ordering"
            // onChange={(event) =>
            //   setDraft((current) => ({
            //     ...current,
            //     ordering: event.target.value as OpportunityOrdering,
            //   }))
            // }
            options={OPPORTUNITY_ORDERING_OPTIONS}
            requirement="optional"
            // value={draft.ordering}
          />
        </div>

        <footer className={styles.actions}>
          <AuthButton
            className={styles.actionButton}
            // disabled={!hasAdvancedFilters(draft)}
            icon={Cancel01Icon}
            // onClick={reset}
            type="button"
            variant="secondary"
          >
            Reset
          </AuthButton>
          <AuthButton
            className={styles.actionButton}
            icon={FilterHorizontalIcon}
            // isLoading={isPending}
            loadingLabel="Applying filters"
            type="submit"
          >
            Apply
          </AuthButton>
        </footer>
      </form>
    </section>
  );
}