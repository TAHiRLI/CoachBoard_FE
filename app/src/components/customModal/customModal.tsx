import { FC, ReactNode } from "react";
import { IconButton, Theme, useMediaQuery } from "@mui/material";

import Box from "@mui/material/Box";
import { Close } from "@mui/icons-material";
import Modal from "@mui/material/Modal";
import ReactDOM from "react-dom";
import { useTheme } from "@emotion/react";

// Define the props type (or use an interface)
type CustomModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  children?: ReactNode;
  onClose?: () => void;
};

const CustomModal: FC<CustomModalProps> = ({ open, setOpen, children, onClose }) => {
  const handleClose = () => {
    if (onClose) onClose();
    setOpen(false);
  };

  const theme = useTheme() as Theme;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const width = isSmallScreen ? "90vw" : "70vw";

  // Add an explicit assertion for 'position' to avoid TS type conflicts
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width,
    bgcolor: "background.default",
    boxShadow: 4,
    p: 2,
    maxHeight: "90vh",
    borderRadius: "14px",
    overflow: "auto",
  };

  return ReactDOM.createPortal(
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modalBox">
          <div className="overflow-auto h-full p-4">{children}</div>
          <IconButton
            color="error"
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", top: 2, right: 2 }}
          >
            <Close />
          </IconButton>
        </Box>
      </Modal>
    </div>,
    // Make sure to assert the type for the portal's container element
    document.getElementById("modal-root") as HTMLElement
  );
};

export default CustomModal;
