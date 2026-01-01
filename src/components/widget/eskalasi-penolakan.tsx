import { AlertCircle, XCircle, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { use, useState } from "react";
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
import type { EscalationStats, EscalationTrend, WidgetProps } from "./types";

// ============================================
// Data Fetching
// ============================================

interface EscalationData {
  stats: EscalationStats;
  trends: EscalationTrend[];
}

const fetchEscalationData = async (): Promise<EscalationData> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_URL}/api/reports/escalation`);
  // return response.json();

  // Simulated delay for demo
  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    stats: {
      totalEscalated: 156,
      totalRejected: 89,
      escalationRate: 12.4,
      rejectionRate: 7.1,
      totalReports: 1258,
    },
    trends: [
      { period: "Jan", escalated: 12, rejected: 8, resolved: 85 },
      { period: "Feb", escalated: 18, rejected: 12, resolved: 92 },
      { period: "Mar", escalated: 15, rejected: 9, resolved: 88 },
      { period: "Apr", escalated: 22, rejected: 14, resolved: 95 },
      { period: "Mei", escalated: 19, rejected: 11, resolved: 102 },
      { period: "Jun", escalated: 25, rejected: 15, resolved: 98 },
      { period: "Jul", escalated: 21, rejected: 10, resolved: 110 },
      { period: "Agu", escalated: 24, rejected: 10, resolved: 115 },
    ],
  };
};

// Cache the promise for Suspense
let escalationPromise: Promise<EscalationData> | null = null;

function getEscalationData(): Promise<EscalationData> {
  if (!escalationPromise) {
    escalationPromise = fetchEscalationData();
  }
  return escalationPromise;
}

// Reset cache (useful for refresh functionality)
export function resetEscalationCache() {
  escalationPromise = null;
}

// ============================================
// Sub-Components
// ============================================

interface KPICardProps {
  title: string;
  value: number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: "red" | "amber" | "emerald" | "sky";
}

function KPICard({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon,
  color,
}: KPICardProps) {
  const colorClasses = {
    red: {
      bg: "bg-red-50",
      icon: "text-red-500",
      badge: "bg-red-100 text-red-700",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700",
    },
    emerald: {
      bg: "bg-emerald-50",
      icon: "text-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
    },
    sky: {
      bg: "bg-sky-50",
      icon: "text-sky-500",
      badge: "bg-sky-100 text-sky-700",
    },
  };

  const classes = colorClasses[color];
  const isPositiveChange = change !== undefined && change > 0;
  const isNegativeChange = change !== undefined && change < 0;

  return (
    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`h-8 w-8 rounded-lg ${classes.bg} flex items-center justify-center ${classes.icon}`}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-slate-800">
          {value.toLocaleString("id-ID")}
        </span>
        {unit && <span className="text-sm text-slate-500 mb-1">{unit}</span>}
      </div>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          {isPositiveChange ? (
            <ArrowUpRight size={14} className="text-red-500" />
          ) : isNegativeChange ? (
            <ArrowDownRight size={14} className="text-emerald-500" />
          ) : null}
          <span
            className={`text-xs font-medium ${
              isPositiveChange
                ? "text-red-600"
                : isNegativeChange
                  ? "text-emerald-600"
                  : "text-slate-500"
            }`}
          >
            {Math.abs(change)}%
          </span>
          {changeLabel && (
            <span className="text-xs text-slate-400">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

interface ChartPeriodSelectorProps {
  activePeriod: "weekly" | "monthly";
  onPeriodChange: (period: "weekly" | "monthly") => void;
}

function ChartPeriodSelector({
  activePeriod,
  onPeriodChange,
}: ChartPeriodSelectorProps) {
  return (
    <div className="flex bg-slate-100 rounded-lg p-1">
      <button
        onClick={() => onPeriodChange("weekly")}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          activePeriod === "weekly"
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Mingguan
      </button>
      <button
        onClick={() => onPeriodChange("monthly")}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          activePeriod === "monthly"
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Bulanan
      </button>
    </div>
  );
}

// ============================================
// Custom Tooltip
// ============================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3">
      <p className="text-sm font-medium text-slate-800 mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-medium text-slate-800">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Main Widget Component
// ============================================

interface EskalasiPenolakanProps extends WidgetProps {
  dataPromise?: Promise<EscalationData>;
}

function EskalasiPenolakanContent({ dataPromise }: EskalasiPenolakanProps) {
  const data = use(dataPromise ?? getEscalationData());
  const [chartPeriod, setChartPeriod] = useState<"weekly" | "monthly">("monthly");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Eskalasi & Penolakan</h3>
            <p className="text-sm text-slate-500">
              Monitoring kegagalan penanganan
            </p>
          </div>
        </div>
        <ChartPeriodSelector
          activePeriod={chartPeriod}
          onPeriodChange={setChartPeriod}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPICard
          title="Total Eskalasi"
          value={data.stats.totalEscalated}
          change={8.2}
          changeLabel="vs bulan lalu"
          icon={<AlertCircle size={18} />}
          color="amber"
        />
        <KPICard
          title="Total Ditolak"
          value={data.stats.totalRejected}
          change={-3.5}
          changeLabel="vs bulan lalu"
          icon={<XCircle size={18} />}
          color="red"
        />
        <KPICard
          title="Rate Eskalasi"
          value={data.stats.escalationRate}
          unit="%"
          change={1.2}
          changeLabel="vs bulan lalu"
          icon={<TrendingUp size={18} />}
          color="sky"
        />
      </div>

      {/* Bar Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.trends}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
            />
            <Bar
              dataKey="resolved"
              name="Selesai"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="escalated"
              name="Eskalasi"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="rejected"
              name="Ditolak"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Data per {new Date().toLocaleDateString("id-ID")}
        </span>
        <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">
          Lihat Detail →
        </button>
      </div>
    </section>
  );
}

export default function EskalasiPenolakan(props: EskalasiPenolakanProps) {
  return <EskalasiPenolakanContent {...props} />;
}
