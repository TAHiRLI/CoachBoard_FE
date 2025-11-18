import { Button, LinearProgress } from "@mui/material";

import ClipItem from "./ClipItem";
import { useAppSelector } from "@/store/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ClipsList = () => {
    
  const { t } = useTranslation();
  const { clips, loading } = useAppSelector((x) => x.clipData);
  const [visibleCount, setVisibleCount] = useState(30);

  if (loading) return <LinearProgress />;

  const visibleClips = clips.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleClips.map((clip) => (
          <ClipItem key={clip.id} clip={clip} />
        ))}
      </div>

      {visibleCount < clips.length && (
        <div className="flex justify-center mt-4">
          <Button variant="contained" onClick={loadMore}>
            {t("static.loadMore")}
          </Button>
        </div>
      )}
    </>
  );
};

export default ClipsList;
