import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { use } from "react";
import type { RankingData, WidgetProps } from "./types";
import { fetchRankingInstansi } from "@/api/analytics.api";

// ============================================
// Data Fetching
// ============================================

const fetchRankingData = async (): Promise<RankingData[]> => {
  const response = await fetchRankingInstansi();
  return response.data;
};

// Cache the promise for Suspense
let rankingPromise: Promise<RankingData[]> | null = null;

function getRankingData(): Promise<RankingData[]> {
  if (!rankingPromise) {
    rankingPromise = fetchRankingData();
  }
  return rankingPromise;
}

// Reset cache (useful for refresh functionality)
export function resetRankingCache() {
  rankingPromise = null;
}

// ============================================
// Sub-Components
// ============================================

interface ScoreBadgeProps {
  score: number;
}

function ScoreBadge({ score }: ScoreBadgeProps) {
  const getScoreColor = (s: number) => {
    if (s >= 90) return "bg-emerald-100 text-emerald-700";
    if (s >= 75) return "bg-sky-100 text-sky-700";
    if (s >= 60) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getScoreColor(score)}`}
    >
      {score}
    </span>
  );
}

interface RankBadgeProps {
  rank: number;
}

function RankBadge({ rank }: RankBadgeProps) {
  const getRankStyle = (r: number) => {
    if (r === 1)
      return `
      bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600
      text-yellow-950
      shadow-lg shadow-yellow-500/40
      ring-1 ring-yellow-500/50
    `;

    if (r === 2)
      return `
      bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400
      text-slate-900
      shadow-md shadow-slate-400/40
      ring-1 ring-slate-400/50
    `;

    if (r === 3)
      return `
      bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700
      text-amber-950
      shadow-md shadow-amber-600/40
      ring-1 ring-amber-600/50
    `;

    return "bg-slate-100 text-slate-600";
  };

  return (
    <span
      className={`ml-1 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankStyle(rank)}`}
    >
      {rank}
    </span>
  );
}

interface MetricCellProps {
  value: number;
  unit: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

function MetricCell({ value, unit, icon, trend }: MetricCellProps) {
  const trendColor =
    trend === "up"
      ? "text-red-500"
      : trend === "down"
        ? "text-emerald-500"
        : "text-slate-400";

  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-400">{icon}</span>
      <span className="font-medium text-slate-700">{value}</span>
      <span className="text-xs text-slate-400">{unit}</span>
      {trend && trend !== "neutral" && (
        <span className={trendColor}>
          {trend === "up" ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
        </span>
      )}
    </div>
  );
}

// ============================================
// Table Component
// ============================================

interface RankingTableProps {
  data: RankingData[];
}

function RankingTable({ data }: RankingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Instansi
            </th>
            <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              SLA Breach
            </th>
            <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg. Resolution
            </th>
            <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total
            </th>
            <th className="pb-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Score
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => (
            <tr
              key={item.rank}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <td className="py-4">
                <RankBadge rank={item.rank} />
              </td>
              <td className="py-4">
                <span className="font-medium text-slate-800">
                  {item.agencyName}
                </span>
              </td>
              <td className="py-4">
                <MetricCell
                  value={item.slaBreachedCount}
                  unit="kasus"
                  icon={<AlertTriangle size={14} />}
                  trend={item.slaBreachedCount > 10 ? "up" : "down"}
                />
              </td>
              <td className="py-4">
                <MetricCell
                  value={item.avgResolutionTimeHours}
                  unit="jam"
                  icon={<Clock size={14} />}
                  trend={item.avgResolutionTimeHours > 48 ? "up" : "down"}
                />
              </td>
              <td className="py-4">
                <span className="text-slate-600">{item.totalReports}</span>
              </td>
              <td className="py-4 text-right">
                <ScoreBadge score={item.score} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// Main Widget Component
// ============================================

interface RankingInstansiProps extends WidgetProps {
  dataPromise?: Promise<RankingData[]>;
}

function RankingInstansiContent({ dataPromise }: RankingInstansiProps) {
  const data = use(dataPromise ?? getRankingData());

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Ranking Instansi</h3>
            <p className="text-sm text-slate-500">
              Evaluasi performa lintas instansi
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            resetRankingCache();
            // Trigger re-render - in production use a state management solution
          }}
          className="h-9 px-4 rounded-lg bg-slate-100 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      <RankingTable data={data} />

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Terakhir diperbarui: {new Date().toLocaleString("id-ID")}
        </span>
        <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">
          Lihat Detail →
        </button>
      </div>
    </section>
  );
}

export default function RankingInstansi(props: RankingInstansiProps) {
  return <RankingInstansiContent {...props} />;
}
