"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "./HugeIcon";
import styles from "./ToastProvider.module.css";

interface ToastMessage {
  id: number;
  message: string;
  tone: "success";
}

interface ToastContextValue {
  showSuccessToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const TOAST_VISIBLE_MS = 4200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showSuccessToast = useCallback(
    (message: string) => {
      const id = Date.now();

      setToasts((current) => [
        ...current,
        {
          id,
          message,
          tone: "success",
        },
      ]);

      window.setTimeout(() => dismissToast(id), TOAST_VISIBLE_MS);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      showSuccessToast,
    }),
    [showSuccessToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={styles.viewport}
        aria-live="polite"
        aria-relevant="additions"
        data-placement="top-right"
      >
        {toasts.map((toast) => (
          <div
            aria-atomic="true"
            className={styles.toast}
            data-tone={toast.tone}
            key={toast.id}
            role="status"
          >
            <span className={styles.toastIcon} aria-hidden="true">
              <HugeIcon icon={CheckmarkCircle02Icon} size={18} />
            </span>
            <span className={styles.message}>{toast.message}</span>
            <button
              aria-label="Dismiss notification"
              className={styles.dismissButton}
              onClick={() => dismissToast(toast.id)}
              title="Dismiss notification"
              type="button"
            >
              <HugeIcon icon={Cancel01Icon} size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}
