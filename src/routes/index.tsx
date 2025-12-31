import { createFileRoute } from "@tanstack/react-router";

import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import StatsOverview from "@/components/widget/stats-overview";
import ReportsActivity from "@/components/widget/reports-activity";
import RecentReports from "@/components/widget/recent-reports";
import RecentActivity from "@/components/widget/recent-activity";
import PageHeader from "@/components/ui/page-header";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <TopBar />

        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
          <PageHeader title="Dashboard" />
          <StatsOverview />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <ReportsActivity />
              <RecentReports />
            </div>

            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}
