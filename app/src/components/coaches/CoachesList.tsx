import { Alert, Box, LinearProgress, Snackbar } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { clearCoachError, deleteCoach, fetchCoaches, selectCoach } from "@/store/slices/coaches.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useMemo, useState } from "react";

import { Coach } from "@/lib/types/coach.types";
import CustomModal from "@/components/customModal/customModal";
import EditCoach from "./EditCoach";
import { GridColDef } from "@mui/x-data-grid";
import RowActions from "@/components/rowActions/rowActions";
import StyledDataGrid from "@/components/styledDatagrid/styledDatagrid";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const CoachesList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { coaches, loading, error, selectedCoach } = useAppSelector((s) => s.coachData);
  const [editOpen, setEditOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCoaches());
  }, [dispatch]);

  const handleEdit = (coach: Coach) => {
    dispatch(selectCoach(coach));
    setEditOpen(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: t("static.areYouSure"),
      text: t("static.cannotBeUndone"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("static.yesDeleteIt"),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCoach(id));
      }
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    dispatch(clearCoachError());
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "fullName", headerName: t("static.fullName"), flex: 1 },
      { field: "email", headerName: t("static.email"), flex: 1 },
      { field: "teamName", headerName: t("static.clubTeam"), flex: 1 },
      {
        field: "actions",
        headerName: t("static.actions"),
        sortable: false,
        width: 100,
        renderCell: (params) => (
          <RowActions
            actions={[
              {
                icon: <Edit color="info" fontSize="small" />,
                label: t("static.edit"),
                onClick: () => handleEdit(params.row),
                color: "warning",
              },
              {
                icon: <Delete color="error" fontSize="small" />,
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
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
        <StyledDataGrid
          rowHeight={30}
          rows={coaches}
          columns={columns}
          disableRowSelectionOnClick
          loading={loading}
          hideFooter
        />
      </Box>
      {selectedCoach && (
        <CustomModal open={editOpen} setOpen={setEditOpen}>
          <EditCoach
            coach={selectedCoach}
            onSuccess={() => {
              dispatch(fetchCoaches());
              setEditOpen(false);
            }}
          />
        </CustomModal>
      )}
      <Snackbar
        open={!!error && snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CoachesList;
