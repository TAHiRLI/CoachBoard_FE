import { Box, LinearProgress, Tooltip, Typography } from "@mui/material";
import { Cancel, CheckCircle, Delete, Edit } from "@mui/icons-material";
import { deleteEvaluation, selectEvaluation } from "@/store/slices/evaluations.slice";
import { green, red } from "@mui/material/colors";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useMemo, useState } from "react";

import CustomModal from "@/components/customModal/customModal";
import EditEvaluation from "./EditEvaluation";
import { GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import RowActions from "@/components/rowActions/rowActions";
import StyledDataGrid from "@/components/styledDatagrid/styledDatagrid";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const EvaluationsList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { evaluations, loading, selectedEvaluation } = useAppSelector((state) => state.evaluationData);

  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = (row: any) => {
    dispatch(selectEvaluation(row));
    setEditOpen(true);
  };

  const handleDelete = (id: string) => {
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
        dispatch(deleteEvaluation(id));
      }
    });
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "playerName", headerName: t("static.player"), flex: 1 },
      { field: "episodeName", headerName: t("static.episode"), flex: 1 },
      { field: "occurrenceCount", headerName: t("static.occurrenceCount"), flex: 1 },
      {
        field: "isSuccessful",
        headerName: t("static.success"),
        flex: 1,
        renderCell: (params) =>
          params.value ? <CheckCircle sx={{ color: green[500] }} /> : <Cancel sx={{ color: red[500] }} />,
      },
      {
        field: "isCritical",
        headerName: t("static.critical"),
        flex: 1,
        renderCell: (params) =>
          params.value ? <CheckCircle sx={{ color: green[500] }} /> : <Cancel sx={{ color: red[500] }} />,
      },
      {
        field: "couldBeBetter",
        headerName: t("static.couldBeBetter"),
        flex: 1,
        renderCell: (params) =>
          params.value ? <CheckCircle sx={{ color: green[500] }} /> : <Cancel sx={{ color: red[500] }} />,
      },
      {
        field: "notes",
        headerName: t("static.note"),
        flex: 1.5,
        renderCell: (params) => (
          <Tooltip title={params.value || ""} arrow>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {params.value}
            </Typography>
          </Tooltip>
        ),
      },
      {
        field: "clip",
        headerName: t("static.clip"),
        flex: 1.5,
        renderCell: (params) => <Link to={`/clips/${params.row.clipId}`}>{t("static.clip")}</Link>,
      },
      { field: "coachName", headerName: t("static.coach"), flex: 1 },
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
                color: "warning",
                onClick: () => handleEdit(params.row),
              },
              {
                icon: <Delete color="error" fontSize="small" />,
                label: t("static.delete"),
                color: "error",
                onClick: () => handleDelete(params.row.id),
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
          rowHeight={30}
          rows={evaluations}
          columns={columns}
          disableRowSelectionOnClick
          loading={loading}
          hideFooter
        />
      </Box>
      {selectedEvaluation && (
        <CustomModal open={editOpen} setOpen={setEditOpen}>
          <EditEvaluation evaluation={selectedEvaluation} onSuccess={() => setEditOpen(false)} />
        </CustomModal>
      )}
    </>
  );
};

export default EvaluationsList;
