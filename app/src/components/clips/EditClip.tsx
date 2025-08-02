import * as yup from "yup";

import { Button, MenuItem, TextField } from "@mui/material";
import { Clip, ClipPutDto } from "@/lib/types/clips.types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useMemo, useState } from "react";

import { Edit } from "@mui/icons-material";
import { parseTimeToSeconds } from "./AddClip";
import { updateClip } from "@/store/slices/clips.slice";
import { useFormik } from "formik";

interface EditClipProps {
  clip: Clip;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditClip: React.FC<EditClipProps> = ({ clip, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.clipData);
  const [mode, setMode] = useState<"external" | "upload">(clip.isExternal ? "external" : "upload");

  const validationSchema = useMemo(() => {
    return yup.object({
      name: yup.string().required("Required"),
      videoUrl: mode === "external" ? yup.string().url("Invalid URL").required("Required") : yup.string(),
    });
  }, [mode]);

  const formatSeconds = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "2")}:${s.toString().padStart(2, "2")}`;
  };

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
            startTime: parseTimeToSeconds(values.startTime?.toString()).toString(),
            endTime: parseTimeToSeconds(values.endTime?.toString()).toString(),
          },
        })
      )
        .unwrap()
        .then(() => onSuccess?.());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2 className="text-xl font-bold text-center mb-4">Edit Clip</h2>

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
          <Button type="submit" variant="contained" startIcon={<Edit />} disabled={loading}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditClip;
