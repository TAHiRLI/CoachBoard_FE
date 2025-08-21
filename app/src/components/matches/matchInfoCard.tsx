import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { deleteMatch, fetchMatches, selectMatch } from "@/store/slices/matches.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useCallback, useState } from "react";

import CustomModal from "../customModal/customModal";
import EditMatch from "./EditMatch";
import { Match } from "@/lib/types/matches.types";
import RowActions from "../rowActions/rowActions";
import Swal from "sweetalert2";
import { apiUrl } from "@/lib/constants/constants";
import { useTranslation } from "react-i18next";

type Props = {
  match: Match;
};

const MatchInfoCard: React.FC<Props> = ({ match }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedSeason } = useAppSelector((x) => x.seasonData);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useAppDispatch();

  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = matchDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const handleEdit = () => {
    dispatch(selectMatch(match));
    setIsOpen(true);
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        return;
      }
      Swal.fire({
        title: t("messages:areYouSure"),
        text: t("messages:unableToRevert"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("messages:yesDelete"),
      }).then(async (result) => {
        if (result.isConfirmed && id) {
          dispatch(deleteMatch(id))
            .unwrap()
            .then(() => {
              Swal.fire("Success", "", "success").then(() => {
                navigate(-1);
              });
            });
        }
      });
    },
    [dispatch, t]
  );
  return (
    <Card elevation={0} className="relative rounded-2xl">
      <div className="absolute top-4 right-2">
        <RowActions
          actions={[
            {
              icon: <Edit fontSize="small" />,
              label: "Edit",
              onClick: () => handleEdit(),
              color: "warning",
            },
            {
              icon: <Delete fontSize="small" />,
              label: "Delete",
              onClick: () => handleDelete(match.id),
              color: "error",
            },
          ]}
        />
      </div>
      <CardHeader
        title={
          <Link to={`/matches/${match.id}`}>
            <Typography variant="h6" className="text-xl font-semibold">
              📋 Match Information
            </Typography>
          </Link>
        }
        className="border-b border-gray-200"
      />
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Season</p>
            <p className="text-base font-medium text-gray-800">{match.seasonName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="text-base font-medium text-gray-800">{formattedDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="text-base font-medium text-gray-800">{formattedTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-base font-medium text-gray-800">{match.stadium}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Note</p>
            <p className="text-base font-medium text-gray-800">{match.note}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Link</p>
            <a target="_blank" href={match.gameUrl} className="text-base font-medium text-gray-800">
              {match.gameUrl}
            </a>
          </div>
          <div className="col-span-2 md:col-span-4 mt-4">
            <p className="text-sm text-gray-500">Final Score</p>
            <div className="flex items-center gap-2 mt-1 text-lg font-bold text-gray-800">
              {match.homeTeam.logo && (
                <img
                  src={`${apiUrl}/${match.homeTeam.logo}`}
                  alt={match.homeTeam.teamName}
                  style={{ width: 24, height: 24, objectFit: "contain" }}
                />
              )}
              <span>{match.homeTeam.teamName}</span>
              <span>{match.homeTeam.score}</span>
              <span className="text-gray-500">-</span>
              <span>{match.awayTeam.score}</span>
              <span>{match.awayTeam.teamName}</span>
              {match.awayTeam.logo && (
                <img
                  src={`${apiUrl}/${match.awayTeam.logo}`}
                  alt={match.awayTeam.teamName}
                  style={{ width: 24, height: 24, objectFit: "contain" }}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CustomModal open={isOpen} setOpen={setIsOpen}>
        <EditMatch
          match={match}
          onSuccess={() => {
            dispatch(fetchMatches({ seasonId: selectedSeason?.id }));
            setIsOpen(false);
          }}
        />
      </CustomModal>
    </Card>
  );
};

export default MatchInfoCard;
