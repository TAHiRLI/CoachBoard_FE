import { Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";

import { Add } from "@mui/icons-material";
import AddPlayerMatchParticipation from "@/components/playerMatchParticipations/AddPlayerMatchParticipation";
import CustomModal from "@/components/customModal/customModal";
import { Match } from "@/lib/types/matches.types";
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
    dispatch(fetchParticipations({ matchId: match.id }));
  }, [dispatch, match]);

  return (
    <Card className="p-3">
      <CardHeader
        title={
          <Typography variant="h6" className="text-xl font-semibold">
            {t("static.matchParticipations")}
          </Typography>
        }
        action={
          <Button
            data-testid="btn-ship-create"
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsOpen(true)}
            title="Create"
          >
            {t("static.create")}
          </Button>
        }
        className="border-b border-gray-200"
      />
      <CardContent>
        <PlayerMatchParticipationsList />
      </CardContent>

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
    </Card>
  );
};

export default MatchParticipations;
