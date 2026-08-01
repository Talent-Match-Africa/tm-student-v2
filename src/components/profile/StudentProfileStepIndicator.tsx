import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { STUDENT_PROFILE_STEPS } from "./constants";
import styles from "./StudentProfileStepIndicator.module.css";

interface StudentProfileStepIndicatorProps {
  currentStep: number;
  disabled?: boolean;
  onStepChange: (step: number) => void;
}

export function StudentProfileStepIndicator({
  currentStep,
  disabled = false,
  onStepChange,
}: StudentProfileStepIndicatorProps) {
  return (
    <aside className={styles.rail} aria-label="Student profile sections">
      <header className={styles.header}>
        <span>Account settings</span>
        <strong>Student profile</strong>
      </header>

      <nav className={styles.steps}>
        {STUDENT_PROFILE_STEPS.map((step, index) => (
          <button
            aria-current={index === currentStep ? "step" : undefined}
            className={styles.step}
            data-active={index === currentStep ? "true" : "false"}
            disabled={disabled}
            key={step.key}
            onClick={() => onStepChange(index)}
            type="button"
          >
            <span className={styles.marker}>
              <HugeIcon
                icon={index < currentStep ? CheckmarkCircle02Icon : step.icon}
                size={17}
              />
            </span>
            <span className={styles.copy}>
              <strong>{step.label}</strong>
              <small>{step.description}</small>
            </span>
          </button>
        ))}
      </nav>

      <p className={styles.note}>
        Email and password changes require your current password. Other
        signed-in devices are disconnected after a sensitive change.
      </p>
    </aside>
  );
}
