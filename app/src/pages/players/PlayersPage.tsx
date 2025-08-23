import { Add } from "@mui/icons-material";
import AddPlayer from "@/components/players/AddPlayer";
import { Button } from "@mui/material";
import CustomModal from "@/components/customModal/customModal";
import PlayersList from "@/components/players/PlayersList";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PlayersPage = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button variant="contained" startIcon={<Add />} onClick={() => setIsOpen(true)} title="Create">
          {t("static.createPlayer")}
        </Button>
      </div>
      <PlayersList />

      <CustomModal setOpen={setIsOpen} open={isOpen}>
        <AddPlayer onCancel={() => setIsOpen(false)} onSuccess={() => setIsOpen(false)} />
      </CustomModal>
    </div>
  );
};

export default PlayersPage;
