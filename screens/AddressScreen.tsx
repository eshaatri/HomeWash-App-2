import React, { useState } from 'react';
import { AppScreen, NavigationProps } from '../types';

interface AddressItem {
  id: string;
  label: string;
  address: string;
  icon: string;
  type: 'HOME' | 'WORK' | 'OTHER';
}

const ALLOWED_CITIES = ['mumbai', 'pune', 'lucknow', 'jaipur'];

export const AddressScreen: React.FC<NavigationProps> = ({ navigateTo, isPremium, setCurrentLocation }) => {
  // State for addresses - matching screenshot data
  const [addresses, setAddresses] = useState<AddressItem[]>([
    { id: '1', label: 'Home', address: 'Flat 402, Oberoi Springs, Mumbai', icon: 'home', type: 'HOME' },
    { id: '2', label: 'Office', address: 'WeWork Galaxy, Bangalore', icon: 'work', type: 'WORK' },
    { id: '3', label: "Parents' Home", address: 'Defense Colony, New Delhi', icon: 'favorite', type: 'OTHER' }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('Home');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // New State for Error Modal
  const [errorData, setErrorData] = useState<{title: string, message: string, help: string} | null>(null);

  const checkCoverage = (address: string): boolean => {
    const lowerAddr = address.toLowerCase();
    return ALLOWED_CITIES.some(city => lowerAddr.includes(city));
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setErrorData(null);
    
    if (!navigator.geolocation) {
      setErrorData({
          title: "Not Supported",
          message: "Geolocation is not supported by your browser.",
          help: "Please use a different browser or enter your address manually."
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
            // Real reverse geocoding request
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            
            if (data && data.address) {
                // Prioritize specific address parts for a clean display
                const suburb = data.address.suburb || data.address.neighbourhood || data.address.residential;
                const city = data.address.city || data.address.town || data.address.state_district;
                const postcode = data.address.postcode;
                
                let formatted = 'Unknown Location';
                if (suburb && city) {
                    formatted = `${suburb}, ${city}`;
                } else if (city) {
                        formatted = city;
                } else if (data.display_name) {
                    formatted = data.display_name.split(',').slice(0, 2).join(',');
                }
                
                if (postcode && formatted.length < 25) {
                    formatted += ` ${postcode}`;
                }

                if (!checkCoverage(formatted) && !checkCoverage(JSON.stringify(data.address))) {
                    setErrorData({
                        title: "Area Not Serviceable",
                        message: "We currently do not operate in this detected location.",
                        help: "Our services are currently available in Mumbai, Pune, Lucknow, and Jaipur."
                    });
                    setIsLocating(false);
                    return;
                }
                
                setCurrentLocation(formatted, 'Current Location');
                navigateTo(AppScreen.HOME);
            } else {
                // Fallback to coordinates if address lookup fails
                const coordString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                // We cannot verify coverage for coordinates only, so we block it based on requirements
                setErrorData({
                    title: "Location Unidentified",
                    message: "We could not verify the city of your location.",
                    help: "Please enter your address manually to ensure we serve your area."
                });
                setIsLocating(false);
            }
        } catch (error) {
            console.error("Geocoding failed:", error);
            setErrorData({
                title: "Network Error",
                message: "Unable to fetch location details.",
                help: "Please check your internet connection or enter address manually."
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
                help = "Please enable location permissions in your browser settings (look for the lock icon in the URL bar).";
                break;
            case error.POSITION_UNAVAILABLE:
                title = "Location Unavailable";
                message = "Your device could not determine your current location.";
                help = "Please ensure your GPS is enabled and you have a clear view of the sky, or try connecting to Wi-Fi.";
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
          maximumAge: 0 
      }
    );
  };

  const handleSelectAddress = (item: AddressItem) => {
      if (!editingId) {
          setCurrentLocation(item.address, item.label);
          navigateTo(AppScreen.HOME);
      }
  };

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      if (!checkCoverage(newAddress)) {
        setErrorData({
            title: "Area Not Serviceable",
            message: "The address entered is outside our service area.",
            help: "Our services are currently available in Mumbai, Pune, Lucknow, and Jaipur."
        });
        return;
      }

      const newItem: AddressItem = {
        id: Date.now().toString(),
        label: newLabel,
        address: newAddress,
        icon: newLabel === 'Home' ? 'home' : newLabel === 'Office' ? 'work' : 'location_on',
        type: newLabel === 'Home' ? 'HOME' : newLabel === 'Office' ? 'WORK' : 'OTHER'
      };
      setAddresses([...addresses, newItem]);
      setIsAdding(false);
      setNewAddress('');
    }
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  return (
    <div className="bg-[#f8f7f6] dark:bg-[#121212] min-h-screen flex flex-col font-display antialiased transition-colors duration-300 relative">
      
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[#f8f7f6]/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <button 
          onClick={() => navigateTo(AppScreen.HOME)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-onyx dark:text-white">arrow_back</span>
        </button>
        <h1 className="text-base font-bold text-onyx dark:text-white tracking-wide">Addresses</h1>
        <button 
          onClick={() => navigateTo(AppScreen.SUPPORT)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-onyx dark:text-white">help_outline</span>
        </button>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 flex flex-col gap-4">
        
        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input 
            type="text" 
            placeholder="Search for area, street name..." 
            className="w-full h-12 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 pl-11 pr-4 text-sm font-medium text-onyx dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
          />
        </div>

        {/* Use Current Location Button */}
        <button 
          onClick={handleUseCurrentLocation}
          className="flex items-center gap-3 p-4 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all hover:border-primary/30"
        >
          <div className="flex items-center justify-center size-10 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-500">
            <span className={`material-symbols-outlined ${isLocating ? 'animate-spin' : ''}`} style={{fontVariationSettings: "'FILL' 0"}}>
              {isLocating ? 'progress_activity' : 'my_location'}
            </span>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-orange-500">Use Current Location</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">Using GPS</p>
          </div>
          <span className="material-symbols-outlined ml-auto text-gray-300 text-sm">arrow_forward_ios</span>
        </button>

        {/* Separator */}
        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-gray-200 dark:bg-white/5"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Saved Locations</span>
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
                <div className={`flex items-center justify-center size-10 rounded-full shrink-0 ${item.id === '1' ? 'bg-orange-50 text-orange-500' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: item.icon === 'favorite' ? "'FILL' 0" : "'FILL' 0" }}>{item.icon}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="text-sm font-bold text-onyx dark:text-white flex items-center gap-2">
                      {item.label}
                      {editingId === item.id && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 rounded">Editing</span>}
                    </h3>
                    {/* Action Buttons */}
                    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                       {editingId === item.id ? (
                         <div className="flex gap-2">
                            <button onClick={() => handleDelete(item.id)} className="text-xs text-red-500 font-bold px-2 py-1 rounded bg-red-50 dark:bg-red-900/20">Delete</button>
                            <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 font-bold px-2 py-1 rounded bg-gray-100 dark:bg-white/10">Done</button>
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
             <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">New Location</h3>
             <div className="space-y-3">
                <input 
                  autoFocus
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Enter complete address"
                  className="w-full p-3 bg-gray-50 dark:bg-black/20 rounded-lg text-sm border border-transparent focus:border-primary focus:outline-none"
                />
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                   {['Home', 'Office', 'Other', 'Partner', 'Gym'].map(lbl => (
                      <button 
                        key={lbl}
                        onClick={() => setNewLabel(lbl)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border transition-colors ${
                           newLabel === lbl 
                           ? 'bg-primary border-primary text-black' 
                           : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-500'
                        }`}
                      >
                        {lbl}
                      </button>
                   ))}
                </div>
                <div className="flex gap-3 mt-2">
                   <button onClick={() => setIsAdding(false)} className="flex-1 py-2.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5">Cancel</button>
                   <button onClick={handleAddAddress} className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-black dark:bg-white text-white dark:text-black shadow-md">Save Address</button>
                </div>
             </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="group flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-orange-200 dark:border-orange-500/30 hover:border-orange-400 dark:hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all mt-2"
          >
            <span className="material-symbols-outlined text-orange-500 text-lg">add_location_alt</span>
            <span className="text-sm font-bold text-orange-500">Add New Address</span>
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
                      <h3 className="text-lg font-bold text-onyx dark:text-white mb-2">{errorData.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{errorData.message}</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg mb-6 text-left">
                      <div className="flex gap-3">
                          <span className="material-symbols-outlined text-[18px] text-gray-400 shrink-0 mt-0.5">info</span>
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
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.05] z-0 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
    </div>
  );
};