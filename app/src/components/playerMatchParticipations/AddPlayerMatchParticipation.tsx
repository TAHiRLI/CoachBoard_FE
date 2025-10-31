import * as yup from "yup";

import { Autocomplete, Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { Save } from "@mui/icons-material";
import { createParticipation } from "@/store/slices/playerMatchParticipation.slice";
import { fetchPlayers } from "@/store/slices/players.slice";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

interface Props {
  matchId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddPlayerMatchParticipation: React.FC<Props> = ({ matchId, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { players } = useAppSelector((state) => state.playerData);
  const { loading } = useAppSelector((state) => state.participationData);

  useEffect(() => {
    dispatch(fetchPlayers());
  }, []);
  const schema = yup.object({
    playerId: yup.string().required(t("static.required")),
    matchId: yup.string().required(t("static.required")),
    minutesPlayed: yup.number().min(0).required(t("static.required")),
    score: yup.number().min(0).max(100).required(t("static.required")),
  });

  const formik = useFormik({
    initialValues: {
      playerId: "",
      matchId: matchId,
      minutesPlayed: 0,
      score: 0,
      isSuccessful: false,
      note: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      dispatch(createParticipation(values))
        .unwrap()
        .then(() => onSuccess && onSuccess());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-center">{t("static.addParticipation")}</h2>
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
      <TextField
        type="number"
        label={t("static.minutesPlayed")}
        fullWidth
        {...formik.getFieldProps("minutesPlayed")}
        error={!!formik.touched.minutesPlayed && !!formik.errors.minutesPlayed}
        helperText={formik.touched.minutesPlayed && formik.errors.minutesPlayed}
      />
      <TextField
        type="number"
        label={t("static.score0to100")}
        fullWidth
        {...formik.getFieldProps("score")}
        error={!!formik.touched.score && !!formik.errors.score}
        helperText={formik.touched.score && formik.errors.score}
      />
      <FormControlLabel
        control={<Checkbox {...formik.getFieldProps("isSuccessful")} checked={formik.values.isSuccessful} />}
        label={t("static.successful")}
      />
      <TextField multiline rows={3} label={t("static.note")} fullWidth {...formik.getFieldProps("note")} />
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

export default AddPlayerMatchParticipation;
