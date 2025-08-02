import { Alert, Box, LinearProgress, Snackbar } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { clearPlayerError, deletePlayer, fetchPlayers, selectPlayer } from "@/store/slices/players.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import CustomModal from "../customModal/customModal";
import EditPlayer from "./EditPlayer";
import { GridColDef } from "@mui/x-data-grid";
import { Player } from "@/lib/types/players.types";
import RowActions from "../rowActions/rowActions";
import StyledDataGrid from "../styledDatagrid/styledDatagrid";
import Swal from "sweetalert2";
import { apiUrl } from "@/lib/constants/constants";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const PlayersList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { players, selectedPlayer, loading, error } = useAppSelector((state) => state.playerData);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPlayers());
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    if (error) {
      dispatch(clearPlayerError());
    }
  };

  const handleEdit = (player: Player) => {
    dispatch(selectPlayer(player));
    setEditOpen(true);
  };

  const handleDelete = useCallback(
    (id: string) => {
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
        if (result.isConfirmed) {
          dispatch(deletePlayer(id))
            .unwrap()
            .then(() => Swal.fire("Success", "", "success"));
        }
      });
    },
    [dispatch, t]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "photo",
        headerName: "Photo",
        renderCell: ({ value }) => {
          if (!value) return <></>;
          return (
            <div className="flex items-center h-full">
              <img src={apiUrl + "/" + value} alt="player" style={{aspectRatio: 4/3, objectFit: "cover", height: '100%' }} />
            </div>
          );
        },
      },
      { field: "fullName", headerName: "Name", flex: 1 },
      { field: "position", headerName: "Position", flex: 1 },
      {
        field: "birthDate",
        headerName: "Birth Date",
        valueGetter: (params) => (params ? dayjs(params).format("DD.MM.YYYY") : ""),
      },
      {
        field: "age",
        headerName: "Age",
        flex: 1,
        valueFormatter: (_, row) => {
          const birthDate = dayjs(row.birthDate);
          return birthDate.isValid() ? dayjs().diff(birthDate, "year") : "";
        },
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
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
        <StyledDataGrid
          rowHeight={100}
          rows={players}
          columns={columns}
          disableRowSelectionOnClick
          loading={loading}
          hideFooter
        />
      </Box>
      {selectedPlayer && (
        <CustomModal open={editOpen} setOpen={setEditOpen}>
          <EditPlayer
            player={selectedPlayer}
            onSuccess={() => {
              dispatch(fetchPlayers()).then(() => {
                setEditOpen(false);
              });
            }}
          />
        </CustomModal>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PlayersList;
