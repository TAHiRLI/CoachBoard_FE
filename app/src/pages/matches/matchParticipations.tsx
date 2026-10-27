import { Button } from "@mui/material";
import { FC, useEffect, useState } from "react";

import { Add } from "@mui/icons-material";
import AddPlayerMatchParticipation from "@/components/playerMatchParticipations/AddPlayerMatchParticipation";
import CustomModal from "@/components/customModal/customModal";
import { Match } from "@/lib/types/matches.types";
import SectionHeader from "@/components/layout/sectionHeader";
import PlayerMatchParticipationsList from "@/components/playerMatchParticipations/playerMatchParticipationList";
import { fetchParticipations } from "@/store/slices/playerMatchParticipation.slice";
import { useAppDispatch } from "@/store/store";
import { useTranslation } from "react-i18next";

type Props = {
  match: Match;
};

const MatchParticipations: FC<Props> = ({ match }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (match) dispatch(fetchParticipations({ matchId: match.id }));
  }, [dispatch, match]);

  return (
    <section>
      <SectionHeader
        title={t("static.matchParticipations")}
        actions={
          <Button variant="outlined" startIcon={<Add />} onClick={() => setIsOpen(true)}>
            {t("static.addParticipation")}
          </Button>
        }
      />
      <PlayerMatchParticipationsList />

      <CustomModal setOpen={setIsOpen} open={isOpen}>
        <AddPlayerMatchParticipation
          matchId={match.id}
          onCancel={() => setIsOpen(false)}
          onSuccess={() => {
            dispatch(fetchParticipations({ matchId: match.id }));
            setIsOpen(false);
          }}
        />
      </CustomModal>
    </section>
  );
};

export default MatchParticipations;
