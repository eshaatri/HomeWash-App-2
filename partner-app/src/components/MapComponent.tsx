import React, { useCallback, useRef } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

interface MapComponentProps {
  destLat: number;
  destLng: number;
  zoom?: number;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
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
  destLat,
  destLng,
  zoom = 15,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl">
        <p className="text-sm text-red-500">Failed to load map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl animate-pulse">
        <span className="material-symbols-outlined text-3xl text-gray-300 animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg">
      {/* @ts-ignore - React 19 type compat */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: destLat, lng: destLng }}
        zoom={zoom}
        onLoad={onLoad}
        options={mapOptions}
      >
        <MarkerF position={{ lat: destLat, lng: destLng }} />
      </GoogleMap>

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
