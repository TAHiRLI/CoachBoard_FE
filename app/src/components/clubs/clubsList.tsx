import { Box, LinearProgress } from "@mui/material";
import { confirmDelete } from "@/components/feedback/feedback";
import { Delete, Edit } from "@mui/icons-material";
import { deleteClub, fetchClubs, selectClub } from "@/store/slices/clubs.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Club } from "@/lib/types/clubs.types";
import CustomModal from "@/components/customModal/customModal";
import EditClub from "@/components/clubs/editClub";
import { GridColDef } from "@mui/x-data-grid";
import RowActions from "@/components/rowActions/rowActions";
import StyledDataGrid from "@/components/styledDatagrid/styledDatagrid";
import { minioUrl } from "@/lib/constants/constants";
import { useTranslation } from "react-i18next";

const ClubsList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { clubs, selectedClub, loading } = useAppSelector((state) => state.clubData);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchClubs());
  }, [dispatch]);

  const handleEdit = (club: Club) => {
    dispatch(selectClub(club));
    setEditOpen(true);
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) return;

      confirmDelete().then((confirmed) => {
        if (confirmed && id) {
          dispatch(deleteClub(id));
        }
      });
    },
    [dispatch],
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "name",
        headerName: t("static.name"),
        flex: 1,
      },
      {
        field: "logo",
        headerName: t("static.logo"),
        flex: 1,
        renderCell: (params) =>
          params.value ? (
            <div className="flex items-center h-full">
              {" "}
              <img src={minioUrl + params.value} alt="logo" style={{ height: 42, objectFit: "contain" }} />
            </div>
          ) : (
            "—"
          ),
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
    [handleDelete],
  );

  return (
    <>
      {loading && <LinearProgress />}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
        <StyledDataGrid rowHeight={55} rows={clubs} columns={columns} disableRowSelectionOnClick loading={loading} />
      </Box>

      {selectedClub && (
        <CustomModal open={editOpen} setOpen={setEditOpen}>
          <EditClub club={selectedClub} onSuccess={() => setEditOpen(false)} />
        </CustomModal>
      )}
    </>
  );
};

export default ClubsList;
