import React, { useCallback, useRef, useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Libraries } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const LIBRARIES: Libraries = ["places"];

interface MapComponentProps {
  center?: { lat: number; lng: number };
  onLocationSelect?: (lat: number, lng: number) => void;
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
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi.business",
      elementType: "labels.text",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
  ],
};

const MapComponent: React.FC<MapComponentProps> = ({
  center = { lat: 19.076, lng: 72.8777 },
  onLocationSelect,
  zoom = 15,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const isProgrammaticPanRef = useRef(false);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      map.setCenter(center);
    },
    [center],
  );

  const onIdle = useCallback(() => {
    if (mapRef.current && onLocationSelect) {
      // Skip reporting location if this idle event was from a programmatic pan
      if (isProgrammaticPanRef.current) {
        isProgrammaticPanRef.current = false;
        return;
      }
      const newCenter = mapRef.current.getCenter();
      if (newCenter) {
        onLocationSelect(newCenter.lat(), newCenter.lng());
      }
    }
  }, [onLocationSelect]);

  // Update map center when prop changes (e.g., from geocoding)
  useEffect(() => {
    if (mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      if (currentCenter) {
        const diff =
          Math.abs(currentCenter.lat() - center.lat) +
          Math.abs(currentCenter.lng() - center.lng);
        if (diff > 0.001) {
          isProgrammaticPanRef.current = true;
          mapRef.current.panTo(center);
        }
      }
    }
  }, [center.lat, center.lng]);

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
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-inner bg-gray-50 dark:bg-[#1a1a1a]">
      {/* @ts-ignore - React 19 type compat */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onIdle={onIdle}
        options={mapOptions}
      />

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
