import * as yup from "yup";

import { Button, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { EpisodePostDto } from "@/lib/types/episodes.types";
import { Save } from "@mui/icons-material";
import { createEpisode } from "@/store/slices/episodes.slice";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddEpisode = ({ onSuccess, onCancel }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.episodeData);

  const validationSchema = yup.object({
    name: yup.string().required(t("static.required")),
    description: yup.string(),
  });

  const formik = useFormik<EpisodePostDto>({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(createEpisode(values))
        .unwrap()
        .then(() => onSuccess && onSuccess());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-center">{t("static.addEpisode")}</h1>
      <TextField
        fullWidth
        label={t("static.name")}
        {...formik.getFieldProps("name")}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />
      <TextField
        fullWidth
        label={t("static.description")}
        multiline
        rows={3}
        {...formik.getFieldProps("description")}
      />
      <div className="flex justify-end gap-3">
        <Button onClick={onCancel} variant="outlined" color="warning">
          {t("static.cancel")}
        </Button>
        <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
          {t("static.save")}
        </Button>
      </div>
    </form>
  );
};

export default AddEpisode;