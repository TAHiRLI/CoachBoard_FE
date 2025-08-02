import * as yup from "yup";

import { Button, MenuItem, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useMemo, useState } from "react";

import { ClipPostDto } from "@/lib/types/clips.types";
import { Save } from "@mui/icons-material";
import { createClip } from "@/store/slices/clips.slice";
import { useFormik } from "formik";

interface AddClipProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  coachId: string;
  matchId?: string;
  matchUrl?: string;
}
export const parseTimeToSeconds = (value: string): number => {
  const [minStr, secStr] = value.split(":");
  const minutes = parseInt(minStr);
  const seconds = parseInt(secStr);
  return (minutes || 0) * 60 + (seconds || 0);
};
const AddClip: React.FC<AddClipProps> = ({ onSuccess, onCancel, coachId, matchId, matchUrl }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.clipData);
  const [mode, setMode] = useState<"external" | "upload">("external");

  const validationSchema = useMemo(() => {
    return yup.object({
      name: yup.string().required("Required"),
      videoUrl: mode === "external" ? yup.string().url("Invalid URL").required("Required") : yup.string(),
    });
  }, [mode]);

  const formik = useFormik<ClipPostDto>({
    initialValues: {
      name: "",
      matchId: matchId,
      createdByCoachId: coachId,
      startTime: "",
      endTime: "0",
      videoUrl: matchUrl ?? "",
      videoFile: undefined,
      isExternal: mode == "external",
      isExample: false,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        createClip({
          ...values,
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
  console.log(formik.errors);

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2 className="text-xl font-bold text-center mb-4">Create Clip</h2>

      <div className="flex flex-col gap-3">
        <TextField
          label="Name"
          fullWidth
          {...formik.getFieldProps("name")}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          select
          label="Clip Source"
          fullWidth
          value={mode}
          onChange={(e) => setMode(e.target.value as "external" | "upload")}
        >
          <MenuItem value="upload">Upload Video</MenuItem>
          <MenuItem value="external">YouTube / External URL</MenuItem>
        </TextField>
        {mode === "external" && (
          <div className="flex gap-3">
            <TextField
              label="Start Time (s)"
              type="time"
              fullWidth
              {...formik.getFieldProps("startTime")}
              error={formik.touched.startTime && Boolean(formik.errors.startTime)}
              helperText={formik.touched.startTime && formik.errors.startTime}
            />
            <TextField
              label="End Time (s)"
              type="time"
              fullWidth
              {...formik.getFieldProps("endTime")}
              error={formik.touched.endTime && Boolean(formik.errors.endTime)}
              helperText={formik.touched.endTime && formik.errors.endTime}
            />
          </div>
        )}

        {mode === "external" ? (
          <TextField
            label="YouTube / External URL"
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
            Cancel
          </Button>
          <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddClip;
