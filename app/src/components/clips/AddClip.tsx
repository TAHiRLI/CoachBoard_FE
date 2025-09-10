import * as yup from "yup";

import { Button, MenuItem, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useMemo, useState } from "react";

import { ClipPostDto } from "@/lib/types/clips.types";
import { Save } from "@mui/icons-material";
import { createClip } from "@/store/slices/clips.slice";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

interface AddClipProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  matchId?: string;
  matchUrl?: string;
}

export const parseTimeToSeconds = (value: string): number => {
  if (!value) return 0;
  const cleaned = value.trim().replace(/\s+/g, "").replace(".", ":");
  if (!cleaned) return 0;

  const parts = cleaned.split(":");

  // m, mm or ss only => treat as minutes
  if (parts.length === 1) {
    const m = parseInt(parts[0] || "0", 10) || 0;
    return m * 60;
  }

  // mm:ss
  if (parts.length === 2) {
    const m = parseInt(parts[0] || "0", 10) || 0;
    const s = parseInt(parts[1] || "0", 10) || 0;
    return m * 60 + s;
  }

  // hh:mm:ss
  const h = parseInt(parts[0] || "0", 10) || 0;
  const m = parseInt(parts[1] || "0", 10) || 0;
  const s = parseInt(parts[2] || "0", 10) || 0;
  return h * 3600 + m * 60 + s;
};

const AddClip: React.FC<AddClipProps> = ({ onSuccess, onCancel, matchId, matchUrl }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.clipData);
  const { user } = useAppSelector((s) => s.auth);
  const [mode, setMode] = useState<"external" | "upload">("external");

  // Accepts:
  // - "34" (minutes only)
  // - "12:34" (mm:ss)
  // - "1:12:34" (hh:mm:ss)
  const timeRegex = /^(\d{1,2}:)?[0-5]?\d:[0-5]\d$|^\d+$/;
  const timePatternAttr = "(^([0-9]{1,2}:)?[0-5]?\\d:[0-5]\\d$)|(^\\d+$)";

  const validationSchema = useMemo(() => {
    return yup.object({
      name: yup.string().required(t("static.required")),
      videoUrl:
        mode === "external" ? yup.string().url(t("static.invalidUrl")).required(t("static.required")) : yup.string(),
      startTime: yup.string().when([], {
        is: () => mode === "external",
        then: (schema) => schema.matches(timeRegex, t("static.required")).optional(),
        otherwise: (schema) => schema.optional(),
      }),
      endTime: yup.string().when([], {
        is: () => mode === "external",
        then: (schema) => schema.matches(timeRegex, t("static.required")).optional(),
        otherwise: (schema) => schema.optional(),
      }),
    });
  }, [mode, t]);

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
      dispatch(
        createClip({
          ...values,
          isExternal: mode === "external",
          startTime: parseTimeToSeconds(values.startTime?.toString()).toString(),
          endTime: parseTimeToSeconds(values.endTime?.toString()).toString(),
        })
      )
        .unwrap()
        .then(() => {
          formik.resetForm();
          onSuccess?.();
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2 className="text-xl font-bold text-center mb-4">{t("static.createClip")}</h2>

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
          <div className="flex gap-3">
            <TextField
              label={t("static.startTimeSeconds")}
              placeholder="hh:mm:ss or mm:ss or m"
              fullWidth
              inputProps={{ inputMode: "numeric", pattern: timePatternAttr }}
              {...formik.getFieldProps("startTime")}
              error={formik.touched.startTime && Boolean(formik.errors.startTime)}
              helperText={
                (formik.touched.startTime && (formik.errors.startTime as string)) || "e.g. 01:12:34, 34:00 or 34"
              }
            />
            <TextField
              label={t("static.endTimeSeconds")}
              placeholder="hh:mm:ss or mm:ss or m"
              fullWidth
              inputProps={{ inputMode: "numeric", pattern: timePatternAttr }}
              {...formik.getFieldProps("endTime")}
              error={formik.touched.endTime && Boolean(formik.errors.endTime)}
              helperText={(formik.touched.endTime && (formik.errors.endTime as string)) || "e.g. 01:15:00 or 36:15"}
            />
          </div>
        )}

        {mode === "external" ? (
          <TextField
            label={t("static.youtubeExternalUrl")}
            fullWidth
            {...formik.getFieldProps("videoUrl")}
            error={formik.touched.videoUrl && Boolean(formik.errors.videoUrl)}
            helperText={formik.touched.videoUrl && formik.errors.videoUrl}
          />
        ) : (
          <input
            type="file"
            accept="video/*"
            onChange={(e) => e.currentTarget.files && formik.setFieldValue("videoFile", e.currentTarget.files[0])}
          />
        )}

        <div className="flex justify-end gap-3 mt-3">
          <Button disabled={formik.isSubmitting} onClick={onCancel} color="warning" variant="contained">
            {t("static.cancel")}
          </Button>
          <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
            {t("static.save")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddClip;
