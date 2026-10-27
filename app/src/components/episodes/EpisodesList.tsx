import { Box, LinearProgress } from "@mui/material";
import { confirmDelete } from "@/components/feedback/feedback";
import { Delete, Edit } from "@mui/icons-material";
import { deleteEpisode, fetchEpisodes, selectEpisode } from "@/store/slices/episodes.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useCallback, useEffect, useMemo, useState } from "react";

import CustomModal from "../customModal/customModal";
import EditEpisode from "./EditEpisode";
import { Episode } from "@/lib/types/episodes.types";
import { GridColDef } from "@mui/x-data-grid";
import RowActions from "../rowActions/rowActions";
import StyledDataGrid from "../styledDatagrid/styledDatagrid";
import { useTranslation } from "react-i18next";

const EpisodesList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { episodes, loading, selectedEpisode } = useAppSelector((state) => state.episodeData);

  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEpisodes());
  }, [dispatch]);

  const handleEdit = (episode: Episode) => {
    dispatch(selectEpisode(episode));
    setEditOpen(true);
  };

  const handleDelete = useCallback(
    (id: string) => {
      confirmDelete().then((confirmed) => {
        if (confirmed) {
          dispatch(deleteEpisode(id));
        }
      });
    },
    [dispatch]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "name", headerName: t("static.name"), flex: 1 },
      { field: "description", headerName: t("static.description"), flex: 2 },
      {
        field: "evaluationCount",
        headerName: t("static.evaluationsCount"),
        width: 140,
      },
      {
        field: "actions",
        headerName: t("static.actions"),
        width: 100,
        renderCell: (params) => (
          <RowActions
            actions={[
              {
                icon: <Edit fontSize="small" />,
                label: t("static.edit"),
                onClick: () => handleEdit(params.row),
                color: "warning",
              },
              {
                icon: <Delete fontSize="small" />,
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
        <StyledDataGrid
          rows={episodes}
          columns={columns}
          disableRowSelectionOnClick
          loading={loading}
          
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
    </>
  );
};

export default EpisodesList;
