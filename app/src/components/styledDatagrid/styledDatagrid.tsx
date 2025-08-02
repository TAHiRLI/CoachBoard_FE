import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";

const StyledDataGrid = styled(DataGrid)(({ }) => ({
    borderRadius: '14px',
    "& .MuiDataGrid-columnHeaderTitle": {
    whiteSpace: "normal",
    textAlign: "center",
    lineHeight: 1,
  },
}));

export default StyledDataGrid;
