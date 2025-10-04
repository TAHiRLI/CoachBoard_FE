import * as yup from "yup";

import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useMemo, useState } from "react";

import { ClipPostDto } from "@/lib/types/clips.types";
import { Save } from "@mui/icons-material";
import { createClip } from "@/store/slices/clips.slice";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

export const parseTimeToSeconds = (value: string): number => {
  if (!value) return 0;
  const cleaned = value.trim().replace(/\s+/g, "").replace(".", ":");
  const negative = cleaned.startsWith("-");
  const stripped = cleaned.replace("-", "");
  const parts = stripped.split(":").map((x) => parseInt(x || "0", 10));
  let total = 0;
  if (parts.length === 1) total = parts[0] * 60;
  else if (parts.length === 2) total = parts[0] * 60 + parts[1];
  else if (parts.length === 3)
    total = parts[0] * 3600 + parts[1] * 60 + parts[2];
  return negative ? -total : total;
};

const extractYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:v=|youtu\.be\/|embed\/)([^&?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const calculateOffset = (liveStart: string, time: string): number => {
  const liveStartSec = parseTimeToSeconds(liveStart);
  const pointSec = parseTimeToSeconds(time);
  return Math.max(0, Math.abs(liveStartSec) - Math.abs(pointSec));
};

interface AddClipProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  matchId?: string;
  matchUrl?: string;
}

const AddClip: React.FC<AddClipProps> = ({
  onSuccess,
  onCancel,
  matchId,
  matchUrl,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.clipData);
  const { user } = useAppSelector((s) => s.auth);

  const [mode, setMode] = useState<"external" | "upload">("external");
  const [isLive, setIsLive] = useState(false);
  const [liveStartTime, setLiveStartTime] = useState<string>("");
  const [iframeSrc, setIframeSrc] = useState<string>("");

  const validationSchema = useMemo(
    () =>
      yup.object({
        name: yup.string().required(t("static.required")),
        videoUrl:
          mode === "external"
            ? yup
                .string()
                .url(t("static.invalidUrl"))
                .required(t("static.required"))
            : yup.string(),
      }),
    [mode, t]
  );

  const formik = useFormik<ClipPostDto>({
    initialValues: {
      name: "",
      matchId: matchId,
      createdByCoachId: user?.coachId ?? "",
      startTime: "",
      endTime: "0",
      videoUrl: matchUrl ?? "",
      videoFile: undefined,
      isExternal: mode === "external",
      isExample: false,
    },
    validationSchema,
    onSubmit: (values) => {
      let startSeconds = parseTimeToSeconds(values.startTime);
      let endSeconds = parseTimeToSeconds(values.endTime);
      if (isLive && liveStartTime) {
        startSeconds = calculateOffset(liveStartTime, values.startTime);
        endSeconds = calculateOffset(liveStartTime, values.endTime);
      }
      dispatch(
        createClip({
          ...values,
          isExternal: mode === "external",
          startTime: startSeconds.toString(),
          endTime: endSeconds.toString(),
        })
      )
        .unwrap()
        .then(() => {
          formik.resetForm();
          onSuccess?.();
        });
    },
  });

  // keep isExternal in sync with source mode
  useEffect(() => {
    formik.setFieldValue("isExternal", mode === "external");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // 🔄 Update iframe whenever ANY form field changes (including videoUrl)
  useEffect(() => {
    // prefer the current form value, fallback to provided matchUrl
    const currentUrl = formik.values.videoUrl || matchUrl || "";
    const currentId = extractYouTubeVideoId(currentUrl);
    if (!currentId) {
      setIframeSrc("");
      return;
    }

    let start = parseTimeToSeconds(formik.values.startTime);
    let end = parseTimeToSeconds(formik.values.endTime);

    if (isLive && liveStartTime) {
      start = calculateOffset(liveStartTime, formik.values.startTime);
      end = calculateOffset(liveStartTime, formik.values.endTime);
    }

    // Clamp to >= 0 and integers
    start = Math.max(0, Math.floor(isNaN(start) ? 0 : start));
    end = Math.max(0, Math.floor(isNaN(end) ? 0 : end));

    // Build URL; omit end if it's not greater than start
    const base = `https://www.youtube.com/embed/${currentId}?enablejsapi=1`;
    const startParam = `&start=${start}`;
    const endParam = end > start ? `&end=${end}` : "";

    const newUrl = `${base}${startParam}${endParam}`;

    // ⚡️Force reload of iframe by changing src (and key via src string)
    setIframeSrc(newUrl);
  }, [formik.values, isLive, liveStartTime, matchUrl]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2 className="text-xl font-bold text-center mb-4">
        {t("static.createClip")}
      </h2>

      <div className="flex flex-col gap-3">
        <TextField
          label={t("static.name")}
          fullWidth
          {...formik.getFieldProps("name")}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <TextField
          select
          label={t("static.clipSource")}
          fullWidth
          value={mode}
          onChange={(e) => setMode(e.target.value as "external" | "upload")}
        >
          <MenuItem value="upload">{t("static.uploadVideo")}</MenuItem>
          <MenuItem value="external">{t("static.youtubeExternalUrl")}</MenuItem>
        </TextField>

        {mode === "external" && (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={isLive}
                  onChange={(e) => setIsLive(e.target.checked)}
                />
              }
              label="Is Live Stream"
            />

            {isLive && (
              <>
                <Typography variant="body2" color="text.secondary">
                  Enter the live start (e.g. “-4:00:00”) and clip times (e.g.
                  “-2:00”) — it will auto-calculate offset.
                </Typography>
                <TextField
                  label="Live Start Time (e.g. -4:00:00)"
                  fullWidth
                  value={liveStartTime}
                  onChange={(e) => setLiveStartTime(e.target.value)}
                  placeholder="-4:00:00"
                />
              </>
            )}

            <TextField
              label={t("static.youtubeExternalUrl")}
              fullWidth
              {...formik.getFieldProps("videoUrl")}
              error={formik.touched.videoUrl && Boolean(formik.errors.videoUrl)}
              helperText={formik.touched.videoUrl && formik.errors.videoUrl}
            />

            <div className="flex gap-3">
              <TextField
                label={
                  isLive ? "Start Time (e.g. -2:00)" : t("static.startTimeSeconds")
                }
                placeholder="hh:mm:ss or mm:ss or m"
                fullWidth
                {...formik.getFieldProps("startTime")}
              />
              <TextField
                label={
                  isLive ? "End Time (e.g. 0:00)" : t("static.endTimeSeconds")
                }
                placeholder="hh:mm:ss or mm:ss or m"
                fullWidth
                {...formik.getFieldProps("endTime")}
              />
            </div>

            {iframeSrc && (
              <Box sx={{ mt: 2 }}>
                <iframe
                  key={iframeSrc}
                  width="100%"
                  height="280"
                  style={{ borderRadius: "8px" }}
                  src={iframeSrc}
                  title="YouTube Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            )}
          </>
        )}

        {mode === "upload" && (
          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              e.currentTarget.files &&
              formik.setFieldValue("videoFile", e.currentTarget.files[0])
            }
          />
        )}

        <div className="flex justify-end gap-3 mt-3">
          <Button
            disabled={formik.isSubmitting}
            onClick={onCancel}
            color="warning"
            variant="contained"
          >
            {t("static.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={loading}
          >
            {t("static.save")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddClip;