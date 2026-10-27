import { Box, LinearProgress } from "@mui/material";
import { confirmDelete } from "@/components/feedback/feedback";
import { Delete, Edit } from "@mui/icons-material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { deletePlayer, fetchPlayers, selectPlayer } from "@/store/slices/players.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import CustomModal from "../customModal/customModal";
import EditPlayer from "./EditPlayer";
import { GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Player } from "@/lib/types/players.types";
import RowActions from "../rowActions/rowActions";
import StyledDataGrid from "../styledDatagrid/styledDatagrid";
import dayjs from "dayjs";
import { minioUrl } from "@/lib/constants/constants";
import { usePlayerPositions } from "@/hooks/usePlayerPositions";
import { useTranslation } from "react-i18next";

const PlayersList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { players, selectedPlayer, loading } = useAppSelector((state) => state.playerData);
  const [editOpen, setEditOpen] = useState(false);
  const playerPositions = usePlayerPositions();

  useEffect(() => {
    dispatch(fetchPlayers());
  }, []);

  const handleEdit = (player: Player) => {
    dispatch(selectPlayer(player));
    setEditOpen(true);
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) return;

      confirmDelete().then(async (confirmed) => {
        if (confirmed) {
          dispatch(deletePlayer(id));
        }
      });
    },
    [dispatch, t]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "photo",
        headerName: t("static.photo"),
        renderCell: ({ value }) => {
          if (!value) return <></>;
          return (
            <div className="flex items-center h-full">
              <img
                src={minioUrl + value}
                alt="player"
                style={{ aspectRatio: 4 / 3, objectFit: "cover", height: "100%" }}
              />
            </div>
          );
        },
      },
      {
        field: "fullName",
        headerName: t("static.fullname"),
        flex: 1,
        minWidth: 240,
        renderCell: ({ row }) => {
          return (
            <Link className="underline" to={`/players/${row.id}`}>
              {row.fullName}
            </Link>
          );
        },
      },
      {
        field: "position",
        headerName: t("static.position"),
        flex: 1,
        valueGetter: (value) => {
          return playerPositions.find((x) => x.value == value)?.label;
        },
      },
      {
        field: "birthDate",
        headerName: t("static.birthDate"),
        valueGetter: (params) => (params ? dayjs(params).format("DD.MM.YYYY") : ""),
        flex: 1,
      },
      {
        field: "height",
        headerName: t("static.heightCm"),
        flex: 1,
      },
      {
        field: "age",
        headerName: t("static.age"),
        flex: 1,
        valueFormatter: (_, row) => {
          const birthDate = dayjs(row.birthDate);
          return birthDate.isValid() ? dayjs().diff(birthDate, "year") : "";
        },
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
    [t]
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
    </>
  );
};

export default PlayersList;
