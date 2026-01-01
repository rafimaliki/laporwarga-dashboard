import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import StatsOverview from "@/components/widget/stats-overview";
import ReportsActivity from "@/components/widget/reports-activity";
import RecentReports from "@/components/widget/recent-reports";
import RecentActivity from "@/components/widget/recent-activity";
import SLACompliance from "@/components/widget/sla-compliance";
import MTTRByType from "@/components/widget/mean-time-to-resolution";
import ReportTypeDistribution from "@/components/widget/report-type-distribution";
import PageHeader from "@/components/ui/page-header";
import {
  TableSkeleton,
  MapSkeleton,
  ChartSkeleton,
} from "@/components/widget/widget-suspense";

const RankingInstansi = lazy(() => import("@/components/widget/ranking-instansi"));
const HeatmapMasalahKota = lazy(() => import("@/components/widget/heatmap-masalah-kota"));
const EskalasiPenolakan = lazy(() => import("@/components/widget/eskalasi-penolakan"));

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

          <Suspense fallback={<TableSkeleton rows={5} />}>
            <RankingInstansi />
          </Suspense>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Suspense fallback={<MapSkeleton />}>
                <HeatmapMasalahKota />
              </Suspense>
            </div>
            <Suspense fallback={<ChartSkeleton />}>
              <EskalasiPenolakan />
            </Suspense>
          </div>

          {/* New Analytics Widgets */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Suspense fallback={<ChartSkeleton />}>
              <SLACompliance />
            </Suspense>
            <Suspense fallback={<ChartSkeleton />}>
              <MTTRByType />
            </Suspense>
          </div>

          <Suspense fallback={<ChartSkeleton />}>
            <ReportTypeDistribution />
          </Suspense>

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