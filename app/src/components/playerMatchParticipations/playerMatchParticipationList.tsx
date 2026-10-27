import { Box, LinearProgress } from "@mui/material";
import { confirmDelete } from "@/components/feedback/feedback";
import { Cancel, CheckCircle, Delete, Edit } from "@mui/icons-material";
import {
  deleteParticipation,
  selectParticipation
} from "@/store/slices/playerMatchParticipation.slice";
import { green, red } from "@mui/material/colors";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useMemo, useState } from "react";

import CustomModal from "@/components/customModal/customModal";
import EditPlayerMatchParticipation from "./EditPlayerMatchParticipation";
import { GridColDef } from "@mui/x-data-grid";
import { PlayerMatchParticipation } from "@/lib/types/playerMatchParticipation.types";
import RowActions from "@/components/rowActions/rowActions";
import StyledDataGrid from "@/components/styledDatagrid/styledDatagrid";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const PlayerMatchParticipationsList = () => {
    
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { participations, loading, selectedParticipation } = useAppSelector((state) => state.participationData);
  const [editOpen, setEditOpen] = useState(false);



  const handleEdit = (pmp: PlayerMatchParticipation) => {
    dispatch(selectParticipation(pmp));
    setEditOpen(true);
  };

  const handleDelete = (id: string) => {
    confirmDelete().then((confirmed) => {
      if (confirmed) {
        dispatch(deleteParticipation(id));
      }
    });
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "playerName", headerName: t("static.player"), flex: 1 },
      {
        field: "matchDate",
        headerName: t("static.matchDate"),
        flex: 1,
        valueGetter: (params) => (params ? dayjs(params).format("DD.MM.YYYY") : ""),
      },
      { field: "minutesPlayed", headerName: t("static.minutes"), flex: 1 },
      { field: "score", headerName: t("static.score0to100"), flex: 1 , hide: true},
      {
        field: "isSuccessful",
        headerName:t("static.successful"),
        flex: 1,
        type: "boolean",
        hide: true,
        renderCell: (params) =>
          params.value ? <CheckCircle sx={{ color: green[500] }} /> : <Cancel sx={{ color: red[500] }} />,
      },
      { field: "note", headerName: t("static.note"), flex: 1, hide: true },
      {
        field: "actions",
        headerName: t("static.actions"),
        width: 100,
        sortable: false,
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
    []
  );

  return (
    <>
      {loading && <LinearProgress />}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
        <StyledDataGrid
          rows={participations}
          columns={columns}
          initialState={{
            columns: {
              columnVisibilityModel: {
                isSuccessful: false,
                note: false,
                score: false, 
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
    </>
  );
};

export default PlayerMatchParticipationsList;
