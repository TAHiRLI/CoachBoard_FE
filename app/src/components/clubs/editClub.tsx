import * as yup from "yup";

import { Button, TextField } from "@mui/material";
import { Club, ClubPutDto } from "@/lib/types/clubs.types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useMemo, useRef } from "react";

import { Edit } from "@mui/icons-material";
import { updateClub } from "@/store/slices/clubs.slice";
import { useFormik } from "formik";

interface EditClubProps {
  club: Club;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditClub: React.FC<EditClubProps> = ({ club, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.clubData);
  const fileRef = useRef<HTMLInputElement>(null);

  const validationSchema = useMemo(() => yup.object({ name: yup.string().required("Required") }), []);

  const formik = useFormik<ClubPutDto>({
    initialValues: {
      name: club.name,
      logo: undefined,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateClub({ id: club.id, dto: values }))
        .unwrap()
        .then(() => {
          onSuccess?.();
        });
    },
  });

  const { values, touched, errors, handleSubmit, getFieldProps, setFieldValue, isSubmitting } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl my-2 text-center font-bold">Edit Club</h1>
      <div className="flex flex-col gap-3">
        <TextField
          fullWidth
          label="Name"
          {...getFieldProps("name")}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
        />

        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => {
            if (e.currentTarget.files && e.currentTarget.files[0]) {
              setFieldValue("logo", e.currentTarget.files[0]);
            }
          }}
        />

        <Button onClick={() => fileRef.current?.click()} variant="outlined" sx={{ textTransform: "none" }}>
          {values.logo?.name || "Change Logo"}
        </Button>

        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} color="warning" variant="contained">
            Cancel
          </Button>
          <Button type="submit" variant="contained" startIcon={<Edit />} disabled={loading || isSubmitting}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditClub;
