"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft01Icon,
  Briefcase01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  GraduationCapIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import { ManagementFormShell } from "@/components/shared/ManagementFormShell";
import { SelectField } from "@/components/shared/SelectField";
import { useToast } from "@/components/shared/ToastProvider";
import { InputField } from "@/components/shared/InputField";
import {
  isSuccessfulMutation,
  readFieldErrors,
  readStudentProfileError,
  requestStudentProfile,
  type StudentProfileFieldErrors,
} from "@/components/profile/utils";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { NOT_EMPLOYED_WORKING_PLACE } from "@/constants/student-event-form";
import type {
  StudentEventForm as StudentEventFormRecord,
  StudentEventFormMutationResponse,
} from "@/types/student-event-form";
import styles from "./StudentEventForm.module.css";

interface StudentEventFormProps {
  initialForm: StudentEventFormRecord | null;
}

const BOOLEAN_OPTIONS = [
  { label: "Choose an option", value: "" },
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const COHORT_OPTIONS = [
  { label: "Choose a cohort year", value: "" },
  ...Array.from({ length: new Date().getFullYear() - 2019 + 1 }, (_, index) => {
    const year = String(2019 + index);
    return { label: year, value: year };
  }),
];

export function StudentEventForm({ initialForm }: StudentEventFormProps) {
  const router = useRouter();
  const { showSuccessToast } = useToast();
  const formErrorRef = useRef<HTMLParagraphElement>(null);
  const [form, setForm] = useState(initialForm);
  const [employed, setEmployed] = useState("");
  const [workingPlace, setWorkingPlace] = useState("");
  const [whichCohort, setWhichCohort] = useState("");
  const [attend, setAttend] = useState("");
  const [errors, setErrors] = useState<StudentProfileFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Answering "No" to employment fixes the working place, so the input is
  // disabled and the recorded value comes from the constant instead of state.
  // The student's own text is kept so switching back to "Yes" restores it.
  const isNotEmployed = employed === "false";
  const submittedWorkingPlace = isNotEmployed
    ? NOT_EMPLOYED_WORKING_PLACE
    : workingPlace.trim();

  useEffect(() => {
    if (formError) formErrorRef.current?.focus();
  }, [formError]);

  function clearError(field: string) {
    if (!errors[field]) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate() {
    const next: StudentProfileFieldErrors = {};
    if (employed !== "true" && employed !== "false") {
      next.employed = "Choose your current employment status.";
    }
    if (
      !isNotEmployed &&
      (!workingPlace.trim() || workingPlace.trim().length > 255)
    ) {
      next.working_place = "Enter a working place of up to 255 characters.";
    }
    if (!whichCohort) {
      next.which_cohort = "Choose your cohort year.";
    }
    if (attend !== "true" && attend !== "false") {
      next.attend = "Choose whether you will attend.";
    }
    return next;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving || form) return;

    const validationErrors = validate();
    setErrors(validationErrors);
    setFormError(null);
    if (Object.keys(validationErrors).length) return;

    setIsSaving(true);
    const result =
      await requestStudentProfile<StudentEventFormMutationResponse>(
        "/api/student/event-form",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employed: employed === "true",
            working_place: submittedWorkingPlace,
            which_cohort: whichCohort,
            attend: attend === "true",
          }),
        },
      );
    setIsSaving(false);

    if (
      !result.ok ||
      !isSuccessfulMutation<StudentEventFormMutationResponse>(result.payload)
    ) {
      setErrors(readFieldErrors(result.payload));
      setFormError(
        readStudentProfileError(result.payload) ??
          result.transportError ??
          "Your event response could not be saved.",
      );
      return;
    }

    setForm(result.payload.data);
    showSuccessToast(result.payload.message);
    router.refresh();
  }

  const submitted = Boolean(form);
  const title = submitted ? "Event response received" : "Event response";

  return (
    <ManagementFormShell
      actions={
        submitted ? (
          <AuthButton
            icon={ArrowLeft01Icon}
            onClick={() => router.push("/dashboard")}
            type="button"
            variant="secondary"
          >
            Back to dashboard
          </AuthButton>
        ) : (
          <AuthButton
            icon={SentIcon}
            isLoading={isSaving}
            loadingLabel="Saving response"
            type="submit"
          >
            Submit response
          </AuthButton>
        )
      }
      description={
        submitted
          ? "Your event response has been recorded for the Talent Match team."
          : "Share your current work and attendance details for the Talent Match event."
      }
      eyebrow="Student event"
      formError={
        formError ? (
          <p
            className={styles.formError}
            ref={formErrorRef}
            role="alert"
            tabIndex={-1}
          >
            {formError}
          </p>
        ) : undefined
      }
      headerAction={
        <AuthButton
          disabled={isSaving}
          icon={ArrowLeft01Icon}
          onClick={() => router.push("/dashboard")}
          type="button"
          variant="secondary"
        >
          Go back
        </AuthButton>
      }
      isSaving={isSaving}
      onSubmit={submit}
      progressPercent={100}
      savingLabel="Saving your event response"
      stepDescription={
        submitted
          ? "The details below are the response recorded for your account."
          : "All fields are required so the event team can plan accurately."
      }
      stepLabel={submitted ? "Response complete" : "Required response"}
      stepNavigation={<EventFormRail submitted={submitted} />}
      stepTitle={title}
      title={title}
      titleId="student-event-form-title"
    >
      <EventDetails />
      {form ? (
        <EventFormSummary form={form} />
      ) : (
        <div className={styles.fields}>
          <SelectField
            error={errors.employed}
            icon={Briefcase01Icon}
            label="Are you currently employed?"
            name="employed"
            onChange={(event) => {
              setEmployed(event.target.value);
              clearError("employed");
              if (event.target.value === "false") clearError("working_place");
            }}
            options={BOOLEAN_OPTIONS}
            requirement="required"
            value={employed}
          />
          <InputField
            disabled={isNotEmployed}
            error={errors.working_place}
            icon={Briefcase01Icon}
            label="Where are you working?"
            maxLength={255}
            name="working_place"
            onChange={(event) => {
              setWorkingPlace(event.target.value);
              clearError("working_place");
            }}
            placeholder="Organisation or company"
            requirement="required"
            value={isNotEmployed ? NOT_EMPLOYED_WORKING_PLACE : workingPlace}
          />
          <p className={styles.fieldHint}>
            {isNotEmployed
              ? `Because you are not currently employed, your working place is recorded as “${NOT_EMPLOYED_WORKING_PLACE}”.`
              : "Name the organisation or company you currently work for."}
          </p>
          <SelectField
            error={errors.which_cohort}
            icon={GraduationCapIcon}
            label="Which cohort were you in?"
            name="which_cohort"
            onChange={(event) => {
              setWhichCohort(event.target.value);
              clearError("which_cohort");
            }}
            options={COHORT_OPTIONS}
            requirement="required"
            value={whichCohort}
          />
          <SelectField
            error={errors.attend}
            icon={Calendar03Icon}
            label="Will you attend the event?"
            name="attend"
            onChange={(event) => {
              setAttend(event.target.value);
              clearError("attend");
            }}
            options={BOOLEAN_OPTIONS}
            requirement="required"
            value={attend}
          />
        </div>
      )}
    </ManagementFormShell>
  );
}

function EventFormRail({ submitted }: { submitted: boolean }) {
  return (
    <aside className={styles.rail} aria-label="Event response status">
      <header className={styles.railHeader}>
        <span>Event participation</span>
        <strong>Student response</strong>
      </header>
      <div className={styles.railStep}>
        <span className={styles.railMarker} aria-hidden="true">
          <HugeIcon
            icon={submitted ? CheckmarkCircle02Icon : Calendar03Icon}
            size={17}
          />
        </span>
        <span className={styles.railStepCopy}>
          <strong>{submitted ? "Response received" : "Event response"}</strong>
          <small>
            {submitted
              ? "Your event details are saved."
              : "Complete the required planning details."}
          </small>
        </span>
      </div>
      <p className={styles.railNote}>
        Your response is linked securely to your signed-in student account.
      </p>
    </aside>
  );
}

function EventFormSummary({ form }: { form: StudentEventFormRecord }) {
  return (
    <div className={styles.summary}>
      <p className={styles.summaryIntro}>
        Thank you. Your response is complete and available to the event team.
      </p>
      <dl className={styles.summaryList}>
        <div className={styles.summaryRow}>
          <dt>Employment</dt>
          <dd>
            {form.employed ? "Currently employed" : "Not currently employed"}
          </dd>
        </div>
        <div className={styles.summaryRow}>
          <dt>Working place</dt>
          <dd>{form.working_place}</dd>
        </div>
        <div className={styles.summaryRow}>
          <dt>Cohort</dt>
          <dd>{form.which_cohort}</dd>
        </div>
        <div className={styles.summaryRow}>
          <dt>Attendance</dt>
          <dd>{form.attend ? "Will attend" : "Will not attend"}</dd>
        </div>
        <div className={styles.summaryRow}>
          <dt>Submitted</dt>
          <dd>{formatSubmissionDate(form.created_at)}</dd>
        </div>
      </dl>
    </div>
  );
}

function formatSubmissionDate(value: string) {
  if (Number.isNaN(new Date(value).getTime())) {
    return "Submission time unavailable";
  }

  return new Intl.DateTimeFormat("en-RW", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
}

function EventDetails() {
  return (
    <section className={styles.eventDetails} aria-label="Event details">
      <p className={styles.eventDetailsEyebrow}>
        Talent Match Alumni &amp; Employer Mixer
      </p>
      <p className={styles.eventDetailsBody}>
        Connect with Talent Match alumni, employers, and professionals to
        network, exchange insights, and explore career opportunities.
      </p>
      <p className={styles.eventDetailsBody}>
        Join us for an afternoon of meaningful connections and opportunity
        building.
      </p>
      <ul className={styles.eventDetailsMeta}>
        <li>📅 Date: 25 November 2026</li>
        <li>🕐 Time: 1:00 PM</li>
        <li>📍 Location: KG 541 St, Career Center Building, 7th Floor, Kigali</li>
      </ul>
      <p className={styles.eventDetailsCta}>
        Register now and connect with the Talent Match community.
      </p>
    </section>
  );
}
