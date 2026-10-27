import { Add } from "@mui/icons-material";
import AddClub from "@/components/clubs/addClub";
import { Button } from "@mui/material";
import ClubsList from "@/components/clubs/clubsList";
import CustomModal from "@/components/customModal/customModal";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageActions from "@/components/layout/pageActions";

const ClubsPage = () => {
    
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <PageActions>
        <Button variant="contained" startIcon={<Add />} onClick={() => setIsOpen(true)} title="Create">
          {t("static.create")}
        </Button>
      </PageActions>

      <ClubsList />
      <CustomModal open={isOpen} setOpen={setIsOpen}>
        <AddClub onSuccess={() => setIsOpen(false)} />
      </CustomModal>
    </div>
  );
};

export default ClubsPage;
