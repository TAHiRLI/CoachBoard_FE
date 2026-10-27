import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorMode, buildTheme } from "@/theme/theme";
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";

interface ColorModeContextType {
  mode: ColorMode;
  colorMode: {
    toggleColorMode: () => void;
    setColorMode: (mode: ColorMode) => void;
  };
}

interface ColorModeProviderProps {
  children: ReactNode;
}

const ColorModeContext = createContext<ColorModeContextType>({
  mode: "light",
  colorMode: { toggleColorMode: () => {}, setColorMode: () => {} },
});

const readInitialMode = (): ColorMode => {
  try {
    const stored = localStorage.getItem("themeMode");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage can be unavailable (private mode); fall back to the system preference.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const ColorModeProvider: React.FC<ColorModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ColorMode>(readInitialMode);

  useEffect(() => {
    // Lets plain CSS (and the Tailwind compatibility layer in index.css) follow the theme.
    document.documentElement.dataset.theme = mode;
    try {
      localStorage.setItem("themeMode", mode);
    } catch {
      // Ignore storage failures; the mode still applies for this session.
    }
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
      setColorMode: (next: ColorMode) => setMode(next),
    }),
    []
  );

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, colorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = (): ColorModeContextType => useContext(ColorModeContext);
