
/**
 * Ranking Instansi Widget
 * Source: Report + Agency Service
 * Data: authority.assigned_agency, analytics.sla_breached, analytics.resolution_time_hours
 */
export interface RankingData {
  rank: number;
  agencyName: string;
  slaBreachedCount: number;
  avgResolutionTimeHours: number;
  totalReports: number;
  score: number;
}

export interface RankingInstansiResponse {
  data: RankingData[];
  updatedAt: string;
}

/**
 * Heatmap Masalah Kota Widget
 * Source: Report Service
 * Data: location.latitude, location.longitude, type
 */
export interface HeatmapPoint {
  id: string;
  latitude: number;
  longitude: number;
  type: string;
  intensity: number;
}

export interface HeatmapCluster {
  latitude: number;
  longitude: number;
  count: number;
  types: Record<string, number>;
}

export interface HeatmapMasalahKotaResponse {
  points: HeatmapPoint[];
  clusters: HeatmapCluster[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

/**
 * Eskalasi & Penolakan Widget
 * Source: Report Service
 * Data: status.current, escalation.is_escalated, escalation.escalated_at
 */
export interface EscalationStats {
  totalEscalated: number;
  totalRejected: number;
  escalationRate: number;
  rejectionRate: number;
  totalReports: number;
}

export interface EscalationTrend {
  period: string;
  escalated: number;
  rejected: number;
  resolved: number;
}

export interface EskalasiPenolakanResponse {
  stats: EscalationStats;
  trends: EscalationTrend[];
  updatedAt: string;
}


export interface WidgetProps {
  className?: string;
}

export interface WidgetHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export interface SLAComplianceData {
  agency: string;
  totalAssignedReports: number;
  slaBreachedCount: number;
  slaComplianceRate: number;
}

export interface MTTRByTypeData {
  reportType: string;
  avgResolutionHours: number | null;
  resolvedCount: number;
  totalCount: number;
}

export interface ReportTypeDistributionData {
  reportType: string;
  submitted: number;
  verified: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  escalated: number;
  total: number;
}