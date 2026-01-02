import { useState, useEffect } from "react";
import { fetchMTTRByType, type MTTRByTypeResponse } from "@/api/analytics.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Timer } from "lucide-react";

export default function MTTRByType() {
  const [data, setData] = useState<MTTRByTypeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchMTTRByType();
        setData(result);
      } catch (err) {
        console.error("Error fetching MTTR data:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // const interval = setInterval(loadData, 60000);
    // return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Timer className="w-5 h-5 text-purple-600" />
            Rata-rata Waktu Penyelesaian
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
            <Timer className="w-5 h-5 text-purple-600" />
            Rata-rata Waktu Penyelesaian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Failed to load MTTR data</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.data.map((item) => ({
    type: item.reportType,
    hours: item.avgResolutionHours
      ? parseFloat(item.avgResolutionHours.toFixed(1))
      : 0,
    days: item.avgResolutionHours
      ? parseFloat((item.avgResolutionHours / 24).toFixed(1))
      : 0,
    resolved: item.resolvedCount,
    total: item.totalCount,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-slate-900 capitalize mb-2">
            {data.type}
          </p>
          <p className="text-sm text-slate-600">
            Rata-rata: <span className="font-semibold">{data.hours} jam</span>
          </p>
          <p className="text-sm text-slate-600">({data.days} hari)</p>
          <p className="text-xs text-slate-500 mt-1">
            {data.resolved} dari {data.total} terselesaikan
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <Timer size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">
            Rata-rata Waktu Penyelesaian (MTTR)
          </h3>
          <p className="text-sm text-slate-500">
            Mean Time To Resolution berdasarkan jenis laporan
          </p>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="type"
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value) =>
                  value.charAt(0).toUpperCase() + value.slice(1)
                }
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                label={{
                  value: "Jam",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#64748b",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                formatter={() => "Waktu Penyelesaian (jam)"}
              />
              <Bar dataKey="hours" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <Timer className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm">Belum ada data penyelesaian</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
