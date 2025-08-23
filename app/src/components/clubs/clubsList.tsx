import { Alert, Box, LinearProgress, Snackbar } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { clearClubError, deleteClub, fetchClubs, selectClub } from "@/store/slices/clubs.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Club } from "@/lib/types/clubs.types";
import CustomModal from "@/components/customModal/customModal";
import EditClub from "@/components/clubs/editClub";
import { GridColDef } from "@mui/x-data-grid";
import RowActions from "@/components/rowActions/rowActions";
import StyledDataGrid from "@/components/styledDatagrid/styledDatagrid";
import Swal from "sweetalert2";
import { apiUrl } from "@/lib/constants/constants";
import { useTranslation } from "react-i18next";

const ClubsList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { clubs, selectedClub, loading, error } = useAppSelector((state) => state.clubData);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchClubs());
  }, [dispatch]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    if (error) dispatch(clearClubError());
  };

  const handleEdit = (club: Club) => {
    dispatch(selectClub(club));
    setEditOpen(true);
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) return;

      Swal.fire({
        title: t("static.areYouSure"),
        text: t("static.cannotBeUndone"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("static.yesDeleteIt"),
      }).then((result) => {
        if (result.isConfirmed && id) {
          dispatch(deleteClub(id))
            .unwrap()
            .then(() => {
              Swal.fire(t("static.success"), "", "success");
            })
            .catch(() => {
              setSnackbarOpen(true);
            });
        }
      });
    },
    [dispatch]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "name",
        headerName: t("static.name"),
        flex: 1,
      },
      {
        field: "logo",
        headerName: t("static.logo"),
        flex: 1,
        renderCell: (params) =>
          params.value ? (
            <div className="flex items-center h-full">
              {" "}
              <img src={apiUrl + "/" + params.value} alt="logo" style={{ height: 42, objectFit: "contain" }} />
            </div>
          ) : (
            "—"
          ),
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
    [handleDelete]
  );

  return (
    <>
      {loading && <LinearProgress />}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
        <StyledDataGrid
          rowHeight={55}
          rows={clubs}
          columns={columns}
          disableRowSelectionOnClick
          loading={loading}
          hideFooter
        />
      </Box>

      {selectedClub && (
        <CustomModal open={editOpen} setOpen={setEditOpen}>
          <EditClub club={selectedClub} onSuccess={() => setEditOpen(false)} />
        </CustomModal>
      )}

      <Snackbar
        open={snackbarOpen}
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

export default ClubsList;
