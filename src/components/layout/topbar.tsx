import { Search, Bell, User } from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      <div className="relative w-full max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search reports..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/10"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
          <Bell size={20} />
        </button>
        <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          <div className="flex h-full w-full items-center justify-center bg-sky-100 text-sky-600">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
