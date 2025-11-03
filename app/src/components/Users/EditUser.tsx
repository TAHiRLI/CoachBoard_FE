import * as yup from "yup";

import { AppUserDto, UserRole } from "@/lib/types/appUser.types";
import { Button, Chip, FormControl, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";

import { Save } from "@mui/icons-material";
import { authService } from "@/API/Services/auth.service";
import { fetchCoaches } from "@/store/slices/coaches.slice";
import { updateUser } from "@/store/slices/appUsers.slice";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

const validationSchema = yup.object({
  userName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
});

interface EditUserProps {
  user: AppUserDto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditUser: React.FC<EditUserProps> = ({ user, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.appUserData);
  const { coaches } = useAppSelector((s) => s.coachData);

  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);

  const getRoles = async () => {
    let res = await authService.getRoles();
    setAvailableRoles(res.data as UserRole[]);
  };

  useEffect(() => {
    getRoles();
    dispatch(fetchCoaches());
  }, []);

  const formik = useFormik({
    initialValues: {
      userName: user.userName,
      email: user.email,
      keycloakId: user.keycloakId,
      coachId: user.coach?.id ?? null,
      roles: user.roles[0],
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const res = await dispatch(updateUser({ id: user.id, dto: { ...values, roles: [values.roles] } }));
      if (res.meta.requestStatus === "fulfilled") {
        onSuccess?.();
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Typography variant="h6" mb={2}>
        {t("static.editUser")}
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
        className="mt-3 block"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && !!formik.errors.email}
        helperText={formik.touched.email && formik.errors.email}
        margin="normal"
      />
      <TextField
        fullWidth
        label={"Keycloak Id"}
        name="keycloakId"
        value={formik.values.keycloakId}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.keycloakId && !!formik.errors.keycloakId}
        helperText={formik.touched.keycloakId && formik.errors.keycloakId}
        margin="normal"
      />
      <TextField
        label={t("static.coach")}
        select
        fullWidth
        value={formik.values.coachId || ""}
        onChange={(e) => formik.setFieldValue("coachId", e.target.value ? parseInt(e.target.value) : undefined)}
      >
        <MenuItem value="">{t("static.none")}</MenuItem>
        {coaches
          .filter((c) => !c.appUserId || c.id === formik.values.coachId)
          .map((coach) => (
            <MenuItem key={coach.id} value={coach.id}>
              {coach.fullName}
            </MenuItem>
          ))}
      </TextField>

      <div className="flex flex-col gap-2 mt-2">
        <label htmlFor="roles" className="">
          {t("static.role")}
        </label>
        <FormControl fullWidth>
          <Select
            id="roles"
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
          {formik.touched.roles && formik.errors.roles && (
            <p className="text-red-600 text-sm">{formik.errors.roles as string}</p>
          )}
        </FormControl>
      </div>
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

export default EditUser;
