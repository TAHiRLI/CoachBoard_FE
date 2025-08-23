import * as yup from "yup";

import { Autocomplete, Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { EvaluationPostDto } from "@/lib/types/evaluation.types";
import { Save } from "@mui/icons-material";
import { createEvaluation } from "@/store/slices/evaluations.slice";
import { fetchEpisodes } from "@/store/slices/episodes.slice";
import { fetchPlayers } from "@/store/slices/players.slice";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

interface props {
  clipId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddEvaluation = ({ clipId, onSuccess, onCancel }: props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.evaluationData);
  const { episodes } = useAppSelector((state) => state.episodeData);
  const { players } = useAppSelector((state) => state.playerData);

  useEffect(() => {
    dispatch(fetchPlayers());
    dispatch(fetchEpisodes());
  }, []);
  const schema = yup.object({
    clipId: yup.string().required(),
    playerId: yup.string().required(),
    episodeId: yup.string().required(),
  });

  const formik = useFormik<EvaluationPostDto>({
    initialValues: {
      clipId: clipId,
      playerId: "",
      episodeId: "",
      notes: "",
      occurrenceCount: 1,
      coachId: user?.coachId ?? "",
      isCritical: false,
      isSuccessful: false,
      couldBeBetter: false,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      dispatch(createEvaluation(values))
        .unwrap()
        .then(() => onSuccess && onSuccess());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-center">{t("static.addEvaluation")}</h1>

      <Autocomplete
        options={players}
        getOptionLabel={(option) => {
          return option.fullName + " - " + option.teamName;
        }}
        onChange={(_, value) => formik.setFieldValue("playerId", value?.id || "")}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("static.player")}
            error={formik.touched.playerId && Boolean(formik.errors.playerId)}
            helperText={formik.touched.playerId && formik.errors.playerId}
          />
        )}
      />

      <Autocomplete
        options={episodes}
        getOptionLabel={(option) => option.name}
        onChange={(_, value) => formik.setFieldValue("episodeId", value?.id || "")}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("static.episode")}
            error={formik.touched.episodeId && Boolean(formik.errors.episodeId)}
            helperText={formik.touched.episodeId && formik.errors.episodeId}
          />
        )}
      />
      <TextField
        fullWidth
        label={t("static.occurrenceCount")}
        type="number"
        {...formik.getFieldProps("occurrenceCount")}
      />
      <TextField fullWidth label={t("static.note")} multiline rows={3} {...formik.getFieldProps("notes")} />

      <div className="grid grid-cols-3">
        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.isSuccessful}
              onChange={(e) => formik.setFieldValue("isSuccessful", e.target.checked)}
            />
          }
          label={t("static.success")}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.isCritical}
              onChange={(e) => formik.setFieldValue("isCritical", e.target.checked)}
            />
          }
          label={t("static.critical")}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.couldBeBetter}
              onChange={(e) => formik.setFieldValue("couldBeBetter", e.target.checked)}
            />
          }
          label={t("static.couldBeBetter")}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button onClick={onCancel} variant="outlined" color="warning">
          Cancel
        </Button>
        <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default AddEvaluation;
