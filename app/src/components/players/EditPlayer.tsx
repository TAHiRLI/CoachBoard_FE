import * as yup from "yup";

import { Button, MenuItem, TextField } from "@mui/material";
import { Player, PlayerPutDto } from "@/lib/types/players.types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useMemo } from "react";

import { Edit } from "@mui/icons-material";
import { fetchTeams } from "@/store/slices/teams.slice";
import { playerPositions } from "@/lib/constants/playerPositions";
import { updatePlayer } from "@/store/slices/players.slice";
import { useFormik } from "formik";

interface EditPlayerProps {
  player: Player;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditPlayer: React.FC<EditPlayerProps> = ({ player, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.playerData);
  const { teams } = useAppSelector((s) => s.teamData);

  useEffect(() => {
    dispatch(fetchTeams());
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object({
      fullName: yup.string().required("Required"),
      position: yup.string().required("Required"),
      height: yup.number().required("Required").min(100).max(250),
      birthDate: yup.date().required("Required"),
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
      <h1 className="text-2xl my-2 text-center font-bold">Edit Player</h1>
      <div className="flex flex-col gap-3">
        <TextField
          label="Full Name"
          fullWidth
          {...formik.getFieldProps("fullName")}
          error={formik.touched.fullName && Boolean(formik.errors.fullName)}
          helperText={formik.touched.fullName && formik.errors.fullName}
        />

        <TextField
          label="Height (cm)"
          type="number"
          fullWidth
          {...formik.getFieldProps("height")}
          error={formik.touched.height && Boolean(formik.errors.height)}
          helperText={formik.touched.height && formik.errors.height}
        />

        <TextField
          label="Position"
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
          label="Birth Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formik.values.birthDate.slice(0, 10)}
          onChange={(e) => formik.setFieldValue("birthDate", e.target.value)}
          error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
          helperText={formik.touched.birthDate && formik.errors.birthDate}
        />

        <TextField
          label="Team"
          select
          fullWidth
          value={formik.values.teamId || ""}
          onChange={(e) =>
            formik.setFieldValue("teamId", e.target.value ? parseInt(e.target.value) : undefined)
          }
        >
          <MenuItem value="">None</MenuItem>
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.name}
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
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Edit />}
            disabled={loading}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditPlayer;
