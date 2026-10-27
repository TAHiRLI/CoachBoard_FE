import { Box, LinearProgress } from "@mui/material";
import { confirmDelete } from "@/components/feedback/feedback";
import { Delete, Edit } from "@mui/icons-material";
import { deleteCoach, fetchCoaches, selectCoach } from "@/store/slices/coaches.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useMemo, useState } from "react";

import { Coach } from "@/lib/types/coach.types";
import CustomModal from "@/components/customModal/customModal";
import EditCoach from "./EditCoach";
import { GridColDef } from "@mui/x-data-grid";
import RowActions from "@/components/rowActions/rowActions";
import StyledDataGrid from "@/components/styledDatagrid/styledDatagrid";
import { useTranslation } from "react-i18next";

const CoachesList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { coaches, loading, selectedCoach } = useAppSelector((s) => s.coachData);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCoaches());
  }, [dispatch]);

  const handleEdit = (coach: Coach) => {
    dispatch(selectCoach(coach));
    setEditOpen(true);
  };

  const handleDelete = (id: string) => {
    confirmDelete().then((confirmed) => {
      if (confirmed) {
        dispatch(deleteCoach(id));
      }
    });
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "fullName", headerName: t("static.fullName"), flex: 1 },
      { field: "email", headerName: t("static.email"), flex: 1 },
      { field: "teamName", headerName: t("static.clubTeam"), flex: 1 },
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
    []
  );

  return (
    <>
      {loading && <LinearProgress />}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
        <StyledDataGrid
          rows={coaches}
          columns={columns}
          disableRowSelectionOnClick
          loading={loading}
          
        />
      </Box>
      {selectedCoach && (
        <CustomModal open={editOpen} setOpen={setEditOpen}>
          <EditCoach
            coach={selectedCoach}
            onSuccess={() => {
              dispatch(fetchCoaches());
              setEditOpen(false);
            }}
          />
        </CustomModal>
      )}
    </>
  );
};

export default CoachesList;
