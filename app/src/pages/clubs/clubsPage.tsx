import { Add } from "@mui/icons-material";
import AddClub from "@/components/clubs/addClub";
import { Button } from "@mui/material";
import ClubsList from "@/components/clubs/clubsList";
import CustomModal from "@/components/customModal/customModal";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ClubsPage = () => {
    
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button variant="contained" startIcon={<Add />} onClick={() => setIsOpen(true)} title="Create">
          {t("static.create")}
        </Button>
      </div>

      <ClubsList />
      <CustomModal open={isOpen} setOpen={setIsOpen}>
        <AddClub onSuccess={() => setIsOpen(false)} />
      </CustomModal>
    </div>
  );
};

export default ClubsPage;
