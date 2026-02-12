import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  center?: { lat: number; lng: number };
  onLocationSelect?: (lat: number, lng: number) => void;
  zoom?: number;
}

const LocationPickerEvents = ({
  onLocationSelect,
  center,
}: {
  onLocationSelect?: (lat: number, lng: number) => void;
  center: { lat: number; lng: number };
}) => {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
    // Fix for grey tiles issue (manual resize recount)
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 400);
    return () => clearTimeout(timer);
  }, [center.lat, center.lng, map]);

  useMapEvents({
    moveend() {
      const newCenter = map.getCenter();
      if (onLocationSelect) {
        onLocationSelect(newCenter.lat, newCenter.lng);
      }
    },
  });
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  center = { lat: 19.076, lng: 72.8777 },
  onLocationSelect,
  zoom = 15,
}) => {
  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-inner bg-gray-50 dark:bg-[#1a1a1a]">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationPickerEvents
          onLocationSelect={onLocationSelect}
          center={center}
        />
      </MapContainer>

      {/* Absolute Center Indicator (The Pin) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none mb-4 z-[1000]">
        <span
          className="material-symbols-outlined text-primary text-4xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          location_on
        </span>
        <div className="w-1.5 h-1.5 bg-black/20 rounded-full blur-[1px] mx-auto mt-[-4px]"></div>
      </div>
    </div>
  );
};

export default MapComponent;
