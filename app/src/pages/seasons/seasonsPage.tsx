import { Add } from "@mui/icons-material";
import AddSeason from "@/components/seasons/addSeason";
import { Button } from "@mui/material";
import CustomModal from "@/components/customModal/customModal";
import SeasonsList from "@/components/seasons/seasonsList";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const SeasonsPage = () => {
    
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button
          data-testid="btn-ship-create"
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsOpen(true)}
          title="Create"
        >
          {t("static.create")}
        </Button>
      </div>
      <SeasonsList />

      <CustomModal setOpen={setIsOpen} open={isOpen}>
        <AddSeason  onCancel={() => setIsOpen(false)}  onSuccess={() => setIsOpen(false)} />
      </CustomModal>
    </div>
  );
};

export default SeasonsPage;
