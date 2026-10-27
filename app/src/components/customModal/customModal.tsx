import { FC, ReactNode } from "react";
import { IconButton, Theme, useMediaQuery } from "@mui/material";

import Box from "@mui/material/Box";
import { Close } from "@mui/icons-material";
import Modal from "@mui/material/Modal";
import ReactDOM from "react-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

type CustomModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  children?: ReactNode;
  onClose?: () => void;
};

const CustomModal: FC<CustomModalProps> = ({ open, setOpen, children, onClose }) => {
  const { t } = useTranslation();
  const handleClose = () => {
    if (onClose) onClose();
    setOpen(false);
  };

  const theme = useTheme() as Theme;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "calc(100vw - 32px)" : "70vw",
    maxWidth: 1080,
    bgcolor: "background.paper",
    border: 1,
    borderColor: "divider",
    boxShadow: "0 24px 64px rgba(15, 23, 42, 0.24)",
    maxHeight: "90dvh",
    borderRadius: "14px",
    overflow: "auto",
    outline: "none",
  };

  return ReactDOM.createPortal(
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} className="modalBox">
        <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>{children}</Box>
        <IconButton
          aria-label={t("static.close")}
          onClick={handleClose}
          sx={{ position: "absolute", top: 12, right: 12, color: "text.secondary" }}
        >
          <Close />
        </IconButton>
      </Box>
    </Modal>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default CustomModal;
