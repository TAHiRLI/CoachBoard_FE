import "@fontsource-variable/geist";

import type {} from "@mui/x-data-grid/themeAugmentation";

import { alpha, createTheme } from "@mui/material/styles";

export type ColorMode = "light" | "dark";

// One accent (brand blue) on cool slate neutrals. Status colours are used only for real state.
const tokens = {
  light: {
    bg: "#f4f6f9",
    surface: "#ffffff",
    surfaceMuted: "#f8f9fb",
    border: "#e2e6ec",
    text: "#111827",
    textMuted: "#5b6472",
    accent: "#2457d6",
    accentDark: "#1b44ad",
    accentContrast: "#ffffff",
    success: "#15803d",
    warning: "#b45309",
    error: "#c62828",
    shadow: "rgba(17, 24, 39, 0.06)",
  },
  dark: {
    bg: "#0e1116",
    surface: "#161a21",
    surfaceMuted: "#1b2029",
    border: "#262c36",
    text: "#e6e8eb",
    textMuted: "#9aa3b0",
    accent: "#6b93ff",
    accentDark: "#4f7bf0",
    accentContrast: "#0b1020",
    success: "#4ade80",
    warning: "#fbbf24",
    error: "#f87171",
    shadow: "rgba(0, 0, 0, 0.4)",
  },
} as const;

export const fontFamily = '"Geist Variable", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export const buildTheme = (mode: ColorMode) => {
  const c = tokens[mode];

  return createTheme({
    palette: {
      mode,
      primary: { main: c.accent, dark: c.accentDark, contrastText: c.accentContrast },
      secondary: { main: c.textMuted },
      success: { main: c.success },
      warning: { main: c.warning },
      error: { main: c.error },
      background: { default: c.bg, paper: c.surface },
      text: { primary: c.text, secondary: c.textMuted },
      divider: c.border,
      action: { hover: alpha(c.accent, 0.06), selected: alpha(c.accent, 0.1) },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily,
      h1: { fontSize: "1.75rem", fontWeight: 650, letterSpacing: "-0.02em" },
      h2: { fontSize: "1.375rem", fontWeight: 650, letterSpacing: "-0.015em" },
      h3: { fontSize: "1.125rem", fontWeight: 650 },
      h4: { fontSize: "1rem", fontWeight: 650 },
      h5: { fontSize: "0.95rem", fontWeight: 650 },
      h6: { fontSize: "0.9rem", fontWeight: 650 },
      button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
      overline: { fontWeight: 600, letterSpacing: "0.06em" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ":root": {
            "--cb-bg": c.bg,
            "--cb-surface": c.surface,
            "--cb-surface-muted": c.surfaceMuted,
            "--cb-border": c.border,
            "--cb-text": c.text,
            "--cb-text-muted": c.textMuted,
            "--cb-accent": c.accent,
            "--cb-accent-soft": alpha(c.accent, mode === "light" ? 0.08 : 0.16),
            "--cb-shadow": c.shadow,
            colorScheme: mode,
          },
          body: {
            backgroundColor: c.bg,
            color: c.text,
            fontFeatureSettings: '"tnum" 1',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 8,
            whiteSpace: "nowrap",
            transition: "transform 120ms ease, background-color 160ms ease",
            "&:active": { transform: "translateY(1px)" },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { backgroundImage: "none" },
          outlined: { borderColor: c.border },
          elevation0: { border: `1px solid ${c.border}` },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { border: `1px solid ${c.border}`, borderRadius: 12 } },
      },
      MuiMenu: {
        styleOverrides: {
          paper: { border: `1px solid ${c.border}`, boxShadow: `0 12px 32px ${c.shadow}` },
        },
      },
      MuiPopover: {
        styleOverrides: { paper: { boxShadow: `0 12px 32px ${c.shadow}` } },
      },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 14, border: `1px solid ${c.border}` } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { backgroundColor: c.surface },
          notchedOutline: { borderColor: c.border },
        },
      },
      MuiTooltip: {
        styleOverrides: { tooltip: { fontSize: "0.75rem", borderRadius: 6 } },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600, borderRadius: 6 } },
      },
      MuiTab: {
        styleOverrides: { root: { textTransform: "none", fontWeight: 600, minHeight: 44 } },
      },
      MuiAlert: {
        styleOverrides: { root: { borderRadius: 10 } },
      },
      MuiDataGrid: {
        defaultProps: { rowHeight: 48, columnHeaderHeight: 44 },
        styleOverrides: {
          root: {
            border: `1px solid ${c.border}`,
            borderRadius: 12,
            backgroundColor: c.surface,
            "--DataGrid-containerBackground": c.surfaceMuted,
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
              fontSize: "0.8125rem",
              color: c.textMuted,
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": { backgroundColor: alpha(c.accent, 0.04) },
          },
        },
      },
    },
  });
};
