import * as yup from "yup";

import { Button, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { EpisodePostDto } from "@/lib/types/episodes.types";
import { Save } from "@mui/icons-material";
import { createEpisode } from "@/store/slices/episodes.slice";
import { useFormik } from "formik";

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddEpisode = ({ onSuccess, onCancel }: Props) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.episodeData);

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    description: yup.string(),
  });

  const formik = useFormik<EpisodePostDto>({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(createEpisode(values))
        .unwrap()
        .then(() => onSuccess && onSuccess());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-center">Add Episode</h1>
      <TextField
        fullWidth
        label="Name"
        {...formik.getFieldProps("name")}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={3}
        {...formik.getFieldProps("description")}
      />
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

export default AddEpisode;
