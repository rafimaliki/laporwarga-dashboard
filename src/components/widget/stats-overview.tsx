import { Clock } from "lucide-react";

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Reports" />
      <StatCard label="Pending" />
      <StatCard label="Resolved" />
      <StatCard label="Active Users" />
    </div>
  );
}

function StatCard({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500">
          <Clock size={16} />
        </div>
      </div>
      <div className="h-8 w-24 rounded-lg bg-slate-100 animate-shimmer" />
      <div className="mt-4 flex items-center gap-2">
        <div className="h-4 w-12 rounded bg-green-50 animate-pulse" />
        <span className="text-xs text-slate-400">vs last week</span>
      </div>
    </div>
  );
}
