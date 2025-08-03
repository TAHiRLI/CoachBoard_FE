import { Box, LinearProgress, Tooltip, Typography } from "@mui/material";
import { Cancel, CheckCircle, Delete, Edit } from "@mui/icons-material";
import { deleteEvaluation, fetchEvaluations, selectEvaluation } from "@/store/slices/evaluations.slice";
import { green, red } from "@mui/material/colors";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useMemo, useState } from "react";

import CustomModal from "@/components/customModal/customModal";
import EditEvaluation from "./EditEvaluation";
import { GridColDef } from "@mui/x-data-grid";
import RowActions from "@/components/rowActions/rowActions";
import StyledDataGrid from "@/components/styledDatagrid/styledDatagrid";
import Swal from "sweetalert2";

const EvaluationsList = () => {
  const dispatch = useAppDispatch();
  const { evaluations, loading, selectedEvaluation } = useAppSelector((state) => state.evaluationData);
  const { selectedClip } = useAppSelector((state) => state.clipData);

  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEvaluations({ clipId: selectedClip?.id }));
  }, [selectedClip]);

  const handleEdit = (row: any) => {
    dispatch(selectEvaluation(row));
    setEditOpen(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteEvaluation(id));
      }
    });
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "playerName", headerName: "Player", flex: 1 },
      { field: "episodeName", headerName: "Episode", flex: 1 },
      {
        field: "isSuccessful",
        headerName: "Success",
        flex: 1,
        renderCell: (params) =>
          params.value ? <CheckCircle sx={{ color: green[500] }} /> : <Cancel sx={{ color: red[500] }} />,
      },
      {
        field: "isCritical",
        headerName: "Critical",
        flex: 1,
        renderCell: (params) =>
          params.value ? <CheckCircle sx={{ color: green[500] }} /> : <Cancel sx={{ color: red[500] }} />,
      },
      {
        field: "couldBeBetter",
        headerName: "Could Be Better",
        flex: 1,
        renderCell: (params) =>
          params.value ? <CheckCircle sx={{ color: green[500] }} /> : <Cancel sx={{ color: red[500] }} />,
      },
      {
        field: "notes",
        headerName: "Note",
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
      { field: "coachName", headerName: "Coach", flex: 1 },
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
                color: "warning",
                onClick: () => handleEdit(params.row),
              },
              {
                icon: <Delete fontSize="small" />,
                label: "Delete",
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
