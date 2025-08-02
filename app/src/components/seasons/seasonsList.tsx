import { Alert, Box, LinearProgress, Snackbar } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { clearSeasonError, deleteSeason, fetchSeasons, selectSeason } from "@/store/slices/seasons.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import CustomModal from "../customModal/customModal";
import EditSeason from "./editSeason";
import { GridColDef } from "@mui/x-data-grid";
import RowActions from "../rowActions/rowActions";
import { Season } from "@/lib/types/seasons.types";
import StyledDataGrid from "../styledDatagrid/styledDatagrid";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const SeasonsList: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { seasons, selectedSeason, loading, error } = useAppSelector((state) => state.seasonData);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  // State

  useEffect(() => {
    dispatch(fetchSeasons());
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    if (error) {
      dispatch(clearSeasonError());
    }
  };
  const handleEdit = (season: Season) => {
    dispatch(selectSeason(season));
    setEditOpen(true);
  };

  const handleDelete = useCallback(
    (id: number) => {
      if (!id) return;

      Swal.fire({
        title: t("messages:areYouSure"),
        text: t("messages:unableToRevert"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("messages:yesDelete"),
      }).then(async (result) => {
        if (result.isConfirmed && id) {
          dispatch(deleteSeason(id))
            .unwrap()
            .then(() => {
              Swal.fire("Success", "", "success");
            });
        }
      });
    },
    [dispatch, t]
  );
  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
      },
      {
        field: "startDate",
        headerName: "Start",
        flex: 1,
        valueGetter: (params) => (params ? dayjs(params).format("DD.MM.YYYY") : ""),
      },
      {
        field: "endDate",
        headerName: "End",
        flex: 1,
        valueGetter: (params) => (params ? dayjs(params).format("DD.MM.YYYY") : ""),
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        width: 100,
        renderCell: (params) => (
          <RowActions
            actions={[
              {
                icon: <Edit fontSize="small" />,
                label: "Edit",
                onClick: () => handleEdit(params.row),
                color: "warning",
              },
              {
                icon: <Delete fontSize="small" />,
                label: "Delete",
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
            rowHeight={30}
            rows={seasons}
            columns={columns}
            disableRowSelectionOnClick
            loading={loading}
            hideFooter
          />
        </Box>
      </div>
      {selectedSeason && (
        <CustomModal open={editOpen} setOpen={setEditOpen}>
          <EditSeason season={selectedSeason} onSuccess={() => setEditOpen(false)} />
        </CustomModal>
      )}
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={"error"} variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SeasonsList;
