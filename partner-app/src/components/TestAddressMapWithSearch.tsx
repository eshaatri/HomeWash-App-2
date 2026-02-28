import React, { useRef, useState } from "react";
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  Autocomplete,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const LIBRARIES: ("places")[] = ["places"];
const DEFAULT_CENTER = { lat: 19.076, lng: 72.8777 };
const MAP_CONTAINER_STYLE = { width: "100%", height: "200px", borderRadius: "12px" };

export interface TestAddressMapWithSearchProps {
  initialAddress?: string;
  initialAddressLine2?: string;
  initialLat?: number;
  initialLng?: number;
  onPlaceSelect: (
    address: string,
    addressLine2: string,
    lat: number,
    lng: number,
  ) => void;
}

export const TestAddressMapWithSearch: React.FC<TestAddressMapWithSearchProps> = ({
  initialAddress = "",
  initialAddressLine2 = "",
  initialLat,
  initialLng,
  onPlaceSelect,
}) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>(() =>
    initialLat != null && initialLng != null
      ? { lat: initialLat, lng: initialLng }
      : DEFAULT_CENTER,
  );
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(
    initialLat != null && initialLng != null
      ? { lat: initialLat, lng: initialLng }
      : null,
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    const location = place.geometry?.location;
    if (!location) return;

    const lat = location.lat();
    const lng = location.lng();
    setCenter({ lat, lng });
    setMarkerPos({ lat, lng });

    const formatted = place.formatted_address || "";
    const parts = formatted.split(",").map((p) => p.trim()).filter(Boolean);
    const addressLine1 = parts[0] || place.name || "";
    const addressLine2 = parts.slice(1).join(", ") || "";

    onPlaceSelect(
      addressLine1 || place.formatted_address || "",
      addressLine2,
      lat,
      lng,
    );
  };

  if (loadError) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-red-500">Map failed to load. Check API key.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse">
        <span className="material-symbols-outlined text-3xl text-gray-400 animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none z-10">
          search
        </span>
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            componentRestrictions: { country: "in" },
            fields: ["address_components", "formatted_address", "geometry", "name"],
            types: ["address"],
          }}
        >
          <input
            type="text"
            placeholder="Search address or place..."
            defaultValue={initialAddress ? `${initialAddress}${initialAddressLine2 ? ", " + initialAddressLine2 : ""}` : ""}
            className="w-full h-11 pl-10 pr-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </Autocomplete>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={center}
          zoom={markerPos ? 15 : 12}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            gestureHandling: "greedy",
          }}
          onClick={(e) => {
            if (e.latLng) {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              setCenter({ lat, lng });
              setMarkerPos({ lat, lng });
              onPlaceSelect("Dropped pin", `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng);
            }
          }}
        >
          {markerPos && <MarkerF position={markerPos} />}
        </GoogleMap>
      </div>
    </div>
  );
};
