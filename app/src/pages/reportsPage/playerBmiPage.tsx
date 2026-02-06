import { FilterAlt, PictureAsPdf } from "@mui/icons-material";
import { FilterFieldConfig, FilterValues } from "@/lib/types/dynamicFilter.types";
import { useEffect, useState } from "react";

import { Box, Button, LinearProgress, Typography } from "@mui/material";
import CustomModal from "@/components/customModal/customModal";
import DynamicFilter from "@/components/dynamicFilter/dynamicFilter";
import { GridColDef } from "@mui/x-data-grid";
import { PlayerBmiRecordDto } from "@/lib/types/playerBmi.types";
import { fetchPlayers } from "@/store/slices/players.slice";
import { playerBmiRecordsService } from "@/API/Services/playerBmiRecords.service";
import StyledDataGrid from "@/components/styledDatagrid/styledDatagrid";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PlayerBmiPage = () => {
  const { t } = useTranslation();
  const { players } = useAppSelector((x) => x.playerData);

  const dispatch = useAppDispatch();
  const [statsOpen, setStatsOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [records, setRecords] = useState<PlayerBmiRecordDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchPlayers());
  }, [dispatch]);

  const filterFields: FilterFieldConfig[] = [
    {
      key: "player",
      label: t("static.player"),
      type: "select",
      options: players.map((p) => ({ id: p.id, label: p.fullName })),
      placeholder: t("static.selectPlayer"),
      required: true,
    },
    {
      key: "dateRange",
      label: t("static.dateRange"),
      type: "dateRange",
    },
  ];

  const handleFilterChange = async (values: FilterValues) => {
    setFilterValues(values);

    if (!values.player?.id) return;

    const params = {
      playerId: values.player.id,
      from: values.dateRange_from || undefined,
      to: values.dateRange_to || undefined,
    };

    setLoading(true);
    try {
      const response = await playerBmiRecordsService.getAll(params);
      const sorted = [...(response.data ?? [])].sort(
        (a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime()
      );
      setRecords(sorted);
      setStatsOpen(false);
    } catch (err) {
      console.error("Failed to fetch player BMI records:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilterValues({});
    setRecords([]);
  };

  const canShowPdf = Boolean(filterValues.player?.id);
  const chartData = useMemo(
    () =>
      [...records]
        .sort((a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime())
        .map((record) => ({
          date: new Date(record.measuredAt).toLocaleDateString(),
          bmi: record.bmi,
          heightCm: record.heightCm,
          weightKg: record.weightKg,
        })),
    [records]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "measuredAt",
        headerName: t("static.measuredAt"),
        flex: 1,
        valueGetter: (_, row) => new Date(row.measuredAt).toLocaleDateString(),
      },
      { field: "weightKg", headerName: t("static.weightKg"), flex: 1 },
      { field: "heightCm", headerName: t("static.heightCm"), flex: 1 },
      {
        field: "bmi",
        headerName: t("static.bmi"),
        flex: 1,
        valueGetter: (_, row) => row.bmi.toFixed(2),
      },
    ],
    [t]
  );

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="mx-auto mb-6 flex gap-3 justify-end">
        <Button onClick={() => setStatsOpen(true)} variant="contained" startIcon={<FilterAlt />}>
          {t("static.openFilters") || "Open Filters"}
        </Button>
        {canShowPdf && (
          <Button variant="contained" startIcon={<PictureAsPdf />} disabled>
            {t("static.generatePdf")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{t("static.bmi")}</h1>
            {loading && <LinearProgress />}
            {!loading && records.length === 0 && (
              <div className="py-6 text-center text-slate-500">{t("static.noData") || "No data"}</div>
            )}
            {!loading && records.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <Typography variant="subtitle1" className="mb-2">
                    {t("static.heightCm")}
                  </Typography>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="heightCm" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <Typography variant="subtitle1" className="mb-2">
                    {t("static.weightKg")}
                  </Typography>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="weightKg" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <Typography variant="subtitle1" className="mb-2">
                    {t("static.bmi")}
                  </Typography>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="bmi" stroke="#f97316" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            {!loading && records.length > 0 && (
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
                <StyledDataGrid
                  rowHeight={52}
                  rows={records}
                  columns={columns}
                  disableRowSelectionOnClick
                  loading={loading}
                  pageSizeOptions={[50]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 50, page: 0 } },
                  }}
                />
              </Box>
            )}
          </div>
        </div>
      </div>

      <CustomModal open={statsOpen} setOpen={setStatsOpen}>
        <div className="p-4 w-full">
          <DynamicFilter
            fields={filterFields}
            initialValues={filterValues}
            onChange={handleFilterChange}
            onReset={handleReset}
            showResetButton={true}
            showFilterCount={true}
          />
        </div>
      </CustomModal>
    </div>
  );
};

export default PlayerBmiPage;
