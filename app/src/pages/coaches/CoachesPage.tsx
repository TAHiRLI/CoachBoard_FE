import { Add } from "@mui/icons-material";
import AddCoach from "@/components/coaches/AddCoach";
import { Button } from "@mui/material";
import CoachesList from "@/components/coaches/CoachesList";
import CustomModal from "@/components/customModal/customModal";
import { fetchCoaches } from "@/store/slices/coaches.slice";
import { useAppDispatch } from "@/store/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const CoachesPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button variant="contained" startIcon={<Add />} onClick={() => setIsOpen(true)} title={t("static.createCoach")}>
          {t("static.createCoach")}
        </Button>
      </div>
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
