import * as yup from "yup";

import { Button, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useMemo, useRef } from "react";

import { ClubPostDto } from "@/lib/types/clubs.types";
import { Save } from "@mui/icons-material";
import { createClub } from "@/store/slices/clubs.slice";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

interface AddClubProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddClub: React.FC<AddClubProps> = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { loading } = useAppSelector((s) => s.clubData);
  const fileRef = useRef<HTMLInputElement>(null);

  const validationSchema = useMemo(() => yup.object({ name: yup.string().required(t("static.required")) }), []);

  const formik = useFormik<ClubPostDto>({
    initialValues: {
      name: "",
      logo: undefined,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(createClub(values))
        .unwrap()
        .then(() => {
          formik.resetForm();
          onSuccess?.();
        });
    },
  });

  const { values, touched, errors, handleSubmit, getFieldProps, setFieldValue, isSubmitting } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl my-2 text-center font-bold">{t("static.createClub")}</h1>
      <div className="flex flex-col gap-3">
        <TextField
          fullWidth
          label={t("static.name")}
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
          {values.logo?.name || t("static.uploadLogo")}
        </Button>

        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} color="warning" variant="contained">
            {t("static.cancel")}
          </Button>
          <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading || isSubmitting}>
            {t("static.save")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddClub;
