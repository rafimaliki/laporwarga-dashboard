import { useState, useEffect } from "react";
import { fetchSLACompliance, type SLAComplianceResponse } from "@/api/analytics.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

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

    // Auto-refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
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
            <Clock className="w-5 h-5 text-blue-600" />
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          SLA Compliance Rate
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          Target: Penyelesaian dalam 72 jam
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {topAgencies.map((agency) => {
            const complianceRate = agency.slaComplianceRate;
            const isGood = complianceRate >= 80;
            const isWarning = complianceRate >= 60 && complianceRate < 80;
            const isBad = complianceRate < 60;

            return (
              <div key={agency.agency} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isGood && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    {isWarning && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                    {isBad && <AlertCircle className="w-4 h-4 text-red-600" />}
                    <span className="text-sm font-medium text-slate-700">
                      {agency.agency}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-semibold ${
                        isGood
                          ? "text-green-600"
                          : isWarning
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {complianceRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={complianceRate}
                  className="h-2"
                  indicatorClassName={
                    isGood
                      ? "bg-green-600"
                      : isWarning
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>
                    {agency.totalAssignedReports - agency.slaBreachedCount} sesuai SLA
                  </span>
                  <span>{agency.slaBreachedCount} melewati batas</span>
                </div>
              </div>
            );
          })}
        </div>

        {data.data.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Belum ada data SLA</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}