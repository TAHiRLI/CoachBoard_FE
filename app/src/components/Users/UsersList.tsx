import { Box, LinearProgress } from "@mui/material";
import { confirmDelete } from "@/components/feedback/feedback";
import { Delete, Edit } from "@mui/icons-material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { deleteUser, fetchAppUsers, selectAppUser } from "@/store/slices/appUsers.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { AppUserDto } from "@/lib/types/appUser.types";
import { Coach } from "@/lib/types/coach.types";
import CustomModal from "../customModal/customModal";
import EditUser from "./EditUser";
import { GridColDef } from "@mui/x-data-grid";
import RowActions from "../rowActions/rowActions";
import StyledDataGrid from "../styledDatagrid/styledDatagrid";
import { useTranslation } from "react-i18next";

const UsersList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { appUsers, selectedAppUser, loading } = useAppSelector((s) => s.appUserData);

  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAppUsers());
  }, []);

  const handleEdit = (user: AppUserDto) => {
    dispatch(selectAppUser(user));
    setEditOpen(true);
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) return;
      confirmDelete({ text: t("static.cannotBeUndone") }).then((confirmed) => {
        if (confirmed) {
          dispatch(deleteUser(id));
        }
      });
    },
    [dispatch]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "userName",
        headerName: t("static.username"),
        flex: 1,
      },
      {
        field: "email",
        headerName: t("static.email"),
        flex: 1,
      },
      {
        field: "keycloakId",
        headerName: "Keycloak Id",
        flex: 1,
      },
      {
        field: "coach",
        headerName: t("static.coach"),
        flex: 1,
        valueGetter: (v: Coach) => {
          return v?.fullName;
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
    [handleEdit, handleDelete]
  );

  return (
    <>
      {loading && <LinearProgress />}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
        <StyledDataGrid
          rows={appUsers}
          columns={columns}
          disableRowSelectionOnClick
          loading={loading}
          
        />
      </Box>

      {selectedAppUser && (
        <CustomModal open={editOpen} setOpen={setEditOpen}>
          <EditUser
            user={selectedAppUser}
            onSuccess={() => {
              dispatch(fetchAppUsers());
              setEditOpen(false);
            }}
          />
        </CustomModal>
      )}
    </>
  );
};

export default UsersList;
