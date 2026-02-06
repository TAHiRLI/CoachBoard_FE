import { PlayerBmiRecordDto } from "@/lib/types/playerBmi.types";
import { useTranslation } from "react-i18next";

interface Props {
  records: PlayerBmiRecordDto[];
  loading?: boolean;
}

const PlayerBmiRecordsTable = ({ records, loading }: Props) => {
  const { t } = useTranslation();

  if (loading) {
    return <div className="py-6 text-center text-slate-500">{t("static.loading") || "Loading..."}</div>;
  }

  if (!records.length) {
    return <div className="py-6 text-center text-slate-500">{t("static.noData") || "No data"}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b">
            <th className="py-2 pr-4 font-medium">{t("static.measuredAt")}</th>
            <th className="py-2 pr-4 font-medium">{t("static.weightKg")}</th>
            <th className="py-2 pr-4 font-medium">{t("static.heightCm")}</th>
            <th className="py-2 pr-4 font-medium">{t("static.bmi")}</th>
          </tr>
        </thead>
        <tbody className="text-slate-900">
          {records.map((record) => (
            <tr key={record.id} className="border-b last:border-b-0">
              <td className="py-2 pr-4">
                {new Date(record.measuredAt).toLocaleDateString()}
              </td>
              <td className="py-2 pr-4">{record.weightKg}</td>
              <td className="py-2 pr-4">{record.heightCm}</td>
              <td className="py-2 pr-4">{record.bmi.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerBmiRecordsTable;
