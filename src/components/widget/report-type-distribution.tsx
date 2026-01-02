import { useState, useEffect } from "react";
import {
  fetchReportTypeDistribution,
  type ReportTypeDistributionResponse,
} from "@/api/analytics.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart } from "lucide-react";

export default function ReportTypeDistribution() {
  const [data, setData] = useState<ReportTypeDistributionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchReportTypeDistribution();
        setData(result);
      } catch (err) {
        console.error("Error fetching report type distribution data:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <PieChart className="w-5 h-5 text-orange-600" />
            Distribusi Jenis Masalah
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-slate-400">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <PieChart className="w-5 h-5 text-orange-600" />
            Distribusi Jenis Masalah
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Failed to load distribution data
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.data.map((item) => ({
    type: item.reportType,
    Terkirim: item.submitted,
    Terverifikasi: item.verified,
    "Sedang Diproses": item.inProgress,
    Dieskalasi: item.escalated,
    Terselesaikan: item.resolved,
    Ditolak: item.rejected,
    total: item.total,
  }));
  const statusColors = {
    Ditolak: "#e24b26",
    Terselesaikan: "#a6b3b3",
    Dieskalasi: "#ffdb69",
    "Sedang Diproses": "#f18226",
    Terverifikasi: "#3b8ad9",
    Terkirim: "#7bc0f7",
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce(
        (sum: number, entry: any) => sum + entry.value,
        0
      );
      return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-slate-900 capitalize mb-2">
            {label}
          </p>
          <p className="text-xs text-slate-500 mb-2">Total: {total} laporan</p>
          <div className="space-y-1">
            {payload.map((entry: any) => (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-xs text-slate-600">{entry.name}</span>
                </div>
                <span className="text-xs font-semibold text-slate-900">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
          <PieChart size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">
            Distribusi Jenis Masalah
          </h3>
          <p className="text-sm text-slate-500">
            Breakdown berdasarkan jenis dan status laporan
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="type"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(value) =>
                    value.charAt(0).toUpperCase() + value.slice(1)
                  }
                />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                  iconType="circle"
                />
                <Bar
                  dataKey="Terkirim"
                  stackId="a"
                  fill={statusColors.Terkirim}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Terverifikasi"
                  stackId="a"
                  fill={statusColors.Terverifikasi}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Sedang Diproses"
                  stackId="a"
                  fill={statusColors["Sedang Diproses"]}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Dieskalasi"
                  stackId="a"
                  fill={statusColors.Dieskalasi}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Terselesaikan"
                  stackId="a"
                  fill={statusColors.Terselesaikan}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Ditolak"
                  stackId="a"
                  fill={statusColors.Ditolak}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
              {chartData.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded"
                >
                  <span className="font-medium capitalize text-slate-700">
                    {item.type}
                  </span>
                  <span className="text-slate-600">{item.total} total</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-80 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <PieChart className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm">Belum ada data distribusi</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
