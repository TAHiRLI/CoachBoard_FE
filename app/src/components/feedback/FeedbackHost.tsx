import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

import { feedbackState } from "./feedback";
import i18n from "i18next";

const useFeedbackState = () => {
  const [, force] = useState(0);
  useEffect(() => feedbackState.subscribe(() => force((n) => n + 1)), []);
  return feedbackState.current();
};

export const FeedbackHost = () => {
  const { toast, confirm } = useFeedbackState();
  const [open, setOpen] = useState(true);

  useEffect(() => setOpen(true), [toast?.id]);

  const dismissToast = feedbackState.dismissToast;
  const closeConfirm = feedbackState.resolveConfirm;

  return (
    <>
      <Snackbar
        key={toast?.id}
        open={Boolean(toast) && open}
        autoHideDuration={toast?.onAction ? 7000 : toast?.severity === "error" ? 6000 : 3500}
        onClose={(_, reason) => reason !== "clickaway" && setOpen(false)}
        slotProps={{ transition: { onExited: dismissToast } }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {toast ? (
          <Alert
            severity={toast.severity}
            variant="filled"
            onClose={() => setOpen(false)}
            action={
              toast.onAction ? (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    toast.onAction?.();
                    setOpen(false);
                  }}
                >
                  {toast.actionLabel}
                </Button>
              ) : undefined
            }
            sx={{ minWidth: 280, alignItems: "center" }}
          >
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>

      <Dialog open={Boolean(confirm)} onClose={() => closeConfirm(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 650, fontSize: "1.0625rem" }}>{confirm?.title ?? i18n.t("static.areYouSure")}</DialogTitle>
        {confirm?.text && (
          <DialogContent>
            <DialogContentText>{confirm.text}</DialogContentText>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          {/* Destructive confirmations start focused on Cancel so Enter never deletes by accident. */}
          <Button color="inherit" onClick={() => closeConfirm(false)} autoFocus={confirm?.destructive}>
            {confirm?.cancelLabel ?? i18n.t("static.cancel")}
          </Button>
          <Button
            variant="contained"
            color={confirm?.destructive ? "error" : "primary"}
            onClick={() => closeConfirm(true)}
            autoFocus={!confirm?.destructive}
          >
            {confirm?.confirmLabel ?? i18n.t("static.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
