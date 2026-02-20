import React, { useState, useEffect } from "react";
import { AppScreen, NavigationProps, Service } from "../types";

interface ConfigOption {
  id: string;
  label: string;
  price: number;
  description?: string;
}

interface BathroomOption {
  count: number;
  label: string;
  price: number;
  originalPrice: number;
}

import { pricingService } from "../src/services/api";

export const ServiceDetailScreen: React.FC<NavigationProps> = ({
  navigateTo,
  selectedService,
  addToCart,
  selectedArea,
}) => {
  if (!selectedService) return null;

  const [resolvedBasePrice, setResolvedBasePrice] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const resolve = async () => {
      if (!selectedArea || !selectedService) return;
      try {
        const res = await pricingService.resolvePrice(
          selectedService.id,
          selectedArea,
        );
        setResolvedBasePrice(res.finalPrice);
      } catch (e) {
        console.error("Detail price resolution failed:", e);
        setResolvedBasePrice(selectedService.price);
      }
    };
    resolve();
  }, [selectedArea, selectedService]);

  // Determine if we are in the Bathroom cleaning mode
  const isBathroomService = selectedService.id === "s_bath_intense";

  // --- Mock Configuration Data ---
  const SIZES: ConfigOption[] = [
    { id: "1bhk", label: "1 BHK", price: 3499 },
    { id: "2bhk", label: "2 BHK", price: 3899 },
    { id: "3bhk", label: "3 BHK", price: 4799 },
    { id: "4bhk", label: "4 BHK", price: 5699 },
    { id: "5bhk", label: "5 BHK", price: 6599 },
  ];

  const KITCHEN_OPTS: ConfigOption[] = [
    { id: "ext", label: "Cabinet exterior & stove", price: 0 },
    {
      id: "int",
      label: "Cabinet interior with utensil arrangement",
      price: 499,
    },
    { id: "chim", label: "Chimney", price: 399 },
  ];

  const SOFA_OPTS: ConfigOption[] = [
    {
      id: "dry",
      label: "Dry vacuuming",
      price: 0,
      description: "Basic dust removal",
    },
    {
      id: "mat",
      label: "Mattress shampoo",
      price: 439,
      description: "per bed",
    },
    {
      id: "wet_34",
      label: "Sofa wet shampoo",
      price: 449,
      description: "3/4 seater",
    },
    {
      id: "wet_56",
      label: "Sofa wet shampoo",
      price: 649,
      description: "5/6 seater",
    },
    {
      id: "wet_7plus",
      label: "Sofa wet shampoo",
      price: 849,
      description: "7+ seater",
    },
  ];

  const BATHROOM_OPTS: BathroomOption[] = [
    { count: 1, label: "1 Bathroom", price: 424, originalPrice: 499 },
    { count: 2, label: "2 Bathrooms", price: 848, originalPrice: 998 },
    { count: 3, label: "3 Bathrooms", price: 1272, originalPrice: 1497 },
    { count: 4, label: "4 Bathrooms", price: 1696, originalPrice: 1996 },
    { count: 5, label: "5 Bathrooms", price: 2120, originalPrice: 2495 },
    { count: 6, label: "6 Bathrooms", price: 2544, originalPrice: 2994 },
  ];

  const INCLUDED_ITEMS = [
    {
      label: "Room floor scrubbing",
      image:
        "https://images.unsplash.com/photo-1581578731117-104f2a412c54?auto=format&fit=crop&q=80&w=300",
    },
    {
      label: "Cabinets & furniture exterior wiping",
      image:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=300",
    },
    {
      label: "Ceiling & fan dusting",
      image:
        "https://images.unsplash.com/photo-1632984589945-883a45c61335?auto=format&fit=crop&q=80&w=300",
    },
    {
      label: "Sofa* & mattress*",
      image:
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=300",
    },
    {
      label: "Doors, windows & mirrors",
      image:
        "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=300",
    },
    {
      label: "Switch board & fixtures",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=300",
    },
    {
      label: "Kitchen sink area, tiles & slabs",
      image:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300",
    },
    {
      label: "Stove & kitchen appliances*",
      image:
        "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=300",
    },
    {
      label: "Cabinet exterior & interior*",
      image:
        "https://images.unsplash.com/photo-1556912173-3db496beee71?auto=format&fit=crop&q=80&w=300",
    },
    {
      label: "Bathroom floor scrubbing",
      image:
        "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=300",
    },
    {
      label: "Toilet seat & fixtures",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300",
    },
    {
      label: "Balcony",
      image:
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=300",
    },
  ];

  const NEEDED_ITEMS = [
    { label: "Bucket & water", icon: "water_drop" },
    { label: "Power point", icon: "power" },
    { label: "Ladder or Stool", icon: "ladder" },
  ];

  const EXCLUDED_ITEMS = [
    "Glue/paint stains/sticker removal",
    "Cleaning of terrace & inaccessible areas",
    "Wet wiping of walls & ceiling",
  ];

  const EQUIPMENTS = [
    {
      label: "Floor scrubbing machine",
      image:
        "https://images.unsplash.com/photo-1581578731117-104f2a412c54?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Dry & wet vacuum cleaner",
      image:
        "https://images.unsplash.com/photo-1558317374-a354d5f6d4da?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Hand scrubber",
      image:
        "https://images.unsplash.com/photo-1585664811087-47f65f68c34b?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Different type of attachments",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Microfibre cloths",
      image:
        "https://images.unsplash.com/photo-1516766453986-e8d19760775d?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Sponge",
      image:
        "https://images.unsplash.com/photo-1533561052604-c3be19d755f7?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Cleaning solutions",
      image:
        "https://images.unsplash.com/photo-1628191010210-a59de33e5941?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Grout brushes",
      image:
        "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Wiper",
      image:
        "https://images.unsplash.com/photo-1517154238510-720610f43887?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Dusting broomstick",
      image:
        "https://images.unsplash.com/photo-1585514022832-6a161f36473e?auto=format&fit=crop&q=80&w=200",
    },
  ];

  const BATHROOM_EQUIPMENTS = [
    {
      label: "Buffing machine",
      image:
        "https://images.unsplash.com/photo-1581578731117-104f2a412c54?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Microfibre cloths",
      image:
        "https://images.unsplash.com/photo-1516766453986-e8d19760775d?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Sponge",
      image:
        "https://images.unsplash.com/photo-1533561052604-c3be19d755f7?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Cleaning solutions",
      image:
        "https://images.unsplash.com/photo-1628191010210-a59de33e5941?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Fine brushes",
      image:
        "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=200",
    },
    {
      label: "Wiper",
      image:
        "https://images.unsplash.com/photo-1517154238510-720610f43887?auto=format&fit=crop&q=80&w=200",
    },
  ];

  // --- State ---
  const [selectedSize, setSelectedSize] = useState<ConfigOption>(SIZES[0]);
  const [kitchenSelection, setKitchenSelection] = useState<string>("ext"); // ID of selected kitchen opt
  const [addOns, setAddOns] = useState<Record<string, number>>({ dry: 1 }); // Default dry vacuuming

  // State for Bathroom Flow
  const [selectedBathroomOption, setSelectedBathroomOption] =
    useState<BathroomOption>(BATHROOM_OPTS[0]);

  // Total Calculation
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const base = resolvedBasePrice ?? selectedService.price;
    if (isBathroomService) {
      setTotalPrice(base); // Assuming base resolves to the first option or base price
    } else {
      let total = base;

      // Add Kitchen Price
      const kOpt = KITCHEN_OPTS.find((k) => k.id === kitchenSelection);
      if (kOpt) total += kOpt.price;

      // Add Add-ons
      Object.entries(addOns).forEach(([id, qty]) => {
        const opt = SOFA_OPTS.find((o) => o.id === id);
        if (opt) total += opt.price * Number(qty);
      });

      setTotalPrice(total);
    }
  }, [
    selectedService,
    resolvedBasePrice,
    kitchenSelection,
    addOns,
    selectedBathroomOption,
    isBathroomService,
  ]);

  // --- Handlers ---
  const handleAddOnToggle = (id: string) => {
    setAddOns((prev) => {
      const current = prev[id] || 0;
      const newQty = current > 0 ? 0 : 1;
      return { ...prev, [id]: newQty };
    });
  };

  const incrementAddOn = (id: string) => {
    setAddOns((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrementAddOn = (id: string) => {
    setAddOns((prev) => {
      const current = prev[id] || 0;
      if (current <= 0) return prev;
      return { ...prev, [id]: current - 1 };
    });
  };

  const handleDone = () => {
    let customTitle = "";

    if (isBathroomService) {
      customTitle = `${selectedService.title} (${selectedBathroomOption.label})`;
    } else {
      customTitle = `${selectedService.title} (${selectedSize.label})`;
    }

    const finalService: Service = {
      ...selectedService,
      id: `${selectedService.id}_${Date.now()}`, // Unique ID for cart
      title: customTitle,
      price: totalPrice,
    };

    addToCart(finalService);
    navigateTo(AppScreen.CART);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#050505] font-display text-onyx dark:text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-[#121212] flex items-center justify-between p-4 shadow-sm border-b border-gray-100 dark:border-white/5">
        <button
          onClick={() => navigateTo(AppScreen.SERVICE_SELECTION)}
          className="material-symbols-outlined"
        >
          arrow_back
        </button>
        <div className="flex-1 text-center pr-6">
          <h1 className="font-bold text-lg truncate">
            {selectedService.title}
          </h1>
        </div>
        <button
          onClick={() => navigateTo(AppScreen.HOME)}
          className="material-symbols-outlined text-gray-400"
        >
          close
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Intro */}
        <div>
          <h2 className="text-xl font-black">{selectedService.title}</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="material-symbols-outlined text-sm text-[#7c3aed] fill-1"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
              4.80 (4.3M reviews)
            </span>
          </div>
          {isBathroomService && (
            <div className="flex items-center gap-1.5 mt-2 text-[#16a34a]">
              <span
                className="material-symbols-outlined text-[14px] rotate-90"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_offer
              </span>
              <span className="text-xs font-bold">
                Add more & save up to 15%
              </span>
            </div>
          )}
        </div>

        <div className="h-px bg-gray-200 dark:bg-white/10 w-full"></div>

        {/* Conditional Main Configuration Area */}
        {isBathroomService ? (
          <div className="space-y-4">
            {/* Horizontal Scroll for Bathrooms */}
            <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 snap-x">
              {BATHROOM_OPTS.map((opt) => {
                const isSelected = selectedBathroomOption.count === opt.count;

                return (
                  <div
                    key={opt.count}
                    className={`snap-start min-w-[160px] w-[160px] p-4 rounded-2xl border shrink-0 flex flex-col justify-between h-[180px] bg-white dark:bg-[#1a1a1a] transition-all duration-300 ${
                      isSelected
                        ? "border-[#9333EA] ring-1 ring-[#9333EA] shadow-lg shadow-purple-500/10"
                        : "border-gray-200 dark:border-white/10"
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">{opt.label}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">₹{opt.price}</span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{opt.originalPrice}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500">
                        (₹{Math.round(opt.price / opt.count)}/bathroom)
                      </p>
                      <p className="text-[10px] font-bold text-[#16a34a] mt-1">
                        15% off
                      </p>
                    </div>

                    {isSelected ? (
                      <div className="flex items-center justify-between bg-[#F3E8FF] dark:bg-[#9333EA]/20 rounded-lg h-9 px-1">
                        <button className="w-8 flex items-center justify-center text-[#9333EA] opacity-50 cursor-default">
                          <span className="material-symbols-outlined text-sm font-bold">
                            remove
                          </span>
                        </button>
                        <span className="text-sm font-bold text-[#9333EA]">
                          1
                        </span>
                        <button className="w-8 flex items-center justify-center text-[#9333EA] opacity-50 cursor-default">
                          <span className="material-symbols-outlined text-sm font-bold">
                            add
                          </span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedBathroomOption(opt)}
                        className="w-full h-9 bg-white dark:bg-[#1a1a1a] text-[#7c3aed] border border-[#7c3aed]/30 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-[#7c3aed]/5 active:scale-95 transition-all"
                      >
                        Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-black">Select requirements</h3>

            {/* Section 1: Size of home */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 dark:bg-white/10 h-6 w-6 flex items-center justify-center rounded text-xs font-bold text-gray-500">
                  1
                </div>
                <h4 className="font-bold text-sm">Size of home*</h4>
              </div>

              <div className="grid grid-cols-2 gap-3 pl-10">
                {SIZES.map((size) => {
                  const isSelected = selectedSize.id === size.id;
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-[#F3E8FF] border-[#9333EA] dark:bg-[#9333EA]/20 dark:border-[#9333EA]"
                          : "bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10"
                      }`}
                    >
                      <div className="font-bold text-sm mb-1">{size.label}</div>
                      <div className="text-xs font-medium opacity-70">
                        ₹{size.price.toLocaleString()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-white/10 w-full"></div>

            {/* Section 2: Kitchen */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 dark:bg-white/10 h-6 w-6 flex items-center justify-center rounded text-xs font-bold text-gray-500">
                    2
                  </div>
                  <h4 className="font-bold text-sm">
                    Kitchen cabinets & appliances*
                  </h4>
                </div>
                <span className="material-symbols-outlined text-gray-400 text-sm">
                  keyboard_arrow_down
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-4 pl-10 -mr-4 pr-4 snap-x">
                {KITCHEN_OPTS.map((opt) => {
                  const isSelected = kitchenSelection === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setKitchenSelection(opt.id)}
                      className={`snap-start min-w-[140px] w-[140px] text-left p-3 rounded-xl border shrink-0 flex flex-col justify-between h-[100px] transition-all ${
                        isSelected
                          ? "bg-[#F3E8FF] border-[#9333EA] dark:bg-[#9333EA]/20 dark:border-[#9333EA]"
                          : "bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10"
                      }`}
                    >
                      <div className="font-bold text-xs leading-tight">
                        {opt.label}
                      </div>
                      <div className="text-xs font-bold">₹{opt.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-white/10 w-full"></div>

            {/* Section 3: Sofa */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 dark:bg-white/10 h-6 w-6 flex items-center justify-center rounded text-xs font-bold text-gray-500">
                    3
                  </div>
                  <h4 className="font-bold text-sm">Sofa & mattress*</h4>
                </div>
                <span className="material-symbols-outlined text-gray-400 text-sm">
                  keyboard_arrow_up
                </span>
              </div>

              {/* Updated Horizontal Scroll Container: Negative Margin Right for full bleed */}
              <div className="flex gap-3 overflow-x-auto pb-4 pl-10 -mr-4 pr-4 snap-x">
                {SOFA_OPTS.map((opt) => {
                  const qty = addOns[opt.id] || 0;
                  const hasQty = qty > 0;

                  return (
                    <div
                      key={opt.id}
                      className={`snap-start min-w-[150px] w-[150px] p-3 rounded-xl border shrink-0 flex flex-col justify-between h-[140px] bg-white dark:bg-[#1a1a1a] ${
                        hasQty
                          ? "border-[#9333EA] ring-1 ring-[#9333EA]"
                          : "border-gray-200 dark:border-white/10"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm mb-1 leading-tight line-clamp-2">
                          {opt.label}
                        </div>
                        {opt.description && (
                          <div className="text-[10px] text-gray-500 mb-2 truncate">
                            ({opt.description})
                          </div>
                        )}
                        <div className="text-sm font-bold">₹{opt.price}</div>
                      </div>

                      <div className="mt-2">
                        {qty === 0 ? (
                          <button
                            onClick={() => handleAddOnToggle(opt.id)}
                            className="w-full py-1.5 rounded-lg text-xs font-bold text-[#9333EA] border border-[#9333EA]/30 hover:bg-[#9333EA]/5"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-[#F3E8FF] dark:bg-[#9333EA]/20 rounded-lg h-8 px-1">
                            <button
                              onClick={() => decrementAddOn(opt.id)}
                              className="w-8 flex items-center justify-center text-[#9333EA]"
                            >
                              <span className="material-symbols-outlined text-sm font-bold">
                                remove
                              </span>
                            </button>
                            <span className="text-xs font-bold text-[#9333EA]">
                              {qty}
                            </span>
                            <button
                              onClick={() => incrementAddOn(opt.id)}
                              className="w-8 flex items-center justify-center text-[#9333EA]"
                            >
                              <span className="material-symbols-outlined text-sm font-bold">
                                add
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="pl-10 text-xs font-bold underline decoration-dotted text-gray-500">
                How is sofa & mattress cleaning done?
              </button>
            </div>

            <div className="h-px bg-gray-200 dark:bg-white/10 w-full"></div>

            {/* Section 4: Extra */}
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 dark:bg-white/10 h-6 w-6 flex items-center justify-center rounded text-xs font-bold text-gray-500">
                  4
                </div>
                <h4 className="font-bold text-sm">Extra room/area</h4>
              </div>
              <span className="material-symbols-outlined text-gray-400 text-sm">
                keyboard_arrow_down
              </span>
            </div>
          </>
        )}

        {/* Info Sections - Conditionally hidden for Bathroom Intense */}
        {!isBathroomService && (
          <>
            <div className="h-px bg-gray-200 dark:bg-white/10 w-full"></div>

            {/* What is included Section */}
            <div>
              <h3 className="text-xl font-black mb-6">What is included</h3>
              <div className="grid grid-cols-3 gap-3">
                {INCLUDED_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden flex flex-col h-36 shadow-sm"
                  >
                    <div className="p-3 pb-0 flex-1">
                      <p className="text-[11px] font-bold leading-tight text-onyx dark:text-gray-200 line-clamp-3">
                        {item.label}
                      </p>
                    </div>
                    <div className="h-16 w-full relative">
                      <img
                        src={item.image}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-white/10 w-full"></div>

            {/* What is excluded? */}
            <div className="space-y-4">
              <h3 className="text-xl font-black">What is excluded?</h3>
              <div className="space-y-3">
                {EXCLUDED_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-red-500 text-lg">
                      close
                    </span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-white/10 w-full"></div>

            {/* What we will need from you */}
            <div className="space-y-4">
              <h3 className="text-xl font-black">What we will need from you</h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x">
                {NEEDED_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="snap-start min-w-[120px] bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 border border-gray-100 dark:border-white/5"
                  >
                    <span className="material-symbols-outlined text-3xl text-gray-700 dark:text-gray-300">
                      {item.icon}
                    </span>
                    <span className="text-xs font-bold leading-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="h-px bg-gray-200 dark:bg-white/10 w-full"></div>

        {/* Our cleaning equipments - Enhanced with specific bathroom list and grid */}
        <div className="space-y-4">
          <h3 className="text-xl font-black">Our cleaning equipments</h3>
          <div
            className={`grid ${isBathroomService ? "grid-cols-3" : "grid-cols-2"} gap-4`}
          >
            {(isBathroomService ? BATHROOM_EQUIPMENTS : EQUIPMENTS).map(
              (item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center gap-2"
                >
                  <div className="w-full aspect-square bg-white dark:bg-[#1a1a1a] rounded-xl p-4 flex items-center justify-center border border-gray-100 dark:border-white/5 shadow-sm">
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {item.label}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Spacer for bottom bar */}
        <div className="h-10"></div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-white/10 p-4 flex items-center justify-between z-50">
        <div className="font-black text-xl">₹{totalPrice.toLocaleString()}</div>
        <button
          onClick={handleDone}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-10 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-purple-500/30"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};
