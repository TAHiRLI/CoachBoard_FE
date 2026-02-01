import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";

import ClipItem from "@/components/clips/ClipItem";
import { LinearProgress } from "@mui/material";
import { Match } from "@/lib/types/matches.types";
import { fetchClips } from "@/store/slices/clips.slice";

interface MatchClipsProps {
  match: Match;
}

const MatchClips: FC<MatchClipsProps> = ({ match }) => {
  const dispatch = useAppDispatch();
  const { clips, loading } = useAppSelector((x) => x.clipData);

  useEffect(() => {
    if (!match.id) return;
    dispatch(fetchClips({ matchIds: [match.id] }));
  }, [match]);

  if (loading) return <LinearProgress />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {clips.map((clip) => (
        <ClipItem key={clip.id} clip={clip} />
      ))}
    </div>
  );
};

export default MatchClips;