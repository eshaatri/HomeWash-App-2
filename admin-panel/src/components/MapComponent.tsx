import React, { useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  MarkerF,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

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

const containerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions: google.maps.MapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: true,
  gestureHandling: "greedy",
  styles: [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
  ],
};

const MapComponent: React.FC<MapComponentProps> = ({
  markers = [],
  onMapClick,
  zoom = 11,
  center = { lat: 19.076, lng: 72.8777 },
  geoJsonData,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const dataLayerRef = useRef<google.maps.Data | null>(null);
  const [activeMarker, setActiveMarker] = React.useState<string | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    dataLayerRef.current = new google.maps.Data({ map });

    // Style for GeoJSON polygons
    dataLayerRef.current.setStyle({
      fillColor: "#f97316",
      fillOpacity: 0.25,
      strokeColor: "#f97316",
      strokeWeight: 3,
      strokeOpacity: 0.8,
    });
  }, []);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (onMapClick && e.latLng) {
        onMapClick(e.latLng.lat(), e.latLng.lng());
      }
    },
    [onMapClick],
  );

  // Pan to new center when props change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(center);
      if (zoom) mapRef.current.setZoom(zoom);
    }
  }, [center.lat, center.lng, zoom]);

  // Handle GeoJSON data overlay
  useEffect(() => {
    if (!mapRef.current || !dataLayerRef.current) return;

    // Clear existing features
    dataLayerRef.current.forEach((feature) => {
      dataLayerRef.current!.remove(feature);
    });

    if (!geoJsonData) return;

    try {
      // Wrap raw geometry in a FeatureCollection if needed
      let featureCollection;
      if (geoJsonData.type === "FeatureCollection") {
        featureCollection = geoJsonData;
      } else if (geoJsonData.type === "Feature") {
        featureCollection = {
          type: "FeatureCollection",
          features: [geoJsonData],
        };
      } else {
        // It's a raw geometry (Polygon, MultiPolygon, etc.)
        featureCollection = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: geoJsonData,
              properties: {},
            },
          ],
        };
      }

      const addedFeatures = dataLayerRef.current.addGeoJson(featureCollection);

      // Fit bounds to the GeoJSON
      if (addedFeatures && addedFeatures.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        dataLayerRef.current.forEach((feature) => {
          feature.getGeometry()?.forEachLatLng((latlng) => {
            bounds.extend(latlng);
          });
        });
        mapRef.current.fitBounds(bounds, {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        });
      }
    } catch (err) {
      console.error("Failed to render GeoJSON on Google Maps:", err);
    }
  }, [geoJsonData]);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <p className="text-sm text-red-500">Failed to load map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse">
        <span className="material-symbols-outlined text-3xl text-gray-300 animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      {/* @ts-ignore - React 19 type compat */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onClick={handleMapClick}
        options={mapOptions}
      >
        {markers.map((marker) => (
          <MarkerF
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => setActiveMarker(marker.id)}
          >
            {activeMarker === marker.id && (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div className="p-2">
                  <h3 className="font-bold text-gray-900">{marker.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{marker.details}</p>
                </div>
              </InfoWindow>
            )}
          </MarkerF>
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
