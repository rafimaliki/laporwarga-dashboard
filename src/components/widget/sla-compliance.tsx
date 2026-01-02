import { useState, useEffect } from "react";
import {
  fetchSLACompliance,
  type SLAComplianceResponse,
} from "@/api/analytics.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Target } from "lucide-react";

export default function SLACompliance() {
  const [data, setData] = useState<SLAComplianceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchSLACompliance();
        setData(result);
      } catch (err) {
        console.error("Error fetching SLA compliance data:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    // const interval = setInterval(loadData, 60000);
    // return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {/* <Target className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600" /> */}
            SLA Compliance Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            SLA Compliance Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Failed to load SLA data</p>
        </CardContent>
      </Card>
    );
  }

  const topAgencies = data.data.slice(0, 5);

  const getColorByPercentage = (percentage: number): string => {
    if (percentage >= 90) return "rgb(22, 163, 74)"; // green-600
    if (percentage >= 80) return "rgb(132, 204, 22)"; // lime-600
    if (percentage >= 70) return "rgb(234, 179, 8)"; // yellow-600
    if (percentage >= 60) return "rgb(249, 115, 22)"; // orange-600
    if (percentage >= 50) return "rgb(251, 113, 133)"; // rose-400
    if (percentage >= 40) return "rgb(239, 68, 68)"; // red-500
    return "rgb(185, 28, 28)"; // red-700
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
          <Target size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">SLA Compliance Rate</h3>
          <p className="text-sm text-slate-500">
            Tingkat kepatuhan instansi terhadap SLA
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {topAgencies.map((agency) => {
            const complianceRate = agency.slaComplianceRate;
            const barColor = getColorByPercentage(complianceRate);
            const isGood = complianceRate >= 80;
            const isWarning = complianceRate >= 60 && complianceRate < 80;
            const isBad = complianceRate < 60;

            return (
              <div key={agency.agency} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isGood && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                    {isWarning && (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    )}
                    {isBad && <AlertCircle className="w-4 h-4 text-red-600" />}
                    <span className="text-sm font-medium text-slate-700">
                      {agency.agency}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: barColor }}
                    >
                      {complianceRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${complianceRate}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>
                    {agency.totalAssignedReports - agency.slaBreachedCount}{" "}
                    sesuai SLA
                  </span>
                  <span>{agency.slaBreachedCount} melewati batas</span>
                </div>
              </div>
            );
          })}
        </div>

        {data.data.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Target className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Belum ada data SLA</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
