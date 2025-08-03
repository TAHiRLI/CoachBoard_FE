import { Alert, Box, LinearProgress, Snackbar } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { clearEpisodeError, deleteEpisode, fetchEpisodes, selectEpisode } from "@/store/slices/episodes.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useCallback, useEffect, useMemo, useState } from "react";

import CustomModal from "../customModal/customModal";
import EditEpisode from "./EditEpisode";
import { Episode } from "@/lib/types/episodes.types";
import { GridColDef } from "@mui/x-data-grid";
import RowActions from "../rowActions/rowActions";
import StyledDataGrid from "../styledDatagrid/styledDatagrid";
import Swal from "sweetalert2";

const EpisodesList = () => {
  const dispatch = useAppDispatch();
  const { episodes, loading, selectedEpisode, error } = useAppSelector((state) => state.episodeData);

  const [editOpen, setEditOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEpisodes());
  }, [dispatch]);

  const handleEdit = (episode: Episode) => {
    dispatch(selectEpisode(episode));
    setEditOpen(true);
  };

  const handleDelete = useCallback(
    (id: string) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteEpisode(id))
            .unwrap()
            .then(() => Swal.fire("Deleted!", "Episode has been deleted.", "success"))
            .catch(() => setSnackbarOpen(true));
        }
      });
    },
    [dispatch]
  );

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    dispatch(clearEpisodeError());
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "name", headerName: "Name", flex: 1 },
      { field: "description", headerName: "Description", flex: 2 },
      {
        field: "evaluationCount",
        headerName: "Evaluations",
        width: 140,
      },
      {
        field: "actions",
        headerName: "Actions",
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
    [handleEdit, handleDelete]
  );

  return (
    <>
      {loading && <LinearProgress />}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
        <StyledDataGrid
          rowHeight={30}
          rows={episodes}
          columns={columns}
          disableRowSelectionOnClick
          loading={loading}
          hideFooter
        />
      </Box>

      {selectedEpisode && (
        <CustomModal open={editOpen} setOpen={setEditOpen}>
          <EditEpisode
            episode={selectedEpisode}
            onSuccess={() => {
              dispatch(fetchEpisodes());
              setEditOpen(false);
            }}
          />
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

export default EpisodesList;
