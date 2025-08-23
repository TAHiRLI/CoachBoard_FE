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
import { useTranslation } from "react-i18next";

const TeamsList = () => {
  const { t } = useTranslation();
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
        title: t("static.areYouSure"),
        text: t("static.cannotBeUndone"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("static.yesDeleteIt"),
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
      { field: "name", headerName: t("static.name"), flex: 1 },
      { field: "league", headerName: t("static.league"), flex: 1 },
      { field: "clubName", headerName: t("static.club"), flex: 1 },
      {
        field: "actions",
        headerName: t("static.actions"),
        sortable: false,
        width: 100,
        renderCell: (params) => (
          <RowActions
            actions={[
              { icon: <Edit color="info" />, label: t("static.edit"), onClick: () => handleEdit(params.row) },
              {
                icon: <Delete color="error" />,
                label: t("static.delete"),
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
