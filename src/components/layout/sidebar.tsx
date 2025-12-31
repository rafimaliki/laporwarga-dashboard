import { LayoutGrid, FileText, BarChart3, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">
            L
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            LaporWarga
          </span>
        </div>
      </div>

      <nav className="mt-6 px-4 space-y-1">
        <SidebarItem icon={<LayoutGrid size={20} />} label="Dashboard" active />
        <SidebarItem icon={<FileText size={20} />} label="Reports" />
        <SidebarItem icon={<BarChart3 size={20} />} label="Statistics" />
        <SidebarItem icon={<Settings size={20} />} label="Settings" />
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all cursor-pointer ${
        active
          ? "bg-sky-50 text-sky-600 shadow-sm ring-1 ring-sky-500/20"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
