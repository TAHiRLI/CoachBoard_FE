import { useEffect, useState } from "react";

import { Add } from "@mui/icons-material";
import AddUser from "@/components/Users/ AddUser";
import { Button } from "@mui/material";
import CustomModal from "@/components/customModal/customModal";
import UsersList from "@/components/Users/UsersList";
import { fetchAppUsers } from "@/store/slices/appUsers.slice";
import { useAppDispatch } from "@/store/store";
import { useTranslation } from "react-i18next";
import PageActions from "@/components/layout/pageActions";

const UsersPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAppUsers());
  }, [dispatch]);

  return (
    <div>
      <PageActions>
        <Button variant="contained" startIcon={<Add />} onClick={() => setIsAddOpen(true)} title="Create">
          {t("static.createUser")}
        </Button>
      </PageActions>

      <UsersList />

      <CustomModal open={isAddOpen} setOpen={setIsAddOpen}>
        <AddUser
          onCancel={() => setIsAddOpen(false)}
          onSuccess={() => {
            dispatch(fetchAppUsers());
            setIsAddOpen(false);
          }}
        />
      </CustomModal>
    </div>
  );
};

export default UsersPage;
