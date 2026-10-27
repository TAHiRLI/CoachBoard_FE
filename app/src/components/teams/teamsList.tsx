import { Box, LinearProgress } from "@mui/material";
import { confirmDelete } from "@/components/feedback/feedback";
import { Delete, Edit } from "@mui/icons-material";
import { deleteTeam, fetchTeams, selectTeam } from "@/store/slices/teams.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useCallback, useEffect, useMemo, useState } from "react";

import CustomModal from "../customModal/customModal";
import EditTeam from "./editTeam";
import { GridColDef } from "@mui/x-data-grid";
import RowActions from "../rowActions/rowActions";
import StyledDataGrid from "../styledDatagrid/styledDatagrid";
import { Team } from "@/lib/types/teams.types";
import { useTranslation } from "react-i18next";

const TeamsList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { teams, selectedTeam, loading } = useAppSelector((s) => s.teamData);
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
      confirmDelete().then((confirmed) => {
        if (confirmed) {
          dispatch(deleteTeam(id));
        }
      });
    },
    [dispatch]
  );

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
        <StyledDataGrid rows={teams} columns={columns} disableRowSelectionOnClick  />
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
    </>
  );
};

export default TeamsList;
