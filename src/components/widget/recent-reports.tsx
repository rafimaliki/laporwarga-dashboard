export default function RecentReports() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Recent Reports</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-slate-100 animate-shimmer" />
              <div className="space-y-2">
                <div className="h-4 w-48 rounded bg-slate-200 animate-pulse" />
                <div className="h-3 w-32 rounded bg-slate-100 animate-pulse" />
              </div>
            </div>
            <div className="h-6 w-20 rounded-full bg-slate-100 animate-shimmer" />
          </div>
        ))}
      </div>
    </section>
  );
}
