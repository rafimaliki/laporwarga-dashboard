import { useState, useEffect } from "react";
import { fetchRecentReports } from "@/api/analytics.api";
import { FileText, Clock } from "lucide-react";

interface Report {
  reportId: string;
  title: string;
  createdAt: string;
  reportType: string;
  currentStatus: string;
  description: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  submitted: { label: "Submitted", className: "bg-slate-100 text-slate-700" },
  verified: { label: "Verified", className: "bg-blue-100 text-blue-700" },
  in_progress: {
    label: "In Progress",
    className: "bg-yellow-100 text-yellow-700",
  },
  resolved: { label: "Resolved", className: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  escalated: { label: "Escalated", className: "bg-purple-100 text-purple-700" },
};

export default function RecentReports() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const loadRecentReports = async () => {
      try {
        const data = await fetchRecentReports(5);
        setReports(data);
      } catch (error) {
        console.error("Error fetching recent reports:", error);
      } finally {
      }
    };

    loadRecentReports();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Recent Reports</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.reportId}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{report.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={14} />
                    <span>{formatDate(report.createdAt)}</span>
                    <span>•</span>
                    <span className="capitalize">{report.reportType}</span>
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  STATUS_CONFIG[report.currentStatus]?.className ||
                  "bg-slate-100 text-slate-700"
                }`}
              >
                {STATUS_CONFIG[report.currentStatus]?.label ||
                  report.currentStatus}
              </span>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500">
            No recent reports found
          </div>
        )}
      </div>
    </section>
  );
}
