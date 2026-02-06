import { Add, Delete, Edit, PictureAsPdf } from "@mui/icons-material";
import { Box, Button, Card, CardContent, LinearProgress, Typography } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import RowActions, { ActionItem } from "@/components/rowActions/rowActions";
import { useCallback, useEffect, useMemo, useState } from "react";

import AddPlayerBmiRecord from "@/components/players/AddPlayerBmiRecord";
import CustomModal from "@/components/customModal/customModal";
import EditPlayerBmiRecord from "@/components/players/EditPlayerBmiRecord";
import { GridColDef } from "@mui/x-data-grid";
import { PlayerBmiRecordDto } from "@/lib/types/playerBmi.types";
import StyledDataGrid from "@/components/styledDatagrid/styledDatagrid";
import Swal from "sweetalert2";
import { UserRole } from "@/lib/types/permissionTypes";
import { playerBmiRecordsService } from "@/API/Services/playerBmiRecords.service";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslation } from "react-i18next";

interface Props {
  playerId: string;
}

const PlayerBmiRecordsManager: React.FC<Props> = ({ playerId }) => {
  const { t } = useTranslation();
  const { hasRole } = usePermissions();
  const canCreate = hasRole([UserRole.COACH]);
  const canEdit = hasRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.COACH]);
  const canDelete = hasRole([UserRole.COACH]);

  const [records, setRecords] = useState<PlayerBmiRecordDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PlayerBmiRecordDto | null>(null);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await playerBmiRecordsService.getAll({ playerId });
      const sorted = [...(response.data ?? [])].sort(
        (a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime()
      );
      setRecords(sorted);
    } catch (err) {
      console.error("Failed to fetch player BMI records:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleEdit = (record: PlayerBmiRecordDto) => {
    setSelectedRecord(record);
    setEditOpen(true);
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: t("static.areYouSure"),
      text: t("static.cannotBeUndone"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("static.yesDeleteIt"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        await playerBmiRecordsService.delete(id);
        loadRecords();
      }
    });
  };

  const showActions = canEdit || canDelete;

  const rows = useMemo(() => records, [records]);
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
      ...(showActions
        ? [
            {
              field: "actions",
              headerName: t("static.actions"),
              sortable: false,
              width: 100,
              renderCell: (params: any) => {
                const actions :  ActionItem[]  = [];
                if (canEdit) {
                  actions.push({
                    icon: <Edit color="info" fontSize="small" />,
                    label: t("static.edit"),
                    color: "warning",
                    onClick: () => handleEdit(params.row),
                  });
                }
                if (canDelete) {
                  actions.push({
                    icon: <Delete color="error" fontSize="small" />,
                    label: t("static.delete"),
                    color: "error",
                    onClick: () => handleDelete(params.row.id),
                  });
                }
                return <RowActions actions={actions} />;
              },
            },
          ]
        : []),
    ],
    [t, showActions, canEdit, canDelete]
  );

  return (
    <div className="my-4">
      <div className="flex items-center justify-between">
        <Typography variant="h6" gutterBottom>
          {t("static.bmi")}
        </Typography>
        <div className="flex gap-2">
          {canCreate && (
            <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>
              {t("static.addBmiRecord")}
            </Button>
          )}
          <Button className="hidden" variant="contained" startIcon={<PictureAsPdf />} disabled>
            {t("static.generatePdf")}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent>
          {loading && <LinearProgress />}
          {!loading && rows.length === 0 && (
            <div className="py-6 text-center text-slate-500">{t("static.noData") || "No data"}</div>
          )}
          {!loading && rows.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {loading && <LinearProgress />}
          {!loading && rows.length === 0 && (
            <div className="py-6 text-center text-slate-500">{t("static.noData") || "No data"}</div>
          )}
          {!loading && rows.length > 0 && (
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
              <StyledDataGrid
                rowHeight={52}
                rows={rows}
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
        </CardContent>
      </Card>

      <CustomModal open={addOpen} setOpen={setAddOpen}>
        <AddPlayerBmiRecord
          playerId={playerId}
          onSuccess={() => {
            setAddOpen(false);
            loadRecords();
          }}
          onCancel={() => setAddOpen(false)}
        />
      </CustomModal>

      {selectedRecord && (
        <CustomModal open={editOpen} setOpen={setEditOpen}>
          <EditPlayerBmiRecord
            record={selectedRecord}
            onSuccess={() => {
              setEditOpen(false);
              setSelectedRecord(null);
              loadRecords();
            }}
            onCancel={() => {
              setEditOpen(false);
              setSelectedRecord(null);
            }}
          />
        </CustomModal>
      )}
    </div>
  );
};

export default PlayerBmiRecordsManager;
