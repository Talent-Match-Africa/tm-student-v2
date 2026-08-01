'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AlertCircleIcon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeIcon } from './HugeIcon';
import styles from './ErrorDialog.module.css';

interface ErrorDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onOpenChange: (open: boolean) => void;
}

export function ErrorDialog({
  message,
  onOpenChange,
  open,
  title = 'Review this issue',
}: ErrorDialogProps) {
  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <span className={styles.badge}>Action needed</span>

            <Dialog.Close className={styles.closeButton}>
              <span className="sr-only">Close</span>
              <HugeIcon icon={Cancel01Icon} size={20} />
            </Dialog.Close>
          </div>

          <div className={styles.body}>
            <div className={styles.iconWrap} aria-hidden="true">
              <HugeIcon icon={AlertCircleIcon} size={26} />
            </div>

            <div className={styles.copy}>
              <Dialog.Title className={styles.title}>{title}</Dialog.Title>

              <Dialog.Description className={styles.message}>
                {message}
              </Dialog.Description>
            </div>
          </div>

          <div className={styles.footer}>
            <Dialog.Close className={styles.actionButton}>
              Okay, I understand
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
