import i18n from "i18next";

export { errorMessage } from "@/lib/utils/apiError";

// Confirm dialogs and toasts are triggered from components and from Redux middleware,
// so they are driven by a tiny module-level store rather than React context.

type Severity = "success" | "error" | "info" | "warning";

export interface Toast {
  id: number;
  severity: Severity;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ConfirmOptions {
  title?: string;
  text?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export interface PendingConfirm extends ConfirmOptions {
  resolve: (confirmed: boolean) => void;
}

let toastSeq = 0;
let toastQueue: Toast[] = [];
let pendingConfirm: PendingConfirm | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export const notify = (
  severity: Severity,
  message: string,
  action?: { label: string; onClick: () => void }
) => {
  // Collapse identical consecutive messages (e.g. several failing requests on one page).
  if (toastQueue.some((toast) => toast.message === message && toast.severity === severity)) return;
  toastQueue = [
    ...toastQueue,
    { id: ++toastSeq, severity, message, actionLabel: action?.label, onAction: action?.onClick },
  ];
  emit();
};

export const confirmAction = (options: ConfirmOptions = {}): Promise<boolean> =>
  new Promise((resolve) => {
    pendingConfirm?.resolve(false);
    pendingConfirm = { ...options, resolve };
    emit();
  });

/** Standard delete confirmation used across the app. */
export const confirmDelete = (options: ConfirmOptions = {}) =>
  confirmAction({
    title: i18n.t("static.areYouSure"),
    // Deletes are soft on the server; the success toast offers Undo for restorable records.
    // Callers deleting something permanent pass text: t("static.cannotBeUndone").
    text: i18n.t("static.deleteUndoHint"),
    confirmLabel: i18n.t("static.delete"),
    destructive: true,
    ...options,
  });

// Read/write access for FeedbackHost, the only component that renders this state.
export const feedbackState = {
  current: () => ({ toast: toastQueue[0] as Toast | undefined, confirm: pendingConfirm }),
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  dismissToast: () => {
    toastQueue = toastQueue.slice(1);
    emit();
  },
  resolveConfirm: (confirmed: boolean) => {
    pendingConfirm?.resolve(confirmed);
    pendingConfirm = null;
    emit();
  },
};
