import { createContext } from "react";

/** Header slot element provided by Layout; see PageActions. */
export const PageActionsContext = createContext<HTMLElement | null>(null);
