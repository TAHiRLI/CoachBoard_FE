import { Box, Button, Chip, LinearProgress, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";

import ClipItem from "./ClipItem";
import { GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import StyledDataGrid from "../styledDatagrid/styledDatagrid";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { useAppSelector } from "@/store/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ClipsList = () => {
  const { t } = useTranslation();
  const { clips, loading } = useAppSelector((x) => x.clipData);

  const [visibleCount, setVisibleCount] = useState(30);
  const [viewMode, setViewMode] = useState<"card" | "table">("table");

  if (loading) return <LinearProgress />;

  const visibleClips = clips.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t("static.name"),
      flex: 1,
      minWidth: 220,
      renderCell: (row) => {
        return (
          <>
            <Link to={`/clips/${row.id}`}>
              🎬 {t("static.clip")} #{row.id}: {row.value}
            </Link>
          </>
        );
      },
    },
    {
      field: "matchName",
      headerName: t("static.match"),
      flex: 1,
      minWidth: 220,
      valueGetter: (_, row) => row.matchName ?? "-",
    },
    {
      field: "seasonName",
      headerName: t("static.season"),
      flex: 1,
      minWidth: 200,
      valueGetter: (_, row) => row.seasonName ?? "-",
    },
    {
      field: "coachName",
      headerName: t("static.coach"),
      flex: 1,
      minWidth: 180,
      valueGetter: (_, row) => row.coachName ?? "-",
    },
    {
      field: "tags",
      headerName: t("static.tags"),
      flex: 1,
      minWidth: 220,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const tags = params.row.tags as { id: number; name: string }[] | undefined;

        if (!tags || tags.length === 0) {
          return <span></span>;
        }

        return (
         <div className="h-full w-full flex items-center">
           <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {tags.map((tag) => (
              <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
            ))}
          </Stack>
         </div>
        );
      },
    },
  ];

  return (
    <>
      {/* view toggle */}
      <div className="flex justify-end mb-4">
        <ToggleButtonGroup value={viewMode} exclusive size="small" onChange={(_, v) => v && setViewMode(v)}>
          <ToggleButton value="card">
            <ViewModuleIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="table">
            <TableRowsIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* CARD MODE */}
      {viewMode === "card" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleClips.map((clip) => (
              <ClipItem key={clip.id} clip={clip} />
            ))}
          </div>

          {visibleCount < clips.length && (
            <div className="flex justify-center mt-4">
              <Button variant="contained" onClick={loadMore}>
                {t("static.loadMore")}
              </Button>
            </div>
          )}
        </>
      )}

      {/* TABLE MODE */}
      {viewMode === "table" && (
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
          <StyledDataGrid
            rows={clips}
            columns={columns}
            rowHeight={35}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
          />
        </Box>
      )}
    </>
  );
};

export default ClipsList;
