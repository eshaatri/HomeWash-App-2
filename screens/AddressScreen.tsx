import React, { useState, useRef, useCallback } from "react";
import { AppScreen, NavigationProps } from "../types";
import MapComponent from "../components/MapComponent";
import { areaService } from "../src/services/api";

interface AddressItem {
  id: string;
  label: string;
  address: string;
  areaName?: string;
  icon: string;
  type: "HOME" | "WORK" | "OTHER";
}

export const AddressScreen: React.FC<NavigationProps> = ({
  navigateTo,
  isPremium,
  setCurrentLocation,
  cart,
}) => {
  const [addresses, setAddresses] = useState<AddressItem[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newLabel, setNewLabel] = useState("Home");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [coords, setCoords] = useState({ lat: 19.076, lng: 72.8777 });

  // Search & Autocomplete State
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    Array<{
      placeId: string;
      description: string;
      mainText: string;
      secondaryText: string;
    }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Confirm-Location (lower bar) Autocomplete State
  const [confirmSuggestions, setConfirmSuggestions] = useState<
    Array<{
      placeId: string;
      description: string;
      mainText: string;
      secondaryText: string;
    }>
  >([]);
  const [showConfirmSuggestions, setShowConfirmSuggestions] = useState(false);
  const [isConfirmSearching, setIsConfirmSearching] = useState(false);
  const confirmSearchTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search using Google Places API (New) REST endpoint
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("VITE_GOOGLE_MAPS_API_KEY is not set – Places search disabled.");
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      if (!apiKey) {
        setIsSearching(false);
        return;
      }
      try {
        const response = await fetch(
          `https://places.googleapis.com/v1/places:autocomplete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask":
                "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat",
            },
            body: JSON.stringify({
              input: query,
              includedRegionCodes: ["in"],
              languageCode: "en",
            }),
          },
        );
        const data = await response.json();

        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(
            data.suggestions
              .filter((s: any) => s.placePrediction)
              .map((s: any) => ({
                placeId:
                  s.placePrediction.placeId ||
                  s.placePrediction.place?.split("/").pop() ||
                  "",
                description: s.placePrediction.text?.text || "",
                mainText:
                  s.placePrediction.structuredFormat?.mainText?.text ||
                  s.placePrediction.text?.text ||
                  "",
                secondaryText:
                  s.placePrediction.structuredFormat?.secondaryText?.text || "",
              })),
          );
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error("Places autocomplete failed:", err);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  // Debounced search for lower "Confirm Location" input using Places API
  const handleConfirmSearchChange = useCallback((query: string) => {
    setNewAddress(query);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn(
        "VITE_GOOGLE_MAPS_API_KEY is not set – Confirm Location Places search disabled.",
      );
    }

    if (confirmSearchTimeoutRef.current) {
      clearTimeout(confirmSearchTimeoutRef.current);
    }

    if (!query || query.length < 2) {
      setConfirmSuggestions([]);
      setShowConfirmSuggestions(false);
      return;
    }

    setIsConfirmSearching(true);
    confirmSearchTimeoutRef.current = setTimeout(async () => {
      if (!apiKey) {
        setIsConfirmSearching(false);
        return;
      }
      try {
        const response = await fetch(
          `https://places.googleapis.com/v1/places:autocomplete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask":
                "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat",
            },
            body: JSON.stringify({
              input: query,
              includedRegionCodes: ["in"],
              languageCode: "en",
            }),
          },
        );
        const data = await response.json();

        if (data.suggestions && data.suggestions.length > 0) {
          setConfirmSuggestions(
            data.suggestions
              .filter((s: any) => s.placePrediction)
              .map((s: any) => ({
                placeId:
                  s.placePrediction.placeId ||
                  s.placePrediction.place?.split("/").pop() ||
                  "",
                description: s.placePrediction.text?.text || "",
                mainText:
                  s.placePrediction.structuredFormat?.mainText?.text ||
                  s.placePrediction.text?.text ||
                  "",
                secondaryText:
                  s.placePrediction.structuredFormat?.secondaryText?.text ||
                  "",
              })),
          );
          setShowConfirmSuggestions(true);
        } else {
          setConfirmSuggestions([]);
          setShowConfirmSuggestions(false);
        }
      } catch (err) {
        console.error("Confirm Places autocomplete failed:", err);
        setConfirmSuggestions([]);
        setShowConfirmSuggestions(false);
      } finally {
        setIsConfirmSearching(false);
      }
    }, 300);
  }, []);

  // Handle suggestion selection: geocode and open the add form
  const handleSelectSuggestion = useCallback(
    (suggestion: { placeId: string; description: string }) => {
      setShowSuggestions(false);
      setSearchQuery("");
      setSuggestions([]);

      if (!window.google || !window.google.maps) return;

      const geocoder = new google.maps.Geocoder();
      setIsLocating(true); // Show loader while checking
      geocoder.geocode(
        { placeId: suggestion.placeId },
        async (results, status) => {
          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results[0]
          ) {
            const result = results[0];
            const loc = result.geometry.location;
            const lat = loc.lat();
            const lng = loc.lng();

            try {
              const coverage = await areaService.checkCoverage(lat, lng);
              if (!coverage.serviceable) {
                setErrorData({
                  title: "Area Not Serviceable",
                  message: "We currently do not operate in this area.",
                  help: "We are expanding quickly! Please check back later or try a location in an active service zone.",
                });
                setIsLocating(false);
                return;
              }

              setCoords({ lat, lng });
              setNewAddress(suggestion.description);
              (window as any)._pendingAreaName = coverage.areaName;
              setIsAdding(true);
            } catch (err) {
              console.error("Coverage check failed:", err);
              setErrorData({
                title: "Service Check Failed",
                message: "We couldn't verify serviceability for this area.",
                help: "Please check your internet connection and try again.",
              });
            } finally {
              setIsLocating(false);
            }
          } else {
            setIsLocating(false);
          }
        },
      );
    },
    [],
  );

  // Handle lower confirm-bar suggestion selection: just update text/address
  const handleSelectConfirmSuggestion = useCallback(
    (suggestion: { placeId: string; description: string }) => {
      setShowConfirmSuggestions(false);
      setConfirmSuggestions([]);
      setNewAddress(suggestion.description);
    },
    [],
  );

  // New State for Error Modal
  const [errorData, setErrorData] = useState<{
    title: string;
    message: string;
    help: string;
  } | null>(null);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setErrorData(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        try {
          let formatted = "Unknown Location";

          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
            );
            const data = await response.json();

            if (data.status === "OK" && data.results && data.results.length) {
              const result = data.results[0];
              const components = result.address_components || [];

              const getComponent = (type: string) =>
                components.find((c: any) => c.types.includes(type))?.long_name;

              const suburb =
                getComponent("sublocality_level_1") ||
                getComponent("sublocality") ||
                getComponent("neighborhood");
              const city =
                getComponent("locality") ||
                getComponent("administrative_area_level_2");
              const postcode = getComponent("postal_code");

              if (suburb && city) {
                formatted = `${suburb}, ${city}`;
              } else if (city) {
                formatted = city;
              } else if (result.formatted_address) {
                formatted = result.formatted_address
                  .split(",")
                  .slice(0, 2)
                  .join(",");
              }

              if (postcode && formatted.length < 25) {
                formatted += ` ${postcode}`;
              }
            } else {
              formatted = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            }
          } catch (geoError) {
            console.error("Reverse geocoding failed:", geoError);
            formatted = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          }

          try {
            const coverage = await areaService.checkCoverage(latitude, longitude);
            if (!coverage.serviceable) {
              setErrorData({
                title: "Area Not Serviceable",
                message:
                  "We currently do not operate in this detected location.",
                help: "We are expanding quickly! Please try selecting a location within our active zones.",
              });
              setIsLocating(false);
              return;
            }

            setCoords({ lat: latitude, lng: longitude });
            setNewAddress(formatted);
            (window as any)._pendingAreaName = coverage.areaName;
            setIsAdding(true);
          } catch (err) {
            console.error("Coverage check failed:", err);
            setErrorData({
              title: "Service Check Failed",
              message:
                "We couldn't verify serviceability for your location.",
              help: "Please try again later or enter address manually.",
            });
          } finally {
            setIsLocating(false);
          }
        } catch (outerErr) {
          console.error("Use current location failed:", outerErr);
          setErrorData({
            title: "Location Error",
            message: "We couldn't process your current location.",
            help: "Please try again or enter your address manually.",
          });
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let title = "Unable to access location";
        let message = "An unknown error occurred.";
        let help = "Please try again.";

        // Robust error handling with user-friendly messages
        switch (error.code) {
          case error.PERMISSION_DENIED:
            title = "Permission Denied";
            message = "You have denied location access to this app.";
            help =
              "Please enable location permissions in your browser settings (look for the lock icon in the URL bar).";
            break;
          case error.POSITION_UNAVAILABLE:
            title = "Location Unavailable";
            message = "Your device could not determine your current location.";
            help =
              "Please ensure your GPS is enabled and you have a clear view of the sky, or try connecting to Wi-Fi.";
            break;
          case error.TIMEOUT:
            title = "Request Timed Out";
            message = "It took too long to get your location.";
            help = "Please check your internet connection and try again.";
            break;
        }

        setErrorData({ title, message, help });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      },
    );
  };

  const handleSelectAddress = (item: AddressItem) => {
    if (!editingId) {
      setCurrentLocation(item.address, item.label, item.areaName);
      if (cart && cart.length > 0) {
        navigateTo(AppScreen.CHECKOUT);
      } else {
        navigateTo(AppScreen.HOME);
      }
    }
  };

  const handleAddAddress = async () => {
    if (newAddress.trim()) {
      setIsLocating(true);
      try {
        const coverage = await areaService.checkCoverage(
          coords.lat,
          coords.lng,
        );
        if (!coverage.serviceable) {
          setErrorData({
            title: "Area Not Serviceable",
            message: "The address entered is outside our service area.",
            help: "Please try a different address or check back later as we expand.",
          });
          setIsLocating(false);
          return;
        }

        const newItem: AddressItem = {
          id: Date.now().toString(),
          label: newLabel,
          address: newAddress,
          areaName: coverage.areaName || (window as any)._pendingAreaName,
          icon:
            newLabel === "Home"
              ? "home"
              : newLabel === "Office"
                ? "work"
                : "location_on",
          type:
            newLabel === "Home"
              ? "HOME"
              : newLabel === "Office"
                ? "WORK"
                : "OTHER",
        };
        setAddresses([...addresses, newItem]);
        setIsAdding(false);
        setNewAddress("");
      } catch (err) {
        console.error("Coverage check failed:", err);
        setErrorData({
          title: "Service Check Failed",
          message: "Unable to verify service area right now.",
          help: "Please try again in a moment.",
        });
      } finally {
        setIsLocating(false);
      }
    }
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  // Persist addresses in localStorage so they survive page reloads
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("hw_saved_addresses_v1");
      if (raw) {
        const parsed = JSON.parse(raw) as AddressItem[];
        if (Array.isArray(parsed)) {
          setAddresses(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load saved addresses from storage:", e);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(
        "hw_saved_addresses_v1",
        JSON.stringify(addresses),
      );
    } catch (e) {
      console.warn("Failed to persist addresses to storage:", e);
    }
  }, [addresses]);

  // Debounced address search to move map (Google Maps JS Geocoder)
  React.useEffect(() => {
    if (!newAddress || newAddress.length < 3 || isLocating) return;

    const timeoutId = setTimeout(() => {
      // Use the Google Maps JS API Geocoder (works with browser-restricted API keys)
      if (window.google && window.google.maps) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { address: newAddress, region: "in" },
          (results, status) => {
            if (
              status === google.maps.GeocoderStatus.OK &&
              results &&
              results[0]
            ) {
              const loc = results[0].geometry.location;
              setCoords({
                lat: loc.lat(),
                lng: loc.lng(),
              });
            }
          },
        );
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [newAddress]);

  return (
    <div className="bg-[#f8f7f6] dark:bg-[#121212] min-h-screen flex flex-col font-display antialiased transition-colors duration-300 relative">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[#f8f7f6]/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <button
          onClick={() =>
            cart && cart.length > 0
              ? navigateTo(AppScreen.CHECKOUT)
              : navigateTo(AppScreen.HOME)
          }
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-onyx dark:text-white">
            arrow_back
          </span>
        </button>
        <h1 className="text-base font-bold text-onyx dark:text-white tracking-wide">
          Addresses
        </h1>
        <button
          onClick={() => navigateTo(AppScreen.SUPPORT)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-onyx dark:text-white">
            help_outline
          </span>
        </button>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Search Bar with Autocomplete */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            search
          </span>
          {isSearching && (
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin z-10 text-sm">
              progress_activity
            </span>
          )}
          {searchQuery && !isSearching && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for area, street name..."
            className="w-full h-12 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 pl-11 pr-10 text-sm font-medium text-onyx dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
          />

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto">
              {suggestions.map((s, i) => (
                <button
                  key={s.placeId}
                  onClick={() => handleSelectSuggestion(s)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors ${
                    i < suggestions.length - 1
                      ? "border-b border-gray-100 dark:border-white/5"
                      : ""
                  }`}
                >
                  <span className="material-symbols-outlined text-primary mt-0.5 text-lg flex-shrink-0">
                    location_on
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-onyx dark:text-white truncate">
                      {s.mainText}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {s.secondaryText}
                    </p>
                  </div>
                </button>
              ))}
              <div className="px-4 py-2 bg-gray-50 dark:bg-black/20 flex items-center justify-end gap-1">
                <span className="text-[9px] text-gray-400">Powered by</span>
                <span className="text-[9px] font-bold text-gray-500">
                  Google
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Use Current Location Button */}
        <button
          onClick={handleUseCurrentLocation}
          className="flex items-center gap-3 p-4 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all hover:border-primary/30"
        >
          <div className="flex items-center justify-center size-10 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-500">
            <span
              className={`material-symbols-outlined ${isLocating ? "animate-spin" : ""}`}
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              {isLocating ? "progress_activity" : "my_location"}
            </span>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-orange-500">
              Use Current Location
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Using GPS
            </p>
          </div>
          <span className="material-symbols-outlined ml-auto text-gray-300 text-sm">
            arrow_forward_ios
          </span>
        </button>

        {/* Separator */}
        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-gray-200 dark:bg-white/5"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Saved Locations
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-white/5"></div>
        </div>

        {/* Address List */}
        <div className="space-y-3">
          {addresses.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/5 p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
              onClick={() => handleSelectAddress(item)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`flex items-center justify-center size-10 rounded-full shrink-0 ${item.id === "1" ? "bg-orange-50 text-orange-500" : "bg-gray-100 dark:bg-white/5 text-gray-500"}`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings:
                        item.icon === "favorite" ? "'FILL' 0" : "'FILL' 0",
                    }}
                  >
                    {item.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="text-sm font-bold text-onyx dark:text-white flex items-center gap-2">
                      {item.label}
                      {editingId === item.id && (
                        <span className="text-[9px] bg-red-100 text-red-600 px-1.5 rounded">
                          Editing
                        </span>
                      )}
                    </h3>
                    {/* Action Buttons */}
                    <div
                      className="flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {editingId === item.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-xs text-red-500 font-bold px-2 py-1 rounded bg-red-50 dark:bg-red-900/20"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-xs text-gray-500 font-bold px-2 py-1 rounded bg-gray-100 dark:bg-white/10"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingId(item.id)}
                          className="text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed truncate pr-4">
                    {item.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Address Form / Button */}
        {isAdding ? (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-primary p-4 shadow-lg animate-in fade-in zoom-in-95 duration-200 mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Confirm Location
            </h3>
            <div className="h-48 w-full mb-4 rounded-xl overflow-hidden shadow-inner">
              <MapComponent
                center={coords}
                onLocationSelect={(lat, lng) => setCoords({ lat, lng })}
              />
            </div>
            <div className="space-y-3">
              <div className="relative">
                <input
                  autoFocus
                  value={newAddress}
                  onChange={(e) => handleConfirmSearchChange(e.target.value)}
                  onFocus={() =>
                    confirmSuggestions.length > 0 &&
                    setShowConfirmSuggestions(true)
                  }
                  placeholder="Enter complete address"
                  className="w-full p-3 bg-gray-50 dark:bg.black/20 rounded-lg text-sm border border-transparent focus:border-primary focus:outline-none pr-8"
                />
                {isConfirmSearching && (
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm animate-spin">
                    progress_activity
                  </span>
                )}

                {showConfirmSuggestions && confirmSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                    {confirmSuggestions.map((s, i) => (
                      <button
                        key={s.placeId}
                        onClick={() => handleSelectConfirmSuggestion(s)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors ${
                          i < confirmSuggestions.length - 1
                            ? "border-b border-gray-100 dark:border-white/5"
                            : ""
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary mt-0.5 text-lg flex-shrink-0">
                          location_on
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-onyx dark:text-white truncate">
                            {s.mainText}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {s.secondaryText}
                          </p>
                        </div>
                      </button>
                    ))}
                    <div className="px-4 py-2 bg-gray-50 dark:bg.black/20 flex items-center justify-end gap-1">
                      <span className="text-[9px] text-gray-400">
                        Powered by
                      </span>
                      <span className="text-[9px] font-bold text-gray-500">
                        Google
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {["Home", "Office", "Other", "Partner", "Gym"].map((lbl) => (
                  <button
                    key={lbl}
                    onClick={() => setNewLabel(lbl)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border transition-colors ${
                      newLabel === lbl
                        ? "bg-primary border-primary text-black"
                        : "bg-transparent border-gray-200 dark:border-white/10 text-gray-500"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAddress}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-black dark:bg-white text-white dark:text-black shadow-md"
                >
                  Save Address
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="group flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-orange-200 dark:border-orange-500/30 hover:border-orange-400 dark:hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all mt-2"
          >
            <span className="material-symbols-outlined text-orange-500 text-lg">
              add_location_alt
            </span>
            <span className="text-sm font-bold text-orange-500">
              Add New Address
            </span>
          </button>
        )}
      </main>

      {/* Error Modal */}
      {errorData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-xs rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-white/10 scale-100 animate-in zoom-in-95 duration-200">
            <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4 text-red-500 mx-auto">
              <span className="material-symbols-outlined">location_off</span>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-onyx dark:text-white mb-2">
                {errorData.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {errorData.message}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg mb-6 text-left">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-[18px] text-gray-400 shrink-0 mt-0.5">
                  info
                </span>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {errorData.help}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setErrorData(null);
                setIsLocating(false);
              }}
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl text-sm active:scale-95 transition-transform"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Background Texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.05] z-0 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
};
