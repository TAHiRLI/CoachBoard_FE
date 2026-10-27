import { Add } from "@mui/icons-material";
import AddCoach from "@/components/coaches/AddCoach";
import { Button } from "@mui/material";
import CoachesList from "@/components/coaches/CoachesList";
import CustomModal from "@/components/customModal/customModal";
import { fetchCoaches } from "@/store/slices/coaches.slice";
import { useAppDispatch } from "@/store/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageActions from "@/components/layout/pageActions";

const CoachesPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <PageActions>
        <Button variant="contained" startIcon={<Add />} onClick={() => setIsOpen(true)} title={t("static.createCoach")}>
          {t("static.createCoach")}
        </Button>
      </PageActions>
      <CoachesList />
      <CustomModal setOpen={setIsOpen} open={isOpen}>
        <AddCoach
          onCancel={() => setIsOpen(false)}
          onSuccess={() => {
            dispatch(fetchCoaches());
            setIsOpen(false);
          }}
        />
      </CustomModal>
    </div>
  );
};

export default CoachesPage;
