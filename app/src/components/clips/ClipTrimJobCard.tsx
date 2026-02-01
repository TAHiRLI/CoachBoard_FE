// src/components/Clips/ClipTrimJobCard.tsx
import { Button, CircularProgress, Typography } from "@mui/material";
import { createTrimRequest, fetchClips } from "@/store/slices/clips.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { AnyPermissionGuard } from "../auth/PermissionGuard/PermissionGuard";
import { Clip } from "@/lib/types/clips.types";
import { Link } from "react-router-dom";
import { Movie } from "@mui/icons-material";
import { Permission } from "@/lib/types/permissionTypes";
import Swal from "sweetalert2";
import { minioUrl } from "@/lib/constants/constants";
import { useTranslation } from "react-i18next";

interface ClipTrimJobCardProps {
  clip: Clip;
}

export const ClipTrimJobCard: React.FC<ClipTrimJobCardProps> = ({ clip }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((x) => x.clipData);

  const handleCreateTrimRequest = async () => {
    if (!clip.matchId ) return;

    try {
      await dispatch(createTrimRequest(clip.id)).unwrap();
      Swal.fire("🎬 Trim job created!", "", "success");
      if(clip.matchId)
      dispatch(fetchClips({ matchIds: [clip.matchId] }));
    } catch (err: any) {
      Swal.fire("❌ Failed", err || "Error creating trim request", "error");
    }
  };

  // Don't render anything if not external video
  if (!clip.isExternal) return null;

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center gap-2 mt-3">
        <CircularProgress size={20} />
        <Typography variant="body2">{t("static.processing") || "Processing..."}</Typography>
      </div>
    );
  }

  if (clip.trimmedVideoUrl) {
    {
      /* Trimmed Video Button */
    }
    {
      clip.trimmedVideoUrl && (
        <AnyPermissionGuard permissions={[Permission.TRIM_VIDEO]}>
          <Button
            component={Link}
            to={minioUrl + clip.trimmedVideoUrl}
            target="_blank"
            variant="outlined"
            size="small"
            startIcon={<Movie />}
            sx={{
              mb: 1.5,
              textTransform: "none",
              borderRadius: 2,
            }}
            fullWidth
          >
            {t("static.viewTrimmedVideo") || "View Trimmed Video"}
          </Button>
        </AnyPermissionGuard>
      );
    }
  }
  // Show create button if no job and no trimmed video
  if (!clip.videoTrimRequest?.status && clip.matchId && !clip.trimmedVideoUrl) {
    return (
      <AnyPermissionGuard permissions={[Permission.TRIM_VIDEO]}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateTrimRequest}
          sx={{ mt: 2, textTransform: "none" }}
          fullWidth
        >
          🎬 {t("static.createTrimJob") || "Create Trim Job"}
        </Button>
      </AnyPermissionGuard>
    );
  }

  // Show status if job exists
  if (clip.videoTrimRequest?.status) {
    const statusColor =
      clip.videoTrimRequest?.status === "Completed"
        ? "success.main"
        : clip.videoTrimRequest?.status === "Pending" || clip.videoTrimRequest?.status === "Processing"
        ? "warning.main"
        : "error.main";

    return (
      <AnyPermissionGuard permissions={[Permission.TRIM_VIDEO]}>
        <div style={{ marginTop: "12px" }}>
          <Typography variant="body2" sx={{ color: statusColor, mb: 1 }}>
            {t("static.trimJobStatus") || "Trim Job Status"}: <strong>{clip.videoTrimRequest?.status}</strong>
          </Typography>

          {clip.videoTrimRequest?.status === "Failed" && (
            <Button
              variant="outlined"
              color="error"
              sx={{ textTransform: "none" }}
              onClick={handleCreateTrimRequest}
              fullWidth
            >
              🔁 {t("static.retryTrim") || "Retry Trim"}
            </Button>
          )}
        </div>
      </AnyPermissionGuard>
    );
  }

  return null;
};
