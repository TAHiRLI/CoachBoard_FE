import { Add } from "@mui/icons-material";
import AddSeason from "@/components/seasons/addSeason";
import { Button } from "@mui/material";
import CustomModal from "@/components/customModal/customModal";
import SeasonsList from "@/components/seasons/seasonsList";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageActions from "@/components/layout/pageActions";

const SeasonsPage = () => {
    
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <PageActions>
        <Button
          data-testid="btn-ship-create"
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsOpen(true)}
          title="Create"
        >
          {t("static.create")}
        </Button>
      </PageActions>
      <SeasonsList />

      <CustomModal setOpen={setIsOpen} open={isOpen}>
        <AddSeason  onCancel={() => setIsOpen(false)}  onSuccess={() => setIsOpen(false)} />
      </CustomModal>
    </div>
  );
};

export default SeasonsPage;
