import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";

// Fix for default marker icon issue in Leaflet + React
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
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    details?: string;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  zoom?: number;
  center?: { lat: number; lng: number };
  geoJsonData?: any;
}

const MapEvents = ({
  onClick,
}: {
  onClick?: (lat: number, lng: number) => void;
}) => {
  const map = useMap();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 400);
    return () => clearTimeout(timer);
  }, [map]);

  useMapEvents({
    click(e) {
      if (onClick) {
        onClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const ChangeView = ({
  center,
  zoom,
  geoJsonData,
}: {
  center: { lat: number; lng: number };
  zoom: number;
  geoJsonData?: any;
}) => {
  const map = useMap();

  React.useEffect(() => {
    if (geoJsonData) {
      try {
        const layer = L.geoJSON(geoJsonData);
        map.fitBounds(layer.getBounds(), { padding: [20, 20], maxZoom: 15 });
      } catch (e) {
        map.flyTo([center.lat, center.lng], zoom);
      }
    } else {
      map.flyTo([center.lat, center.lng], zoom);
    }
  }, [center.lat, center.lng, zoom, geoJsonData, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  markers = [],
  onMapClick,
  zoom = 11,
  center = { lat: 19.076, lng: 72.8777 },
  geoJsonData,
}) => {
  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView center={center} zoom={zoom} geoJsonData={geoJsonData} />
        <MapEvents onClick={onMapClick} />

        {geoJsonData && (
          <GeoJSON
            key={JSON.stringify(geoJsonData)}
            data={geoJsonData}
            style={() => ({
              color: "#f97316", // Primary orange
              weight: 4, // Thicker border
              opacity: 0.8,
              fillColor: "#fb923c", // Lighter orange fill
              fillOpacity: 0.35,
            })}
          />
        )}

        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-gray-900">{marker.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{marker.details}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
