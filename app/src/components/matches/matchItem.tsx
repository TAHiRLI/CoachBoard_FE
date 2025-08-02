import { Button, Tooltip } from "@mui/material";
import { Delete, Edit, Loop, Movie, Place } from "@mui/icons-material";
import { deleteMatch, fetchMatches, selectMatch } from "@/store/slices/matches.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useCallback, useState } from "react";

import CustomModal from "../customModal/customModal";
import EditMatch from "./EditMatch";
import { Link } from "react-router-dom";
import { Match } from "@/lib/types/matches.types";
import MatchStatusChip from "./matchStatusChip";
import RowActions from "../rowActions/rowActions";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const apiUrl = import.meta.env.VITE_API_URL;
const MatchItem = ({ match }: { match: Match }) => {
  const { selectedSeason } = useAppSelector((x) => x.seasonData);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const date = new Date(match.date);

  const handleEdit = () => {
    dispatch(selectMatch(match));
    setIsOpen(true);
  };

  const handleDelete = useCallback(
    (id: number) => {
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
              Swal.fire("Success", "", "success");
            });
        }
      });
    },
    [dispatch, t]
  );
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 relative">
      <div className="absolute right-4 top-4">
        <MatchStatusChip date={match.date} />
      </div>

      <div className="text-slate-700 text-sm mb-1">
        {date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>

      <div className="text-slate-500 text-xs mb-3">
        {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>

      <div className="font-semibold text-lg text-slate-800 mb-1 flex items-center gap-2">
        <Tooltip title={match.homeTeam.clubName}>
          <div className="flex items-center gap-1">
            {match.homeTeam.logo && (
              <img
                src={apiUrl + "/" + match.homeTeam.logo}
                alt={match.awayTeam.teamName}
                style={{ width: 24, height: 24, objectFit: "contain" }}
              />
            )}
            <span>{match.homeTeam.teamName}</span>
          </div>
        </Tooltip>
        <span>
          ({match.homeTeam.score}
          <span className="text-slate-400">-</span>
          {match.awayTeam.score})
        </span>
        <Tooltip title={match.awayTeam.clubName}>
          <div className="flex items-center gap-1">
            <span>{match.awayTeam.teamName}</span>
            {match.awayTeam.logo && (
              <img
                src={apiUrl + "/" + match.awayTeam.logo}
                alt={match.awayTeam.teamName}
                style={{ width: 24, height: 24, objectFit: "contain" }}
              />
            )}
          </div>
        </Tooltip>
      </div>

      <div className="flex items-center text-sm text-slate-500 mb-3">
        <Place fontSize="small" className="mr-1 text-red-500" />
        {match.stadium}
      </div>

      <div className="flex items-center justify-between text-slate-500 text-sm border-t pt-3 mt-3">
        <div className="flex items-center gap-1">
          <Movie fontSize="small" /> {match.clipCount} clips
        </div>
        <div className="flex items-center gap-1">
          <Loop fontSize="small" /> {match.seasonName}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Link to={`/matches/${match.id}`}>
          <Button variant="contained" color="success" className="rounded-lg px-6">
            View Details
          </Button>
        </Link>

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
      <CustomModal open={isOpen} setOpen={setIsOpen}>
        <EditMatch
          match={match}
          onSuccess={() => {
            dispatch(fetchMatches({ seasonId: selectedSeason?.id }));
            setIsOpen(false);
          }}
        />
      </CustomModal>
    </div>
  );
};

export default MatchItem;
