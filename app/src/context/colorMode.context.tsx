import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";

// import { light } from "@mui/material/styles/createPalette";

// https://coolors.co/palette/e7ecef-274c77-6096ba-a3cef1-8b8c89

// Define the structure of the color mode context
interface ColorModeContextType {
  colorMode: {
    toggleColorMode: () => void;
    setColorMode: (mode: "light" | "dark") => void
  };
}

// Define props for ColorModeProvider
interface ColorModeProviderProps {
  children: ReactNode; // React children
}

// Create a context with default value
const ColorModeContext = createContext<ColorModeContextType>({
  colorMode: { toggleColorMode: () => {}, setColorMode: () => {} },
});

// Design tokens function for theme configuration
const getDesignTokens = (mode: "light" | "dark") =>
  ({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: "#2c376c", // Vibrant primary color
              dark: "#3e2c80",
            },
            secondary: {
              main: "#B3B4BD", // Light grey as secondary
            },
            background: {
              default: "#fff",
              paper: "#f4f4f4",
            },
            text: {
              primary: "#141619", // Very dark grey for text
              secondary: "#2C2E3A", // Slightly lighter for secondary text
              light: "#FFF",
            },
            divider: "#8B8C89",
          }
        : {
            primary: {
              main: "#3e2c80", // Vibrant blue
              dark: "#0ca5e9", // Deep blue for dark mode
            },
            secondary: {
              main: "#B3B4BD", // Grey as secondary
            },
            background: {
              default: "#212121", // Dark background
              paper: "#2f2f2f", // Slightly lighter background
            },
            text: {
              primary: "#FFFFFF", // White text
              secondary: "#B3B4BD", // Light grey secondary text
              light: "#FFF",
            },
            divider: "#2C2E3A",
          }),
    },
    components: {
      MuiDataGrid: {
        defaultProps: {
          disableRipple: false,
        },
        styleOverrides: {
          root: {
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: mode === "light" ? "#B3B4BD" : "#050A44", // Header color
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              color: mode === "light" ? "#141619" : "#FFFFFF",
            },
          },
        },
      },
    },
  } as any);

// Provider component for managing theme
export const ColorModeProvider: React.FC<ColorModeProviderProps> = ({ children }) => {
  const initialMode = (localStorage.getItem("themeMode") as "light" | "dark") || "light";
  const [mode, setMode] = useState<"light" | "dark">(initialMode);

  // Effect to save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);
  // Memoized toggle function
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
      setColorMode: (mode: "light" | "dark") => {
        setMode(mode);
      },
    }),
    []
  );

  // Create theme based on current mode
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={{ colorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

// Custom hook to consume the color mode context
export const useColorMode = (): ColorModeContextType => {
  return useContext(ColorModeContext);
};
