import * as yup from "yup";

import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { Edit } from "@mui/icons-material";
import { PlayerMatchParticipation } from "@/lib/types/playerMatchParticipation.types";
import React from "react";
import { updateParticipation } from "@/store/slices/playerMatchParticipation.slice";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

interface Props {
  participation: PlayerMatchParticipation;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditPlayerMatchParticipation: React.FC<Props> = ({ participation, onSuccess, onCancel }) => {
    
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.participationData);

  const schema = yup.object({
    minutesPlayed: yup.number().min(0).required(t("static.required")),
  });

  const formik = useFormik({
    initialValues: {
      minutesPlayed: participation.minutesPlayed,
      isSuccessful: participation.isSuccessful,
      note: participation.note,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      dispatch(updateParticipation({ id: participation.id, dto: values }))
        .unwrap()
        .then(() => onSuccess && onSuccess());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-center">{t("static.editParticipation")}</h2>
      <TextField
        type="number"
        label={t("static.minutesPlayed")}
        fullWidth
        {...formik.getFieldProps("minutesPlayed")}
        error={!!formik.touched.minutesPlayed && !!formik.errors.minutesPlayed}
        helperText={formik.touched.minutesPlayed && formik.errors.minutesPlayed}
      />
      <FormControlLabel
        control={<Checkbox {...formik.getFieldProps("isSuccessful")} checked={formik.values.isSuccessful} />}
        label={t("static.successful")}
      />
      <TextField
        multiline
        rows={3}
        label={t("static.note")}
        fullWidth
        {...formik.getFieldProps("note")}
      />
      <div className="flex justify-end gap-3">
        <Button onClick={onCancel} variant="outlined" color="warning">{t("static.cancel")}</Button>
        <Button type="submit" variant="contained" startIcon={<Edit />} disabled={loading}>{t("static.save")}</Button>
      </div>
    </form>
  );
};

export default EditPlayerMatchParticipation;