import * as yup from "yup";

import { Button, MenuItem, TextField } from "@mui/material";
import { Coach, CoachPutDto } from "@/lib/types/coach.types";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { Save } from "@mui/icons-material";
import { fetchTeams } from "@/store/slices/teams.slice";
import { updateCoach } from "@/store/slices/coaches.slice";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

interface Props {
  coach: Coach;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditCoach = ({ coach, onSuccess, onCancel }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.coachData);
  const { teams } = useAppSelector((s) => s.teamData);

  useEffect(() => {
    dispatch(fetchTeams());
  }, []);

  const schema = yup.object({
    fullName: yup.string().required(t("static.required")),
    email: yup.string().email(t("static.invalidEmail")).required(t("static.required")),
    teamId: yup.number().required(t("static.required")),
  });

  const formik = useFormik<CoachPutDto>({
    initialValues: {
      fullName: coach.fullName,
      email: coach.email,
      teamId: coach.teamId,
      appUserId: coach.appUserId ?? undefined,
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      dispatch(updateCoach({ id: coach.id, dto: values }))
        .unwrap()
        .then(() => onSuccess?.());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-2xl my-2 text-center font-bold">{t("static.editCoach")}</h1>

      <TextField
        fullWidth
        label={t("static.fullName")}
        {...formik.getFieldProps("fullName")}
        error={formik.touched.fullName && Boolean(formik.errors.fullName)}
        helperText={formik.touched.fullName && formik.errors.fullName}
      />

      <TextField
        fullWidth
        label={t("static.email")}
        {...formik.getFieldProps("email")}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />

      <TextField
        select
        fullWidth
        label={t("static.clubTeam")}
        {...formik.getFieldProps("teamId")}
        error={formik.touched.teamId && Boolean(formik.errors.teamId)}
        helperText={formik.touched.teamId && formik.errors.teamId}
      >
        {teams.map((team) => (
          <MenuItem key={team.id} value={team.id}>
            {team.clubName} - {team.name}
          </MenuItem>
        ))}
      </TextField>
      <div className="flex justify-end gap-2">
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

export default EditCoach;
