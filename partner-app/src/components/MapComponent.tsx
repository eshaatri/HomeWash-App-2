import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
  destLat: number;
  destLng: number;
  zoom?: number;
}

const MapComponent: React.FC<MapComponentProps> = ({
  destLat,
  destLng,
  zoom = 15,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg">
      <MapContainer
        center={[destLat, destLng]}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[destLat, destLng]}>
          <Popup>Customer Location</Popup>
        </Marker>
      </MapContainer>

      {/* Navigation Shortcut Overlay */}
      <button
        onClick={() =>
          window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`,
            "_blank",
          )
        }
        className="absolute bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-xl flex items-center gap-2 font-bold active:scale-95 transition-transform z-[1000]"
      >
        <span className="material-symbols-outlined">directions</span>
        Navigate
      </button>
    </div>
  );
};

export default MapComponent;
