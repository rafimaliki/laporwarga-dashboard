import {
  Clock,
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle,
  Users,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { fetchOverview } from "@/api/analytics.api";
import type { OverviewResponse } from "@/api/analytics.api";
import type { DateRangeType } from "@/lib/utils";

interface OverviewData {
  current: OverviewResponse | null;
  previous: OverviewResponse | null;
}

export default function StatsOverview({
  dateRangeType,
  dateRange,
}: {
  dateRangeType: DateRangeType;
  dateRange: {
    current?: { startDate: string; endDate: string };
    previous?: { startDate: string; endDate: string };
  };
}) {
  const [overviewData, setOverviewData] = useState<OverviewData>({
    current: null,
    previous: null,
  });
  const cacheRef = useRef<Map<string, OverviewResponse>>(new Map());

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const getCacheKey = (range?: {
          startDate: string;
          endDate: string;
        }) => {
          if (!range) return "all";
          return `${range.startDate}-${range.endDate}`;
        };

        const currentKey = getCacheKey(dateRange.current);
        const previousKey = getCacheKey(dateRange.previous);

        const cachedCurrent = cacheRef.current.get(currentKey);
        const cachedPrevious = dateRange.previous
          ? cacheRef.current.get(previousKey)
          : null;

        if (cachedCurrent && (cachedPrevious || !dateRange.previous)) {
          setOverviewData({
            current: cachedCurrent,
            previous: cachedPrevious!,
          });
          return;
        }

        const promises: Promise<OverviewResponse>[] = [];
        const keys: string[] = [];

        if (!cachedCurrent) {
          promises.push(fetchOverview(dateRange.current));
          keys.push(currentKey);
        }

        if (dateRange.previous && !cachedPrevious) {
          promises.push(fetchOverview(dateRange.previous));
          keys.push(previousKey);
        }

        const results = await Promise.all(promises);

        results.forEach((result, index) => {
          cacheRef.current.set(keys[index], result);
        });

        setOverviewData({
          current: cacheRef.current.get(currentKey)!,
          previous: dateRange.previous
            ? cacheRef.current.get(previousKey)!
            : null,
        });
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    };

    loadOverview();
  }, [dateRange]);

  if (
    !overviewData.current ||
    (dateRangeType !== "all" && !overviewData.previous)
  ) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Reports" />
        <StatCard label="Pending" />
        <StatCard label="Resolved" />
        <StatCard label="Active Users" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Laporan"
        value={overviewData.current.totalReports}
        previousValue={overviewData.previous?.totalReports}
        icon={FileText}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-50"
      />
      <StatCard
        label="Menunggu Diproses"
        value={overviewData.current.pendingReports}
        previousValue={overviewData.previous?.pendingReports}
        icon={Clock}
        iconColor="text-orange-600"
        iconBgColor="bg-orange-50"
      />
      <StatCard
        label="Terselesaikan"
        value={overviewData.current.resolvedReports}
        previousValue={overviewData.previous?.resolvedReports}
        icon={CheckCircle}
        iconColor="text-green-600"
        iconBgColor="bg-green-50"
      />
      <StatCard
        label="Pengguna Aktif"
        value={overviewData.current.totalUsers}
        previousValue={overviewData.previous?.totalUsers}
        icon={Users}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-50"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  previousValue,
  icon: Icon = Clock,
  iconColor = "text-sky-500",
  iconBgColor = "bg-sky-50",
}: {
  label: string;
  value?: number;
  previousValue?: number;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  iconColor?: string;
  iconBgColor?: string;
}) {
  const calculateChange = () => {
    if (value === undefined || previousValue === undefined) return null;
    if (previousValue === 0) return value > 0 ? 100 : 0;
    return ((value - previousValue) / previousValue) * 100;
  };

  const change = calculateChange();
  const isPositive = change !== null && change > 0;
  const isNegative = change !== null && change < 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBgColor} ${iconColor}`}
        >
          <Icon size={16} />
        </div>
      </div>
      {value !== undefined ? (
        <div className="text-3xl font-bold text-slate-900">{value}</div>
      ) : (
        <div className="h-8 w-24 animate-shimmer rounded-lg bg-slate-100" />
      )}
      {change !== null && (
        <div className="mt-4 flex items-center gap-2">
          {isPositive ? (
            <TrendingUp size={16} className="text-green-600" />
          ) : isNegative ? (
            <TrendingDown size={16} className="text-red-600" />
          ) : null}
          <span
            className={`text-sm font-medium ${
              isPositive
                ? "text-green-600"
                : isNegative
                  ? "text-red-600"
                  : "text-slate-600"
            }`}
          >
            {isPositive && "+"}
            {change.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-400">vs minggu lalu</span>
        </div>
      )}
    </div>
  );
}
