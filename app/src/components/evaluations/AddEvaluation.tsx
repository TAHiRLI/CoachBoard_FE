import * as yup from "yup";

import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";

import AddEpisode from "../episodes/AddEpisode";
import AddPlayer from "../players/AddPlayer";
import AutocompleteWithAdd from "../AutocompleteWithAdd/AutocompleteWithAdd";
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
  initialPlayerId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  /**
   * When true, the clip this evaluation belongs to doesn't exist yet (e.g. it's
   * still being trimmed/uploaded in the background). Submitting hands the
   * values to `onDeferredSubmit` instead of saving to the backend right away.
   */
  deferred?: boolean;
  onDeferredSubmit?: (values: EvaluationPostDto) => void;
}

const AddEvaluation = ({ clipId, initialPlayerId = "", onSuccess, onCancel, deferred = false, onDeferredSubmit }: props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.evaluationData);
  const { episodes } = useAppSelector((state) => state.episodeData);
  const { players } = useAppSelector((state) => state.playerData);

  useEffect(() => {
    dispatch(fetchPlayers());
    dispatch(fetchEpisodes());
  }, [dispatch]);
  const schema = yup.object({
    clipId: deferred ? yup.string() : yup.string().required(),
    playerId: yup.string().required(),
    episodeId: yup.string().required(),
  });

  const formik = useFormik<EvaluationPostDto>({
    initialValues: {
      clipId: clipId,
      playerId: initialPlayerId,
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
      if (deferred) {
        onDeferredSubmit?.(values);
        return;
      }
      dispatch(createEvaluation(values))
        .unwrap()
        .then(() => onSuccess && onSuccess());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <h2 className="form-title">{t("static.addEvaluation")}</h2>
      {deferred && (
        <p className="text-sm text-gray-500 text-center">{t("clipEditor.evaluationWillAttachLater")}</p>
      )}
      <AutocompleteWithAdd
        options={players}
        value={players.find((p) => p.id === formik.values.playerId) || null}
        label={t("static.player")}
        getOptionLabel={(option) => `${option.fullName} - ${option.teamName}`}
        onChange={(value) => formik.setFieldValue("playerId", value?.id || "")}
        error={formik.touched.playerId && Boolean(formik.errors.playerId)}
        helperText={formik.touched.playerId ? formik.errors.playerId : undefined}
        addButtonText={t("static.add")}
        renderAddForm={(onSuccess, onCancel) => <AddPlayer onSuccess={onSuccess} onCancel={onCancel} />}
        onItemAdded={() => dispatch(fetchPlayers())}
      />
      
      <AutocompleteWithAdd
        options={episodes}
        value={episodes.find((e) => e.id === formik.values.episodeId) || null}
        label={t("static.episode")}
        getOptionLabel={(option) => option.name}
        onChange={(value) => formik.setFieldValue("episodeId", value?.id || "")}
        error={formik.touched.episodeId && Boolean(formik.errors.episodeId)}
        helperText={formik.touched.episodeId ? formik.errors.episodeId : undefined}
        addButtonText={t("static.addEpisode")}
        renderAddForm={(onSuccess, onCancel) => <AddEpisode onSuccess={onSuccess} onCancel={onCancel} />}
        onItemAdded={() => dispatch(fetchEpisodes())}
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
