import * as yup from "yup";

import { Button, MenuItem, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Match, MatchPutDto } from "@/lib/types/matches.types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useMemo } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Save } from "@mui/icons-material";
import dayjs from "dayjs";
import { enUS } from "@mui/x-date-pickers/locales";
import { fetchSeasons } from "@/store/slices/seasons.slice";
import { fetchTeams } from "@/store/slices/teams.slice";
import { updateMatch } from "@/store/slices/matches.slice";
import { useFormik } from "formik";

interface EditMatchProps {
  match: Match;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditMatch: React.FC<EditMatchProps> = ({ match, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const { teams } = useAppSelector((s) => s.teamData);
  const { seasons } = useAppSelector((s) => s.seasonData);
  const { loading } = useAppSelector((s) => s.matchData);

  useEffect(() => {
    dispatch(fetchTeams());
    dispatch(fetchSeasons());
  }, [dispatch]);

  const validationSchema = useMemo(
    () =>
      yup.object({
        date: yup.string().required("Required"),
        stadium: yup.string().required("Required"),
        note: yup.string(),
        homeTeamId: yup.number().required("Required"),
        awayTeamId: yup
          .number()
          .required("Required")
          .test("not-same", "Teams must be different", function (value) {
            return value !== this.parent.homeTeamId;
          }),
        seasonId: yup.number().required("Required"),
      }),
    []
  );

  const formik = useFormik<MatchPutDto>({
    initialValues: {
      date: match.date,
      stadium: match.stadium,
      note: match.note,
      homeTeamId: match.homeTeam.teamId,
      awayTeamId: match.awayTeam.teamId,
      homeTeamScore: match.homeTeam.score,
      awayTeamScore: match.awayTeam.score,
      gameUrl: match.gameUrl,
      seasonId: match.seasonId,
    },
    enableReinitialize: true, 
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateMatch({ id: match.id, dto: values }))
        .unwrap()
        .then(() => {
          onSuccess?.();
        });
    },
  });

  const { values, touched, errors, handleSubmit, getFieldProps, setFieldValue, isSubmitting } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl my-2 text-center font-bold">Edit Match</h1>
      <div className="flex flex-col gap-3">
        <TextField
          label="Stadium"
          fullWidth
          {...getFieldProps("stadium")}
          error={touched.stadium && Boolean(errors.stadium)}
          helperText={touched.stadium && errors.stadium}
        />

        <TextField
          label="Note"
          fullWidth
          {...getFieldProps("note")}
          error={touched.note && Boolean(errors.note)}
          helperText={touched.note && errors.note}
        />

        <LocalizationProvider
          localeText={enUS.components.MuiLocalizationProvider.defaultProps.localeText}
          dateAdapter={AdapterDayjs}
        >
          <DatePicker
            label="Match Date"
            format="DD.MM.YYYY"
            value={dayjs(values.date)}
            onChange={(val) => {
              if (val && val.isValid()) {
                setFieldValue("date", val.toISOString());
              }
            }}
          />
        </LocalizationProvider>

        <TextField
          select
          label="Home Team"
          fullWidth
          {...getFieldProps("homeTeamId")}
          error={touched.homeTeamId && Boolean(errors.homeTeamId)}
          helperText={touched.homeTeamId && errors.homeTeamId}
        >
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.clubName} - {team.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Away Team"
          fullWidth
          {...getFieldProps("awayTeamId")}
          error={touched.awayTeamId && Boolean(errors.awayTeamId)}
          helperText={touched.awayTeamId && errors.awayTeamId}
        >
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.clubName} - {team.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Season"
          fullWidth
          {...getFieldProps("seasonId")}
          error={touched.seasonId && Boolean(errors.seasonId)}
          helperText={touched.seasonId && errors.seasonId}
        >
          {seasons.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField label="Home Score" type="number" fullWidth {...getFieldProps("homeTeamScore")} />

        <TextField label="Away Score" type="number" fullWidth {...getFieldProps("awayTeamScore")} />

        <TextField label="Game URL" fullWidth {...getFieldProps("gameUrl")} />

        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} color="warning" variant="contained" sx={{ borderRadius: "8px" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={loading || isSubmitting}
            sx={{ borderRadius: "8px" }}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditMatch;
