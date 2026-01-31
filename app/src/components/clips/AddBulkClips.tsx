import * as yup from "yup";

import { Add, Delete, Save } from "@mui/icons-material";
import { Box, Button, IconButton, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { BulkClipItem } from "@/lib/types/clips.types";
import { createBulkClips } from "@/store/slices/clips.slice";
import { parseTimeToSeconds } from "./AddClip"; // reuse your helper
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

interface AddBulkClipsProps {
  matchId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = yup.object({
  clips: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("Required"),
        startTime: yup.string().required("Required"),
        endTime: yup.string().required("Required"),
      }),
    )
    .min(1, "Add at least one clip"),
});

const AddBulkClips: React.FC<AddBulkClipsProps> = ({ matchId, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.clipData);

  const formik = useFormik<{ clips: BulkClipItem[] }>({
    initialValues: {
      clips: [{ name: "", startTime: "", endTime: "" }],
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        createBulkClips({
          matchId,
          clips: values.clips.map((c) => ({
            name: c.name,
            startTime: parseTimeToSeconds(c.startTime),
            endTime: parseTimeToSeconds(c.endTime),
          })),
        }),
      )
        .unwrap()
        .then(() => {
          formik.resetForm();
          onSuccess?.();
        });
    },
  });

  const addRow = () => {
    formik.setFieldValue("clips", [...formik.values.clips, { name: "", startTime: "", endTime: "" }]);
  };

  const removeRow = (index: number) => {
    const next = [...formik.values.clips];
    next.splice(index, 1);
    formik.setFieldValue("clips", next);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        {formik.values.clips.map((clip, index) => (
          <Box key={index} display="grid" gridTemplateColumns="2fr 1.2fr 1.2fr auto" gap={2} alignItems="center">
            <TextField
              label={t("static.name")}
              fullWidth
              value={clip.name}
              onChange={(e) => formik.setFieldValue(`clips.${index}.name`, e.target.value)}
            />

            <TextField
              label={t("static.startTime")}
              placeholder="mm:ss or hh:mm:ss"
              value={clip.startTime}
              onChange={(e) => formik.setFieldValue(`clips.${index}.startTime`, e.target.value)}
            />

            <TextField
              label={t("static.endTime")}
              placeholder="mm:ss or hh:mm:ss"
              value={clip.endTime}
              onChange={(e) => formik.setFieldValue(`clips.${index}.endTime`, e.target.value)}
            />

            <IconButton color="error" disabled={formik.values.clips.length === 1} onClick={() => removeRow(index)}>
              <Delete />
            </IconButton>
          </Box>
        ))}

        <Button startIcon={<Add />} onClick={addRow} variant="outlined" sx={{ alignSelf: "flex-start" }}>
          {t("static.addClip")}
        </Button>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button onClick={onCancel} color="warning" variant="contained">
            {t("static.cancel")}
          </Button>
          <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
            {t("static.saveAll")}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default AddBulkClips;
