import { Add } from "@mui/icons-material";
import AddPlayer from "@/components/players/AddPlayer";
import { Button } from "@mui/material";
import CustomModal from "@/components/customModal/customModal";
import PlayersList from "@/components/players/PlayersList";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageActions from "@/components/layout/pageActions";

const PlayersPage = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <PageActions>
        <Button variant="contained" startIcon={<Add />} onClick={() => setIsOpen(true)} title="Create">
          {t("static.createPlayer")}
        </Button>
      </PageActions>
      <PlayersList />

      <CustomModal setOpen={setIsOpen} open={isOpen}>
        <AddPlayer onCancel={() => setIsOpen(false)} onSuccess={() => setIsOpen(false)} />
      </CustomModal>
    </div>
  );
};

export default PlayersPage;
