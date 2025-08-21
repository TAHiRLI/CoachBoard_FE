import { Alert, Box, LinearProgress, Snackbar } from "@mui/material";
import { Cancel, CheckCircle, Delete, Edit } from "@mui/icons-material";
import {
  clearParticipationError,
  deleteParticipation,
  fetchParticipations,
  selectParticipation,
} from "@/store/slices/playerMatchParticipation.slice";
import { green, red } from "@mui/material/colors";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useMemo, useState } from "react";

import CustomModal from "@/components/customModal/customModal";
import EditPlayerMatchParticipation from "./EditPlayerMatchParticipation";
import { GridColDef } from "@mui/x-data-grid";
import { PlayerMatchParticipation } from "@/lib/types/playerMatchParticipation.types";
import RowActions from "@/components/rowActions/rowActions";
import StyledDataGrid from "@/components/styledDatagrid/styledDatagrid";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const PlayerMatchParticipationsList = () => {
  const dispatch = useAppDispatch();
  const { participations, loading, error, selectedParticipation } = useAppSelector((state) => state.participationData);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchParticipations({}));
  }, []);

  const handleEdit = (pmp: PlayerMatchParticipation) => {
    dispatch(selectParticipation(pmp));
    setEditOpen(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteParticipation(id));
      }
    });
  };

  const handleCloseSnackbar = () => {
    if (error) dispatch(clearParticipationError());
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "playerName", headerName: "Player", flex: 1 },
      {
        field: "matchDate",
        headerName: "Match Date",
        flex: 1,
        valueGetter: (params) => (params ? dayjs(params).format("DD.MM.YYYY") : ""),
      },
      { field: "minutesPlayed", headerName: "Minutes", flex: 1 },
      {
        field: "isSuccessful",
        headerName: "Successful",
        flex: 1,
        type: "boolean",
        hide: true,
        renderCell: (params) =>
          params.value ? <CheckCircle sx={{ color: green[500] }} /> : <Cancel sx={{ color: red[500] }} />,
      },
      { field: "note", headerName: "Note", flex: 1, hide: true },
      {
        field: "actions",
        headerName: "Actions",
        width: 100,
        sortable: false,
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
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
        <StyledDataGrid
          rows={participations}
          columns={columns}
          rowHeight={40}
          initialState={{
            columns: {
              columnVisibilityModel: {
                isSuccessful: false,
                note: false,
              },
            },
          }}
          disableRowSelectionOnClick
          loading={loading}
        />
      </Box>

      {selectedParticipation && (
        <CustomModal open={editOpen} setOpen={setEditOpen}>
          <EditPlayerMatchParticipation
            participation={selectedParticipation}
            onSuccess={() => setEditOpen(false)}
            onCancel={() => setEditOpen(false)}
          />
        </CustomModal>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
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

export default PlayerMatchParticipationsList;
