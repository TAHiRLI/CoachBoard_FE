import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import EditClip, { formatSeconds } from "./EditClip";
import { deleteClip, fetchClips, selectClip } from "@/store/slices/clips.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useCallback, useEffect, useState } from "react";

import { Clip } from "@/lib/types/clips.types";
import CustomModal from "../customModal/customModal";
import { Link } from "react-router-dom";
import RowActions from "../rowActions/rowActions";
import Swal from "sweetalert2";
import { apiUrl } from "@/lib/constants/constants";
import { useTranslation } from "react-i18next";

// Add TypeScript declaration for window.YT
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface ClipItemProps {
  clip: Clip;
}

const ClipItem: React.FC<ClipItemProps> = ({ clip }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { selectedClip } = useAppSelector((x) => x.clipData);

  const getVideoSrc = () => (clip.isExternal ? clip.videoUrl : `${apiUrl}/${clip.videoUrl}`);
  const getDuration = () => {
    const start = parseInt(clip.startTime as any, 10);
    const end = parseInt(clip.endTime as any, 10);
    if (isNaN(start) || isNaN(end)) return "N/A";
    return `${end - start}s`;
  };

  function extractYouTubeVideoId(url: string): string | null {
    const regex = /(?:v=|youtu\.be\/|embed\/)([^&?/]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  const handleEdit = () => {
    dispatch(selectClip(clip));
    setIsOpen(true);
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) return;
      Swal.fire({
        title: t("static.areYouSure"),
        text: t("static.cannotBeUndone"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("static.yesDeleteIt"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch(deleteClip(id))
            .unwrap()
            .then(() => Swal.fire(t("static.success"), "", "success"));
        }
      });
    },
    [dispatch, t]
  );

  // Reload logic start
  const [player, setPlayer] = useState<any>(null);

  const videoId = extractYouTubeVideoId(clip.videoUrl);
  const startTime = clip.startTime ? Number(clip.startTime) : 0;

  useEffect(() => {
    if (!clip.isExternal || !videoId) return;

    const onYouTubeIframeAPIReady = () => {
      new window.YT.Player(`yt-${clip.id}`, {
        events: {
          onReady: (event: any) => {
            setPlayer(event.target); // ✅ Store the player instance
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              // Optional: Auto-restart when it ends
              event.target.seekTo(startTime);
              event.target.playVideo();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }
  }, [clip.id, videoId, startTime, clip.isExternal]);

  // reload logic end
  return (
    <Card elevation={0} sx={{ display: "flex", flexDirection: "column", p: 2, gap: 2, position: "relative" }}>
      <Link to={`/clips/${clip.id}`}>
        <p className="whitespace-nowrap overflow-hidden text-md" color="primary">
          🎬 {t("static.clip")} #{clip.id}: {clip.name}
        </p>
      </Link>
      {clip.isExternal && player && (
        <button
          onClick={() => {
            player.seekTo(startTime);
            player.playVideo();
          }}
          style={{
            marginTop: "8px",
            padding: "6px 12px",
            backgroundColor: "#7A77FF",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Play
        </button>
      )}
      {clip.isExternal ? (
        <iframe
          id={`yt-${clip.id}`}
          style={{ aspectRatio: 1 }}
          width="100%"
          height="300"
          src={`https://www.youtube.com/embed/${extractYouTubeVideoId(clip.videoUrl)}?enablejsapi=1${
            clip.startTime ? `&start=${clip.startTime}` : ""
          }${clip.endTime ? `&end=${clip.endTime}` : ""}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ) : (
        clip.thumbnailUrl && (
          <CardMedia
            component="img"
            className="cursor-pointer"
            image={`${apiUrl}${clip.thumbnailUrl}`}
            alt={clip.name}
            onClick={() => window.open(getVideoSrc(), "_blank")}
            sx={{ width: "100%", height: "300px", objectFit: "contain" }}
          />
        )
      )}

      <CardContent sx={{ paddingBottom: "0.5rem !important" }}>
        <Typography variant="body2" color="text.secondary">
          {formatSeconds(Number(clip.startTime))} - {formatSeconds(Number(clip.endTime))} • {t("static.duration")}:{" "}
          {getDuration()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("static.match")}: {clip.matchName || "N/A"} • {t("static.coach")}: {clip.coachName}
        </Typography>
      </CardContent>

      <div className="absolute top-2 right-2">
        <RowActions
          actions={[
            {
              icon: <Edit fontSize="small" />,
              label: t("static.edit"),
              onClick: handleEdit,
              color: "warning",
            },
            {
              icon: <Delete fontSize="small" />,
              label: t("static.delete"),
              onClick: () => handleDelete(clip.id),
              color: "error",
            },
          ]}
        />
      </div>
      {selectedClip && (
        <CustomModal open={isOpen} setOpen={setIsOpen}>
          <EditClip
            clip={selectedClip}
            onCancel={() => {
              setIsOpen(false);
            }}
            onSuccess={() => {
              dispatch(fetchClips({ matchId: clip.matchId }));
              setIsOpen(false);
            }}
          />
        </CustomModal>
      )}
    </Card>
  );
};

export default ClipItem;
