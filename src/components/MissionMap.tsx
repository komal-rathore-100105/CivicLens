import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";

type Mission = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  urgency: string;
  category: string;
  volunteer_count: number | null;
  status: string;
};

const urgencyColor: Record<string, string> = {
  critical: "#ef4444",
  high: "#eab308",
  medium: "#00C47D",
  low: "#64748b",
};

export default function MissionMap() {
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    supabase.from("missions").select("id, title, latitude, longitude, urgency, category, volunteer_count, status").then(({ data }) => {
      if (data) setMissions(data);
    });
  }, []);

  return (
    <div className="rounded-xl border border-border overflow-hidden" style={{ height: 260 }}>
      <MapContainer
        center={[19.1, 72.86]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {missions.map((m) => (
          <CircleMarker
            key={m.id}
            center={[m.latitude, m.longitude]}
            radius={8}
            pathOptions={{
              color: urgencyColor[m.urgency] || "#00C47D",
              fillColor: urgencyColor[m.urgency] || "#00C47D",
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ color: "#0A0F0A", fontSize: 12 }}>
                <strong>{m.title}</strong>
                <br />
                {m.category} · {m.volunteer_count || 0} volunteers
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
