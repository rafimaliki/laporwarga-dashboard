import { MapPin, Filter, Layers } from "lucide-react";
import { use, useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import type { HeatmapPoint, HeatmapCluster, WidgetProps } from "./types";
import "leaflet/dist/leaflet.css";


interface HeatmapData {
  points: HeatmapPoint[];
  clusters: HeatmapCluster[];
}

const fetchHeatmapData = async (): Promise<HeatmapData> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_URL}/api/reports/heatmap`);
  // return response.json();

  // Simulated delay for demo
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Mock data for Jakarta area
  const types = ["Infrastruktur", "Kebersihan", "Keamanan", "Pelayanan Publik", "Lainnya"];
  
  const points: HeatmapPoint[] = [
    { id: "1", latitude: -6.2088, longitude: 106.8456, type: "Infrastruktur", intensity: 0.9 },
    { id: "2", latitude: -6.1751, longitude: 106.8650, type: "Kebersihan", intensity: 0.7 },
    { id: "3", latitude: -6.2297, longitude: 106.6894, type: "Keamanan", intensity: 0.5 },
    { id: "4", latitude: -6.1862, longitude: 106.8345, type: "Pelayanan Publik", intensity: 0.8 },
    { id: "5", latitude: -6.2615, longitude: 106.8106, type: "Infrastruktur", intensity: 0.6 },
    { id: "6", latitude: -6.1544, longitude: 106.8317, type: "Kebersihan", intensity: 0.9 },
    { id: "7", latitude: -6.2383, longitude: 106.9756, type: "Lainnya", intensity: 0.4 },
    { id: "8", latitude: -6.1352, longitude: 106.8133, type: "Infrastruktur", intensity: 0.7 },
    { id: "9", latitude: -6.2046, longitude: 106.8225, type: "Keamanan", intensity: 0.8 },
    { id: "10", latitude: -6.2194, longitude: 106.7509, type: "Kebersihan", intensity: 0.5 },
    { id: "11", latitude: -6.1687, longitude: 106.7893, type: "Pelayanan Publik", intensity: 0.6 },
    { id: "12", latitude: -6.2456, longitude: 106.8801, type: "Infrastruktur", intensity: 0.9 },
    { id: "13", latitude: -6.1923, longitude: 106.9012, type: "Lainnya", intensity: 0.3 },
    { id: "14", latitude: -6.2789, longitude: 106.7234, type: "Keamanan", intensity: 0.7 },
    { id: "15", latitude: -6.1456, longitude: 106.8567, type: "Kebersihan", intensity: 0.8 },
  ];

  const clusters: HeatmapCluster[] = [
    { latitude: -6.2088, longitude: 106.8456, count: 45, types: { Infrastruktur: 20, Kebersihan: 15, Keamanan: 10 } },
    { latitude: -6.1751, longitude: 106.8650, count: 32, types: { Kebersihan: 18, "Pelayanan Publik": 14 } },
    { latitude: -6.2297, longitude: 106.6894, count: 28, types: { Keamanan: 15, Lainnya: 13 } },
  ];

  return { points, clusters };
};

// Cache the promise for Suspense
let heatmapPromise: Promise<HeatmapData> | null = null;

function getHeatmapData(): Promise<HeatmapData> {
  if (!heatmapPromise) {
    heatmapPromise = fetchHeatmapData();
  }
  return heatmapPromise;
}

// Reset cache (useful for refresh functionality)
export function resetHeatmapCache() {
  heatmapPromise = null;
}

// ============================================
// Type Color Mapping
// ============================================

const TYPE_COLORS: Record<string, string> = {
  Infrastruktur: "#ef4444",
  Kebersihan: "#22c55e",
  Keamanan: "#f59e0b",
  "Pelayanan Publik": "#3b82f6",
  Lainnya: "#8b5cf6",
};

const getTypeColor = (type: string): string => {
  return TYPE_COLORS[type] || "#6b7280";
};

// ============================================
// Sub-Components
// ============================================

interface LegendProps {
  types: string[];
  activeFilter: string | null;
  onFilterChange: (type: string | null) => void;
}

function Legend({ types, activeFilter, onFilterChange }: LegendProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onFilterChange(null)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          activeFilter === null
            ? "bg-slate-800 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        Semua
      </button>
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onFilterChange(type)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeFilter === type
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getTypeColor(type) }}
          />
          {type}
        </button>
      ))}
    </div>
  );
}

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

function MapControlsPanel({ onZoomIn, onZoomOut, onReset }: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1 bg-white rounded-lg shadow-md border border-slate-200">
      <button
        onClick={onZoomIn}
        className="p-2 hover:bg-slate-50 transition-colors rounded-t-lg"
        title="Zoom In"
      >
        <span className="text-slate-600 font-bold">+</span>
      </button>
      <div className="h-px bg-slate-200" />
      <button
        onClick={onZoomOut}
        className="p-2 hover:bg-slate-50 transition-colors"
        title="Zoom Out"
      >
        <span className="text-slate-600 font-bold">−</span>
      </button>
      <div className="h-px bg-slate-200" />
      <button
        onClick={onReset}
        className="p-2 hover:bg-slate-50 transition-colors rounded-b-lg"
        title="Reset View"
      >
        <Layers size={14} className="text-slate-600" />
      </button>
    </div>
  );
}

// Map controller component for programmatic control
function MapController({
  controlRef,
}: {
  controlRef: React.MutableRefObject<{
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
  } | null>;
}) {
  const map = useMap();

  controlRef.current = {
    zoomIn: () => map.zoomIn(),
    zoomOut: () => map.zoomOut(),
    reset: () => map.setView([-6.2088, 106.8456], 11),
  };

  return null;
}

// ============================================
// Main Widget Component
// ============================================

interface HeatmapMasalahKotaProps extends WidgetProps {
  dataPromise?: Promise<HeatmapData>;
}

function HeatmapMasalahKotaContent({ dataPromise }: HeatmapMasalahKotaProps) {
  const data = use(dataPromise ?? getHeatmapData());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const mapControlRef = React.useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
  } | null>(null);

  const types = useMemo(() => {
    const uniqueTypes = new Set(data.points.map((p) => p.type));
    return Array.from(uniqueTypes);
  }, [data.points]);

  const filteredPoints = useMemo(() => {
    if (!activeFilter) return data.points;
    return data.points.filter((p) => p.type === activeFilter);
  }, [data.points, activeFilter]);

  const stats = useMemo(() => {
    const byType = data.points.reduce(
      (acc, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return byType;
  }, [data.points]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <MapPin size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Heatmap Masalah Kota</h3>
            <p className="text-sm text-slate-500">
              Identifikasi wilayah bermasalah
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            {filteredPoints.length} titik
          </span>
          <button className="h-9 px-3 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Legend/Filter */}
      <div className="mb-4">
        <Legend
          types={types}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Map Container */}
      <div className="relative h-80 w-full rounded-xl overflow-hidden border border-slate-200">
        <MapContainer
          center={[-6.2088, 106.8456]}
          zoom={11}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController controlRef={mapControlRef} />
          
          {filteredPoints.map((point) => (
            <CircleMarker
              key={point.id}
              center={[point.latitude, point.longitude]}
              radius={8 + point.intensity * 8}
              pathOptions={{
                color: getTypeColor(point.type),
                fillColor: getTypeColor(point.type),
                fillOpacity: 0.6,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{point.type}</p>
                  <p className="text-slate-500">
                    Intensitas: {Math.round(point.intensity * 100)}%
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
        
        <MapControlsPanel
          onZoomIn={() => mapControlRef.current?.zoomIn()}
          onZoomOut={() => mapControlRef.current?.zoomOut()}
          onReset={() => mapControlRef.current?.reset()}
        />
      </div>

      {/* Stats Summary */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {types.map((type) => (
          <div
            key={type}
            className="px-3 py-2 rounded-lg bg-slate-50 text-center"
          >
            <div
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: getTypeColor(type) }}
            />
            <p className="text-xs text-slate-500 truncate">{type}</p>
            <p className="text-sm font-semibold text-slate-700">
              {stats[type] || 0}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Need to import React for useRef
import React from "react";

export default function HeatmapMasalahKota(props: HeatmapMasalahKotaProps) {
  return <HeatmapMasalahKotaContent {...props} />;
}
