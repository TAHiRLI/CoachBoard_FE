import * as yup from "yup";

import { Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useMemo } from "react";
import { Season, SeasonPutDto } from "@/lib/types/seasons.types";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Edit } from "@mui/icons-material";
import dayjs from "dayjs";
import { enUS } from "@mui/x-date-pickers/locales";
import { updateSeason } from "@/store/slices/seasons.slice";
import { useFormik } from "formik";

interface EditEditSeasonProps {
  season: Season;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditSeason: React.FC<EditEditSeasonProps> = ({ season, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.seasonData);

  const validationSchema = useMemo(() => {
    return yup.object({
      name: yup.string().required("required"),
    });
  }, []);

  const { touched, errors, isSubmitting, values, handleSubmit, getFieldProps, resetForm, setFieldValue } =
    useFormik<SeasonPutDto>({
      initialValues: {
        name: season.name,
        startDate: season.startDate,
        endDate: season.endDate,
      },
      validationSchema,
      onSubmit: (values) => {
        dispatch(updateSeason({ id: season.id, dto: values }))
          .unwrap()
          .then(() => {
            resetForm();
            onSuccess && onSuccess();
          });
      },
    });

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl my-2 text-center font-bold">Edit Season</h1>
      <div className="flex flex-col gap-3">
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          id="name"
          placeholder="Name"
          {...getFieldProps("name")}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
        />
        <LocalizationProvider
          localeText={enUS.components.MuiLocalizationProvider.defaultProps.localeText}
          dateAdapter={AdapterDayjs}
          adapterLocale="en" // Ensure Day.js uses German locale
        >
          <DatePicker
            format="DD.MM.YYYY"
            className="w-full"
            name="startDate"
            value={values.startDate ? dayjs(values.startDate) : dayjs()}
            onChange={(val) => {
              if (val && val.isValid()) {
                const isoString = val.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                setFieldValue("startDate", isoString);
              }
            }}
            label="Start"
          />
        </LocalizationProvider>

        <LocalizationProvider
          localeText={enUS.components.MuiLocalizationProvider.defaultProps.localeText}
          dateAdapter={AdapterDayjs}
          adapterLocale="en" // Ensure Day.js uses German locale
        >
          <DatePicker
            format="DD.MM.YYYY"
            className="w-full"
            name="endDate"
            value={values.endDate ? dayjs(values.endDate) : dayjs()}
            onChange={(val) => {
              if (val && val.isValid()) {
                const isoString = val.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                setFieldValue("endDate", isoString);
              }
            }}
            label="End"
          />
        </LocalizationProvider>
        <div className="flex justify-end gap-3">
          <Button
            onClick={onCancel}
            color="warning"
            variant="contained"
            sx={{ whiteSpace: "nowrap", borderRadius: "8px" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Edit />}
            color={isSubmitting ? undefined : "primary"}
            disabled={loading}
            sx={{ whiteSpace: "nowrap", borderRadius: "8px" }}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditSeason;
