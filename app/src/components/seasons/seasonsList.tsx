import { Box, LinearProgress } from "@mui/material";
import { confirmDelete } from "@/components/feedback/feedback";
import { Delete, Edit } from "@mui/icons-material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { deleteSeason, fetchSeasons, selectSeason } from "@/store/slices/seasons.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import CustomModal from "../customModal/customModal";
import EditSeason from "./editSeason";
import { GridColDef } from "@mui/x-data-grid";
import RowActions from "../rowActions/rowActions";
import { Season } from "@/lib/types/seasons.types";
import StyledDataGrid from "../styledDatagrid/styledDatagrid";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const SeasonsList: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { seasons, selectedSeason, loading } = useAppSelector((state) => state.seasonData);
  const [editOpen, setEditOpen] = useState(false);
  // State

  useEffect(() => {
    dispatch(fetchSeasons());
  }, []);
  const handleEdit = (season: Season) => {
    dispatch(selectSeason(season));
    setEditOpen(true);
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) return;

      confirmDelete().then(async (confirmed) => {
        if (confirmed && id) {
          dispatch(deleteSeason(id));
        }
      });
    },
    [dispatch, t]
  );
  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "name",
        headerName: t("static.name"),
        flex: 1,
      },
      {
        field: "startDate",
        headerName: t("static.start"),
        flex: 1,
        valueGetter: (params) => (params ? dayjs(params).format("DD.MM.YYYY") : ""),
      },
      {
        field: "endDate",
        headerName: t("static.end"),
        flex: 1,
        valueGetter: (params) => (params ? dayjs(params).format("DD.MM.YYYY") : ""),
      },
      {
        field: "actions",
        headerName: t("static.actions"),
        sortable: false,
        width: 100,
        renderCell: (params) => (
          <RowActions
            actions={[
              {
                icon: <Edit fontSize="small" />,
                label: t("static.edit"),
                onClick: () => handleEdit(params.row),
                color: "warning",
              },
              {
                icon: <Delete fontSize="small" />,
                label: t("static.delete"),
                onClick: () => handleDelete(params.row.id),
                color: "error",
              },
            ]}
          />
        ),
      },
    ],
    []
  );

  return (
    <>
      {loading && <LinearProgress />}
      <div className="">
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
          <StyledDataGrid
            rows={seasons}
            columns={columns}
            disableRowSelectionOnClick
            loading={loading}
            
          />
        </Box>
      </div>
      {selectedSeason && (
        <CustomModal open={editOpen} setOpen={setEditOpen}>
          <EditSeason season={selectedSeason} onSuccess={() => setEditOpen(false)} />
        </CustomModal>
      )}
    </>
  );
};

export default SeasonsList;
