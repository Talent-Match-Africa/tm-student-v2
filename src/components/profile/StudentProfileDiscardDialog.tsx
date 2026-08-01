"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { AuthButton } from "@/components/shared/AuthButton";
import { HugeIcon } from "@/components/shared/HugeIcon";
import styles from "./StudentProfileDiscardDialog.module.css";

interface StudentProfileDiscardDialogProps {
  onDiscard: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function StudentProfileDiscardDialog({
  onDiscard,
  onOpenChange,
  open,
}: StudentProfileDiscardDialogProps) {
  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.backdrop} />
        <Dialog.Content className={styles.dialog}>
          <header className={styles.header}>
            <span className={styles.icon} aria-hidden="true">
              <HugeIcon icon={AlertCircleIcon} size={20} />
            </span>
            <div>
              <span>Unsaved profile</span>
              <Dialog.Title>Leave without saving?</Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close unsaved changes dialog"
                className={styles.closeButton}
                type="button"
              >
                <HugeIcon icon={Cancel01Icon} size={16} />
              </button>
            </Dialog.Close>
          </header>

          <Dialog.Description>
            The information entered in this profile section has not been saved.
            Leaving now will discard it.
          </Dialog.Description>

          <footer className={styles.actions}>
            <Dialog.Close asChild>
              <AuthButton icon={Cancel01Icon} type="button" variant="secondary">
                Continue editing
              </AuthButton>
            </Dialog.Close>
            <AuthButton
              icon={ArrowLeft01Icon}
              onClick={onDiscard}
              type="button"
              variant="primary"
            >
              Discard and leave
            </AuthButton>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
