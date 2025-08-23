import * as yup from "yup";

import { Button, MenuItem, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useMemo } from "react";

import { Edit } from "@mui/icons-material";
import { Team } from "@/lib/types/teams.types";
import { fetchClubs } from "@/store/slices/clubs.slice";
import { updateTeam } from "@/store/slices/teams.slice";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

interface EditTeamProps {
  team: Team;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditTeam: React.FC<EditTeamProps> = ({ team, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { clubs } = useAppSelector((s) => s.clubData);
  const { loading } = useAppSelector((s) => s.teamData);

  useEffect(() => {
    dispatch(fetchClubs());
  }, [dispatch]);

  const validationSchema = useMemo(() => {
    return yup.object({
      name: yup.string().required(t("static.required")),
      league: yup.string().required(t("static.required")),
      clubId: yup.number().required(t("static.required")),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: team.name,
      league: team.league,
      clubId: team.clubId,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateTeam({ id: team.id, dto: values }))
        .unwrap()
        .then(() => {
          onSuccess?.();
          formik.resetForm();
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h1 className="text-2xl my-2 text-center font-bold">{t("static.editTeam")}</h1>
      <div className="flex flex-col gap-3">
        <TextField
          label={t("static.name")}
          fullWidth
          {...formik.getFieldProps("name")}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          label={t("static.league")}
          fullWidth
          {...formik.getFieldProps("league")}
          error={formik.touched.league && Boolean(formik.errors.league)}
          helperText={formik.touched.league && formik.errors.league}
        />
        <TextField
          select
          label={t("static.club")}
          fullWidth
          {...formik.getFieldProps("clubId")}
          error={formik.touched.clubId && Boolean(formik.errors.clubId)}
          helperText={formik.touched.clubId && formik.errors.clubId}
        >
          {clubs.map((club) => (
            <MenuItem key={club.id} value={club.id}>
              {club.name}
            </MenuItem>
          ))}
        </TextField>
        <div className="flex justify-end gap-3">
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

export default EditTeam;
