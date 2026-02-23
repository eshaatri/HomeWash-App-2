import React, { useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  MarkerF,
  InfoWindow,
  useLoadScript,
  DrawingManagerF,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "";
const LIBRARIES: any = ["places", "geometry", "drawing"];

interface MapComponentProps {
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    details?: string;
    draggable?: boolean;
    onDragEnd?: (lat: number, lng: number) => void;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  zoom?: number;
  center?: { lat: number; lng: number };
  geoJsonData?: any;
  pincode?: string;
  isEditable?: boolean;
  onGeoJsonChange?: (geoJson: any) => void;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapComponent: React.FC<MapComponentProps> = ({
  markers = [],
  onMapClick,
  zoom = 11,
  center = { lat: 19.076, lng: 72.8777 },
  geoJsonData,
  pincode,
  isEditable = false,
  onGeoJsonChange,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = React.useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = React.useState<{
    position: google.maps.LatLng;
    feature: google.maps.Data.Feature;
  } | null>(null);

  const drawingOptions = React.useMemo(() => {
    if (!isLoaded || !window.google) return undefined;
    return {
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        fillColor: "#f97316",
        fillOpacity: 0.25,
        strokeColor: "#f97316",
        strokeWeight: 3,
        editable: true,
        clickable: true,
      },
    };
  }, [isLoaded]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    mapRef.current = mapInstance;
  }, []);

  // Set map style depending on editable mode
  useEffect(() => {
    if (!map) return;
    map.data.setStyle({
      fillColor: "#f97316",
      fillOpacity: 0.25,
      strokeColor: "#f97316",
      strokeWeight: 3,
      strokeOpacity: 0.8,
      editable: isEditable,
      clickable: true,
    });
  }, [map, isEditable]);

  // Handle Google Maps Feature Layers (Data-driven styling)
  useEffect(() => {
    if (!map || !GOOGLE_MAPS_MAP_ID || !pincode) return;

    // Use Feature Layers for POSTAL_CODE if Map ID is available
    // @ts-ignore - Feature Layers are in the latest SDK
    const featureLayer = map.getFeatureLayer("POSTAL_CODE");

    if (featureLayer) {
      // @ts-ignore
      featureLayer.style = (options: any) => {
        if (options.feature.displayName === pincode) {
          return {
            fillColor: "#f97316",
            fillOpacity: 0.3,
            strokeColor: "#f97316",
            strokeWeight: 4,
          };
        }
      };
    }
  }, [pincode, map]);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      setSelectedFeature(null);
      if (onMapClick && e.latLng) {
        onMapClick(e.latLng.lat(), e.latLng.lng());
      }
    },
    [onMapClick],
  );

  const [internalCenter, setInternalCenter] = React.useState(center);

  // Pan to new center when props change
  useEffect(() => {
    setInternalCenter(center);
    if (map) {
      map.panTo(center);
      if (zoom) map.setZoom(zoom);
    }
  }, [map, center.lat, center.lng, zoom]);

  // Handle GeoJSON data overlay
  const prevGeoJsonStr = useRef<string | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!geoJsonData) {
      map.data.forEach((feature) => map.data.remove(feature));
      prevGeoJsonStr.current = null;
      return;
    }

    const currentStr = JSON.stringify(geoJsonData);
    // Standardize comparison if it's identical
    if (currentStr === prevGeoJsonStr.current) return;
    prevGeoJsonStr.current = currentStr;

    // Map changed externally, clear existing features
    map.data.forEach((feature) => {
      map.data.remove(feature);
    });

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

      const addedFeatures = map.data.addGeoJson(featureCollection);

      // Fit bounds to the GeoJSON
      if (addedFeatures && addedFeatures.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        map.data.forEach((feature) => {
          feature.getGeometry()?.forEachLatLng((latlng) => {
            bounds.extend(latlng);
          });
        });
        map.fitBounds(bounds, {
          top: 40,
          right: 40,
          bottom: 40,
          left: 40,
        });
      }
    } catch (err) {
      console.error("Failed to render GeoJSON on Google Maps:", err);
    }
  }, [map, geoJsonData]);

  // Listen to edits and inform parent
  useEffect(() => {
    if (!map || !onGeoJsonChange || !isEditable) return;

    let debounceTimer: any;
    const triggerChange = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        map.data.toGeoJson((geoJson: any) => {
          if (geoJson.features && geoJson.features.length > 0) {
            // Let's pass back just the geometry bounds if it's one feature for simplicity, or the whole FeatureCollection
            prevGeoJsonStr.current = JSON.stringify(geoJson); // Prevent loop
            onGeoJsonChange(geoJson);
          } else {
            onGeoJsonChange(null);
          }
        });
      }, 500);
    };

    const handleFeatureClick = (e: any) => {
      if (e.feature && e.latLng) {
        if (e.stop) e.stop();
        setSelectedFeature({ position: e.latLng, feature: e.feature });
      }
    };

    const listeners = [
      map.data.addListener("setgeometry", triggerChange),
      map.data.addListener("addfeature", triggerChange),
      map.data.addListener("removefeature", triggerChange),
      map.data.addListener("click", handleFeatureClick),
    ];

    return () => {
      listeners.forEach((l) => google.maps.event.removeListener(l));
      clearTimeout(debounceTimer);
    };
  }, [map, onGeoJsonChange, isEditable]);

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    if (!map) return;
    const paths = polygon.getPath().getArray();
    const coords = paths.map((p) => [p.lng(), p.lat()]);
    if (coords.length > 0) {
      coords.push(coords[0]); // Close polygon
    }

    const feature = {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [coords] },
      properties: {},
    };

    map.data.addGeoJson(feature);
    polygon.setMap(null); // Remove raw polygon overlay since it's now in map.data
  };

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

  const mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    gestureHandling: "greedy",
    mapId: GOOGLE_MAPS_MAP_ID, // Required for Data-driven styling
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

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={internalCenter}
        zoom={zoom}
        onLoad={onLoad}
        onClick={handleMapClick}
        options={mapOptions}
      >
        {isEditable && drawingOptions && (
          <DrawingManagerF
            onPolygonComplete={onPolygonComplete}
            options={drawingOptions}
          />
        )}
        {markers.map((marker) => (
          <MarkerF
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            draggable={marker.draggable}
            onDragEnd={(e) => {
              if (e.latLng && marker.onDragEnd) {
                marker.onDragEnd(e.latLng.lat(), e.latLng.lng());
              }
            }}
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

        {selectedFeature && (
          <InfoWindow
            position={selectedFeature.position}
            onCloseClick={() => setSelectedFeature(null)}
          >
            <div className="p-1">
              <button
                type="button"
                onClick={() => {
                  if (map && selectedFeature.feature) {
                    map.data.remove(selectedFeature.feature);
                    setSelectedFeature(null);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white shadow-md px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">
                  delete
                </span>
                Delete Shape
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
