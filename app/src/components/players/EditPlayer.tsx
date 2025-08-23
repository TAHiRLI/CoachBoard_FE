import * as yup from "yup";

import { Button, MenuItem, TextField } from "@mui/material";
import { Player, PlayerPutDto } from "@/lib/types/players.types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useMemo } from "react";

import { Edit } from "@mui/icons-material";
import { fetchTeams } from "@/store/slices/teams.slice";
import { updatePlayer } from "@/store/slices/players.slice";
import { useFormik } from "formik";
import { usePlayerPositions } from "@/hooks/usePlayerPositions";
import { useTranslation } from "react-i18next";

interface EditPlayerProps {
  player: Player;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditPlayer: React.FC<EditPlayerProps> = ({ player, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.playerData);
  const { teams } = useAppSelector((s) => s.teamData);
  const playerPositions = usePlayerPositions();

  useEffect(() => {
    dispatch(fetchTeams());
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object({
      fullName: yup.string().required(t("static.required")),
      position: yup.string().required(t("static.required")),
      height: yup
        .number()
        .required(t("static.required"))
        .min(100, t("static.heightMin"))
        .max(250, t("static.heightMax")),
      birthDate: yup.date().required(t("static.required")),
      teamId: yup.number().optional(),
    });
  }, []);

  const formik = useFormik<PlayerPutDto>({
    initialValues: {
      fullName: player.fullName,
      height: player.height,
      position: player.position,
      birthDate: player.birthDate,
      teamId: player.teamId,
      photo: null,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(updatePlayer({ id: player.id, dto: values }))
        .unwrap()
        .then(() => onSuccess?.());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h1 className="text-2xl my-2 text-center font-bold">{t("static.editPlayer")}</h1>
      <div className="flex flex-col gap-3">
        <TextField
          label={t("static.fullName")}
          fullWidth
          {...formik.getFieldProps("fullName")}
          error={formik.touched.fullName && Boolean(formik.errors.fullName)}
          helperText={formik.touched.fullName && formik.errors.fullName}
        />

        <TextField
          label={t("static.heightCm")}
          type="number"
          fullWidth
          {...formik.getFieldProps("height")}
          error={formik.touched.height && Boolean(formik.errors.height)}
          helperText={formik.touched.height && formik.errors.height}
        />

        <TextField
          label={t("static.position")}
          select
          fullWidth
          {...formik.getFieldProps("position")}
          error={formik.touched.position && Boolean(formik.errors.position)}
          helperText={formik.touched.position && formik.errors.position}
        >
          {playerPositions.map((pos) => (
            <MenuItem key={pos.value} value={pos.value}>
              {pos.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={t("static.birthDate")}
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formik.values.birthDate.slice(0, 10)}
          onChange={(e) => formik.setFieldValue("birthDate", e.target.value)}
          error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
          helperText={formik.touched.birthDate && formik.errors.birthDate}
        />

        <TextField
          label={t("static.team")}
          select
          fullWidth
          value={formik.values.teamId || ""}
          onChange={(e) => formik.setFieldValue("teamId", e.target.value ? parseInt(e.target.value) : undefined)}
        >
          <MenuItem value="">{t("static.none")}</MenuItem>
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.clubName} - {team.name}
            </MenuItem>
          ))}
        </TextField>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.currentTarget.files && e.currentTarget.files[0]) {
              formik.setFieldValue("photo", e.currentTarget.files[0]);
            }
          }}
        />

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

export default EditPlayer;
