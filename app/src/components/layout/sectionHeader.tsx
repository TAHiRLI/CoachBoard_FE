import { Box, Typography } from "@mui/material";

import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  count?: number;
  actions?: ReactNode;
}

/** Heading row for a section inside a page: title, optional count, actions on the right. */
const SectionHeader = ({ title, count, actions }: SectionHeaderProps) => (
  <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
    <Typography component="h2" variant="h2" sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
      {/* Some translation values are lowercase (they are also used mid-sentence). */}
      {title.charAt(0).toLocaleUpperCase() + title.slice(1)}
      {count !== undefined && (
        <Typography component="span" color="text.secondary" fontWeight={500} fontSize="1rem">
          {count}
        </Typography>
      )}
    </Typography>
    {actions && <Box sx={{ ml: "auto", display: "flex", gap: 1, flexWrap: "wrap" }}>{actions}</Box>}
  </Box>
);

export default SectionHeader;
