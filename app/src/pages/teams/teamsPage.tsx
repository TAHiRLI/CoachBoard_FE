import { Add } from "@mui/icons-material";
import AddTeam from "@/components/teams/addTeam";
import { Button } from "@mui/material";
import CustomModal from "@/components/customModal/customModal";
import TeamsList from "@/components/teams/teamsList";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const TeamsPage = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button variant="contained" startIcon={<Add />} onClick={() => setIsOpen(true)}>
          {t("static.createTeam")}
        </Button>
      </div>

      <TeamsList />

      <CustomModal setOpen={setIsOpen} open={isOpen}>
        <AddTeam onCancel={() => setIsOpen(false)} onSuccess={() => setIsOpen(false)} />
      </CustomModal>
    </div>
  );
};

export default TeamsPage;
