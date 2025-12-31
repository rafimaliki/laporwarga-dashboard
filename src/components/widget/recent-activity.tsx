export default function RecentActivity() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 font-semibold text-slate-800">Recent Activity</h3>
      <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="relative pl-8 space-y-2">
            <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-white bg-sky-500 shadow-sm" />
            <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-slate-50 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}
