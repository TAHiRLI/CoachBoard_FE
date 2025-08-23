import * as yup from "yup";

import { Button, Chip, FormControl, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";

import { Save } from "@mui/icons-material";
import { UserRole } from "@/lib/types/appUser.types";
import { authService } from "@/API/Services/auth.service";
import { createUser } from "@/store/slices/appUsers.slice";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

interface AddUserProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddUser: React.FC<AddUserProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.appUserData);
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);

  const validationSchema = yup.object({
    userName: yup.string().required(t("static.required")),
    email: yup.string().email(t("static.invalidEmail")).required(t("static.required")),
    password: yup.string().min(6, t("static.minPassword")).required(t("static.required")),
  });

  const getRoles = async () => {
    let res = await authService.getRoles();
    setAvailableRoles(res.data as UserRole[]);
  };
  useEffect(() => {
    getRoles();
  }, []);
  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      roles: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const res = await dispatch(createUser({ ...values, roles: [values.roles] }));
      if (res.meta.requestStatus === "fulfilled") {
        onSuccess?.();
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Typography variant="h6" mb={2}>
        {t("static.createUser")}
      </Typography>

      <TextField
        fullWidth
        label={t("static.username")}
        name="userName"
        value={formik.values.userName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.userName && !!formik.errors.userName}
        helperText={formik.touched.userName && formik.errors.userName}
        margin="normal"
      />

      <TextField
        fullWidth
        label={t("static.email")}
        name="email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && !!formik.errors.email}
        helperText={formik.touched.email && formik.errors.email}
        margin="normal"
      />

      <TextField
        fullWidth
        label={t("static.password")}
        name="password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && !!formik.errors.password}
        helperText={formik.touched.password && formik.errors.password}
        margin="normal"
      />

      <FormControl fullWidth>
        <label htmlFor="roles" className="">
          {t("static.role")}
        </label>
        <Select
          id="roles"
          label={t("static.roles")}
          value={formik.values.roles}
          onChange={(e) => formik.setFieldValue("roles", e.target.value)}
          input={<OutlinedInput />}
          renderValue={(selected) => <Chip label={selected} />}
        >
          {availableRoles.map((role) => (
            <MenuItem key={role.name} value={role.name}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.roles && formik.errors.roles && <p className="text-red-600 text-sm">{formik.errors.roles}</p>}
      </FormControl>
      <div className="flex justify-end gap-3 mt-3">
        <Button onClick={onCancel} color="warning" variant="contained">
          {t("static.cancel")}
        </Button>
        <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
          {t("static.save")}
        </Button>
      </div>
    </form>
  );
};

export default AddUser;
