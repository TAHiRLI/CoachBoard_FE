import * as yup from "yup";

import { Button, Checkbox, FormControlLabel, MenuItem, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { Save } from "@mui/icons-material";
import { createParticipation } from "@/store/slices/playerMatchParticipation.slice";
import { fetchPlayers } from "@/store/slices/players.slice";
import { useFormik } from "formik";

interface Props {
  matchId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddPlayerMatchParticipation: React.FC<Props> = ({ matchId, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const { players } = useAppSelector((state) => state.playerData);
  const { loading } = useAppSelector((state) => state.participationData);

  useEffect(() => {
    dispatch(fetchPlayers());
  }, []);
  const schema = yup.object({
    playerId: yup.string().required("Required"),
    matchId: yup.string().required("Required"),
    minutesPlayed: yup.number().min(0).required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      playerId: "",
      matchId: matchId,
      minutesPlayed: 0,
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
      <h2 className="text-xl font-bold text-center">Add Participation</h2>
      <TextField
        select
        label="Player"
        fullWidth
        {...formik.getFieldProps("playerId")}
        error={!!formik.touched.playerId && !!formik.errors.playerId}
        helperText={formik.touched.playerId && formik.errors.playerId}
      >
        {players.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.fullName}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        type="number"
        label="Minutes Played"
        fullWidth
        {...formik.getFieldProps("minutesPlayed")}
        error={!!formik.touched.minutesPlayed && !!formik.errors.minutesPlayed}
        helperText={formik.touched.minutesPlayed && formik.errors.minutesPlayed}
      />
      <FormControlLabel
        control={<Checkbox {...formik.getFieldProps("isSuccessful")} checked={formik.values.isSuccessful} />}
        label="Successful"
      />
      <TextField multiline rows={3} label="Note" fullWidth {...formik.getFieldProps("note")} />
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

export default AddPlayerMatchParticipation;
