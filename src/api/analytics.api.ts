import axios from "axios";
import type {
  RankingData,
  HeatmapPoint,
  HeatmapCluster,
  EscalationStats,
  EscalationTrend,
  SLAComplianceData,
  MTTRByTypeData,
  ReportTypeDistributionData
} from "@/components/widget/types";

// ============================================
// API Configuration
// ============================================

const ANALYTICS_SERVICE_URL = import.meta.env.VITE_ANALYTICS_SERVICE_URL || "http://localhost:5000/api";

const analyticsApi = axios.create({
  baseURL: ANALYTICS_SERVICE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// Response Types
// ============================================

export interface RankingResponse {
  data: RankingData[];
  updatedAt: string;
}

export interface HeatmapResponse {
  points: HeatmapPoint[];
  clusters: HeatmapCluster[];
}

export interface EscalationResponse {
  stats: EscalationStats;
  trends: EscalationTrend[];
  updatedAt: string;
}
export interface SLAComplianceResponse {
  data: SLAComplianceData[];
  updatedAt: string;
}

export interface MTTRByTypeResponse {
  data: MTTRByTypeData[];
  updatedAt: string;
}

export interface ReportTypeDistributionResponse {
  data: ReportTypeDistributionData[];
  updatedAt: string;
}
// ============================================
// Query Parameters
// ============================================

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

function buildQueryString(params: DateRangeParams): string {
  const searchParams = new URLSearchParams();
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

// ============================================
// API Functions
// ============================================

/**
 * Fetch agency ranking data
 * GET /api/analytics/ranking
 */
export async function fetchRankingInstansi(params: DateRangeParams = {}): Promise<RankingResponse> {
  const query = buildQueryString(params);
  const response = await analyticsApi.get<RankingResponse>(`/analytics/ranking${query}`);
  return response.data;
}

/**
 * Fetch heatmap data for city problem areas
 * GET /api/analytics/heatmap
 */
export async function fetchHeatmapMasalahKota(params: DateRangeParams = {}): Promise<HeatmapResponse> {
  const query = buildQueryString(params);
  const response = await analyticsApi.get<HeatmapResponse>(`/analytics/heatmap${query}`);
  return response.data;
}

/**
 * Fetch escalation and rejection statistics
 * GET /api/analytics/escalation
 */
export async function fetchEskalasiPenolakan(params: DateRangeParams = {}): Promise<EscalationResponse> {
  const query = buildQueryString(params);
  const response = await analyticsApi.get<EscalationResponse>(`/analytics/escalation${query}`);
  return response.data;
}

/**
 * Fetch dashboard overview stats
 */
export async function fetchDashboardStats() {
  const response = await analyticsApi.get("/analytics/overview");
  return response.data;
}

/**
 * Fetch SLA compliance data
 * GET /api/analytics/sla-compliance
 */
export async function fetchSLACompliance(params: DateRangeParams = {}): Promise<SLAComplianceResponse> {
  const query = buildQueryString(params);
  const response = await analyticsApi.get<SLAComplianceResponse>(`/analytics/sla-compliance${query}`);
  return response.data;
}

/**
 * Fetch MTTR by type data
 * GET /api/analytics/mttr-by-type
 */
export async function fetchMTTRByType(params: DateRangeParams = {}): Promise<MTTRByTypeResponse> {
  const query = buildQueryString(params);
  const response = await analyticsApi.get<MTTRByTypeResponse>(`/analytics/mttr-by-type${query}`);
  return response.data;
}

/**
 * Fetch report type distribution data
 * GET /api/analytics/report-type-distribution
 */
export async function fetchReportTypeDistribution(params: DateRangeParams = {}): Promise<ReportTypeDistributionResponse> {
  const query = buildQueryString(params);
  const response = await analyticsApi.get<ReportTypeDistributionResponse>(`/analytics/report-type-distribution${query}`);
  return response.data;
}

// ============================================
// Error Handling Wrapper
// ============================================

export async function apiCall<T>(
  apiFunction: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await apiFunction();
  } catch (error) {
    console.error("API call failed:", error);
    return fallback;
  }
}
