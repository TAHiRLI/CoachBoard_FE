import * as yup from "yup";

import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Evaluation, EvaluationPutDto } from "@/lib/types/evaluation.types";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { Edit } from "@mui/icons-material";
import { updateEvaluation } from "@/store/slices/evaluations.slice";
import { useFormik } from "formik";

const EditEvaluation = ({ evaluation, onSuccess, onCancel }: { evaluation: Evaluation; onSuccess?: () => void; onCancel?: () => void }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.evaluationData);

  const schema = yup.object({
    notes: yup.string(),
  });

  const formik = useFormik<EvaluationPutDto>({
    initialValues: {
      isCritical: evaluation.isCritical,
      isSuccessful: evaluation.isSuccessful,
      couldBeBetter: evaluation.couldBeBetter,
      notes: evaluation.notes,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(updateEvaluation({ id: evaluation.id, dto: values }))
        .unwrap()
        .then(() => onSuccess && onSuccess());
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-center">Edit Evaluation</h1>
      <TextField fullWidth label="Notes" multiline rows={3} {...formik.getFieldProps("notes")} />
           <div className="grid grid-cols-3">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.isSuccessful}
                    onChange={(e) => formik.setFieldValue("isSuccessful", e.target.checked)}
                  />
                }
                label="Is Successful"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.isCritical}
                    onChange={(e) => formik.setFieldValue("isCritical", e.target.checked)}
                  />
                }
                label="Is Critical"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.couldBeBetter}
                    onChange={(e) => formik.setFieldValue("couldBeBetter", e.target.checked)}
                  />
                }
                label="Better Option"
              />
            </div>
      <div className="flex justify-end gap-3">
        <Button onClick={onCancel} variant="outlined" color="warning">
          Cancel
        </Button>
        <Button type="submit" variant="contained" startIcon={<Edit />} disabled={loading}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default EditEvaluation;