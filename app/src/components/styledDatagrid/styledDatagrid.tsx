import { DataGrid, DataGridProps } from "@mui/x-data-grid";

import { useTranslation } from "react-i18next";

// Visual styling lives in the theme (MuiDataGrid overrides); this wrapper adds translated
// empty/no-results states so every list explains itself instead of showing a blank box.
const StyledDataGrid = (props: DataGridProps) => {
  const { t } = useTranslation();

  return (
    <DataGrid
      {...props}
      localeText={{
        noRowsLabel: t("static.noRecordsYet"),
        noResultsOverlayLabel: t("static.noMatchingRecords"),
        ...props.localeText,
      }}
      sx={{ minHeight: 240, ...props.sx }}
    />
  );
};

export default StyledDataGrid;
