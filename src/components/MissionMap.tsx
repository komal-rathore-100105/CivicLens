import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { campaigns, type Campaign } from "@/data/platformData";
import { useTheme } from "@/components/theme-provider";

const urgencyColor: Record<string, string> = {
  critical: "#ef4444",
  high: "#f59e0b",
  medium: "#10B981",
  low: "#64748b",
};

type MissionMapProps = {
  points?: Campaign[];
  center?: [number, number];
  zoom?: number;
  height?: number;
  showHeatLegend?: boolean;
};

export default function MissionMap({
  points = campaigns,
  center = [19.1, 72.86],
  zoom = 11,
  height = 340,
  showHeatLegend = true,
}: MissionMapProps) {
  const { resolvedTheme } = useTheme();

  const mapStyleUrl = resolvedTheme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const hotspots = useMemo(() => {
    return points
      .slice()
      .sort((a, b) => b.co2PotentialKg - a.co2PotentialKg)
      .slice(0, 3);
  }, [points]);

  return (
    <div className="rounded-xl border border-border overflow-hidden relative" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer key={resolvedTheme} url={mapStyleUrl} />

        {hotspots.map((point) => (
          <CircleMarker
            key={`hot-${point.id}`}
            center={[point.lat, point.lng]}
            radius={26}
            pathOptions={{
              color: urgencyColor[point.urgency] || "#10B981",
              fillColor: urgencyColor[point.urgency] || "#10B981",
              fillOpacity: 0.08,
              weight: 1,
            }}
          />
        ))}

        {points.map((m) => (
          <CircleMarker
            key={m.id}
            center={[m.lat, m.lng]}
            radius={Math.max(7, Math.min(13, Math.round(m.co2PotentialKg / 900)))}
            pathOptions={{
              color: urgencyColor[m.urgency] || "#00C47D",
              fillColor: urgencyColor[m.urgency] || "#00C47D",
              fillOpacity: 0.75,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ color: "#111827", fontSize: 12, minWidth: 190 }}>
                <strong>{m.title}</strong>
                <br />
                {m.locationName}
                <br />
                {m.impactType} impact · {m.volunteers} volunteers
                <br />
                Potential: {m.co2PotentialKg.toLocaleString()} kg CO2
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {showHeatLegend && (
        <div className="absolute bottom-3 left-3 rounded-lg border border-border bg-card/90 backdrop-blur px-3 py-2">
          <p className="text-[11px] font-medium text-foreground">Impact Heat Zones</p>
          <div className="mt-1 space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-red-500" /> High urgency
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Medium urgency
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active zones
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
