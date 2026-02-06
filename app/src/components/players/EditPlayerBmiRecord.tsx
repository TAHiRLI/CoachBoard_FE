import * as yup from "yup";

import { Alert, Button, Snackbar, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

import { PlayerBmiRecordDto, UpdatePlayerBmiRecordDto } from "@/lib/types/playerBmi.types";
import { playerBmiRecordsService } from "@/API/Services/playerBmiRecords.service";

interface EditPlayerBmiRecordProps {
  record: PlayerBmiRecordDto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditPlayerBmiRecord: React.FC<EditPlayerBmiRecordProps> = ({ record, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [submitError, setSubmitError] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const validationSchema = useMemo(() => {
    return yup.object({
      weightKg: yup
        .number()
        .typeError(t("static.required"))
        .required(t("static.required"))
        .min(1, t("static.mustBeGreaterThanZero")),
      heightCm: yup
        .number()
        .typeError(t("static.required"))
        .required(t("static.required"))
        .min(1, t("static.mustBeGreaterThanZero")),
      measuredAt: yup.string().optional(),
    });
  }, [t]);

  const formik = useFormik<UpdatePlayerBmiRecordDto>({
    initialValues: {
      weightKg: record.weightKg,
      heightCm: record.heightCm,
      measuredAt: record.measuredAt?.slice(0, 10),
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitError("");
      try {
        await playerBmiRecordsService.update(record.id, {
          ...values,
          measuredAt: values.measuredAt || undefined,
        });
        onSuccess?.();
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Request failed";
        setSubmitError(message);
        setSnackbarOpen(true);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h1 className="text-2xl my-2 text-center font-bold">{t("static.editBmiRecord")}</h1>
      <div className="flex flex-col gap-3">
        <TextField
          label={t("static.weightKg")}
          type="number"
          fullWidth
          {...formik.getFieldProps("weightKg")}
          error={formik.touched.weightKg && Boolean(formik.errors.weightKg)}
          helperText={formik.touched.weightKg && formik.errors.weightKg}
        />

        <TextField
          label={t("static.heightCm")}
          type="number"
          fullWidth
          {...formik.getFieldProps("heightCm")}
          error={formik.touched.heightCm && Boolean(formik.errors.heightCm)}
          helperText={formik.touched.heightCm && formik.errors.heightCm}
        />

        <TextField
          label={t("static.measuredAt")}
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formik.values.measuredAt?.slice(0, 10) || ""}
          onChange={(e) => formik.setFieldValue("measuredAt", e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} color="warning" variant="contained">
            {t("static.cancel")}
          </Button>
          <Button type="submit" variant="contained" startIcon={<Edit />}>
            {t("static.save")}
          </Button>
        </div>
      </div>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" variant="filled">
          {submitError}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default EditPlayerBmiRecord;
