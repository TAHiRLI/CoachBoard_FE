import * as yup from "yup";

import { Button, MenuItem, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useMemo } from "react";

import { Save } from "@mui/icons-material";
import { createTeam } from "@/store/slices/teams.slice";
import { fetchClubs } from "@/store/slices/clubs.slice";
import { useFormik } from "formik";

interface AddTeamProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddTeam: React.FC<AddTeamProps> = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const { clubs } = useAppSelector((s) => s.clubData);
  const { loading } = useAppSelector((s) => s.teamData);

  useEffect(() => {
    dispatch(fetchClubs());
  }, [dispatch]);

  const validationSchema = useMemo(() => {
    return yup.object({
      name: yup.string().required("Required"),
      league: yup.string().required("Required"),
      clubId: yup.number().required("Required"),
    });
  }, []);

  const formik = useFormik({
    initialValues: { name: "", league: "", clubId: "" },
    validationSchema,
    onSubmit: (values) => {
      dispatch(createTeam(values))
        .unwrap()
        .then(() => {
          onSuccess?.();
          formik.resetForm();
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h1 className="text-2xl my-2 text-center font-bold">Create Team</h1>
      <div className="flex flex-col gap-3">
        <TextField
          label="Name"
          fullWidth
          {...formik.getFieldProps("name")}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          label="League"
          fullWidth
          {...formik.getFieldProps("league")}
          error={formik.touched.league && Boolean(formik.errors.league)}
          helperText={formik.touched.league && formik.errors.league}
        />
        <TextField
          select
          label="Club"
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
            Cancel
          </Button>
          <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddTeam;
