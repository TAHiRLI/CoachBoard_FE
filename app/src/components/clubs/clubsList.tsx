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

const ClubsList: React.FC = () => {
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
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed && id) {
          dispatch(deleteClub(id))
            .unwrap()
            .then(() => {
              Swal.fire("Deleted!", "The club has been removed.", "success");
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
        headerName: "Name",
        flex: 1,
      },
      {
        field: "logo",
        headerName: "Logo",
        flex: 1,
        renderCell: (params) =>
          params.value ? (
          <div className="flex items-center h-full">  <img src={apiUrl + "/" + params.value} alt="logo" style={{ height: 42, objectFit: "contain" }} /></div>
          ) : (
            "—"
          ),
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
