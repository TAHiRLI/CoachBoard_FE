import { Alert, Box, LinearProgress, Snackbar } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { clearTeamError, deleteTeam, fetchTeams, selectTeam } from "@/store/slices/teams.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useCallback, useEffect, useMemo, useState } from "react";

import CustomModal from "../customModal/customModal";
import EditTeam from "./editTeam";
import { GridColDef } from "@mui/x-data-grid";
import RowActions from "../rowActions/rowActions";
import StyledDataGrid from "../styledDatagrid/styledDatagrid";
import Swal from "sweetalert2";
import { Team } from "@/lib/types/teams.types";

const TeamsList = () => {
  const dispatch = useAppDispatch();
  const { teams, selectedTeam, loading, error } = useAppSelector((s) => s.teamData);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleEdit = (team: Team) => {
    dispatch(selectTeam(team));
    setEditOpen(true);
  };

  const handleDelete = useCallback(
    (id: string) => {
      Swal.fire({
        title: "Are you sure?",
        text: "This cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteTeam(id));
        }
      });
    },
    [dispatch]
  );

  const handleCloseSnackbar = () => {
    if (error) dispatch(clearTeamError());
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "name", headerName: "Name", flex: 1 },
      { field: "league", headerName: "League", flex: 1 },
      { field: "clubName", headerName: "Club", flex: 1 },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        width: 100,
        renderCell: (params) => (
          <RowActions
            actions={[
              { icon: <Edit />, label: "Edit", onClick: () => handleEdit(params.row) },
              { icon: <Delete />, label: "Delete", onClick: () => handleDelete(params.row.id), color: "error" },
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
        <StyledDataGrid rows={teams} columns={columns} disableRowSelectionOnClick hideFooter />
      </Box>

      {selectedTeam && (
        <CustomModal open={editOpen} setOpen={setEditOpen}>
          <EditTeam
            onCancel={() => setEditOpen(false)}
            team={selectedTeam}
            onSuccess={() => {
              dispatch(fetchTeams()).then(() => {
                setEditOpen(false);
              });
            }}
          />
        </CustomModal>
      )}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TeamsList;
