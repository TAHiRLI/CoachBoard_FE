import * as yup from "yup";

import { Button, MenuItem, TextField } from "@mui/material";
import { Clip, ClipPutDto } from "@/lib/types/clips.types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useMemo, useState } from "react";

import { Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import { parseTimeToSeconds } from "./AddClip";
import { updateClip } from "@/store/slices/clips.slice";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

interface EditClipProps {
  clip: Clip;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const formatSeconds = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const EditClip: React.FC<EditClipProps> = ({ clip, onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.clipData);
  const [mode, setMode] = useState<"external" | "upload">(clip.isExternal ? "external" : "upload");

  // Accepts:
  // - "34" (minutes only)
  // - "12:34" (mm:ss)
  // - "1:12:34" (hh:mm:ss)
  const timeRegex = /^(\d{1,2}:)?[0-5]?\d:[0-5]\d$|^\d+$/;

  const validationSchema = useMemo(() => {
    return yup.object({
      name: yup.string().required("Required"),
      videoUrl:
        mode === "external"
          ? yup
              .string()
              .url(t("static.invalidEmail") || "Invalid URL")
              .required(t("static.required"))
          : yup.string(),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, t]);

  const formik = useFormik<ClipPutDto>({
    initialValues: {
      name: clip.name,
      matchId: clip.matchId,
      startTime: formatSeconds(Number(clip.startTime)),
      endTime: formatSeconds(Number(clip.endTime)),
      videoUrl: clip.videoUrl,
      videoFile: undefined,
      isExternal: clip.isExternal,
      isExample: clip.isExample,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        updateClip({
          id: clip.id,
          dto: {
            ...values,
            isExternal: mode === "external",
            startTime: parseTimeToSeconds(values.startTime?.toString()).toString(),
            endTime: parseTimeToSeconds(values.endTime?.toString()).toString(),
          },
        })
      )
        .unwrap()
        .then(() => {
          Swal.fire(t("static.success"), "", "success");
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2 className="text-xl font-bold text-center mb-4">{t("static.editClip")}</h2>

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

        <div className="flex gap-3">
          <TextField
            label={t("static.startTimeSeconds")}
            placeholder="hh:mm:ss or mm:ss or m"
            fullWidth
            inputProps={{ inputMode: "numeric", pattern: "(^([0-9]{1,2}:)?[0-5]?\\d:[0-5]\\d$)|(^\\d+$)" }}
            {...formik.getFieldProps("startTime")}
            error={formik.touched.startTime && Boolean(formik.errors.startTime)}
            helperText={
              (formik.touched.startTime && (formik.errors.startTime as string)) ||
              "e.g. 01:12:34, 34:00 or 34"
            }
          />
          <TextField
            label={t("static.endTimeSeconds")}
            placeholder="hh:mm:ss or mm:ss or m"
            fullWidth
            inputProps={{ inputMode: "numeric", pattern: "(^([0-9]{1,2}:)?[0-5]?\\d:[0-5]\\d$)|(^\\d+$)" }}
            {...formik.getFieldProps("endTime")}
            error={formik.touched.endTime && Boolean(formik.errors.endTime)}
            helperText={
              (formik.touched.endTime && (formik.errors.endTime as string)) || "e.g. 01:15:00 or 36:15"
            }
          />
        </div>

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
          <Button onClick={onCancel} color="warning" variant="contained">
            {t("static.cancel")}
          </Button>
          <Button type="submit" variant="contained" startIcon={<Edit />} disabled={loading}>
            {t("static.save")}
          </Button>
        </div>
      </div>
  </form>
  );
};

export default EditClip;