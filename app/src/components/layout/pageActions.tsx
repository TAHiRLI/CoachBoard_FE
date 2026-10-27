import { ReactNode, useContext } from "react";

import { PageActionsContext } from "./pageActionsContext";
import { createPortal } from "react-dom";

// Layout owns the page header; pages own their buttons (and the modals those buttons open).
// PageActions lets a page place its primary buttons in the header without lifting that state.

const PageActions = ({ children }: { children: ReactNode }) => {
  const target = useContext(PageActionsContext);
  return target ? createPortal(children, target) : null;
};

export default PageActions;
