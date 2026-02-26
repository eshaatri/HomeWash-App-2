import React from "react";
import { AppScreen, NavigationProps } from "../types";

export const CheckoutScreen: React.FC<NavigationProps> = ({
  navigateTo,
  cart,
  isPremium,
  onPaymentComplete,
  serviceSlots,
  currentLocation,
  currentLocationLabel,
  selectedArea,
  removeFromCart,
  user,
}) => {
  const [showProfilePopup, setShowProfilePopup] = React.useState(false);
  const [showGatewayPopup, setShowGatewayPopup] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [selectedGateway, setSelectedGateway] = React.useState<string | null>(
    null,
  );

  const [userName, setUserName] = React.useState(
    user?.name === "New User" ? "" : user?.name || "",
  );
  const [userEmail, setUserEmail] = React.useState(user?.email || "");
  const [profileError, setProfileError] = React.useState("");
  const [coverageError, setCoverageError] = React.useState("");

  // If cart is empty, navigate back to home
  React.useEffect(() => {
    if (cart.length === 0) {
      navigateTo(AppScreen.HOME);
    }
  }, [cart, navigateTo]);
  const subTotal = cart.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0,
  );
  const tax = subTotal * 0.05;
  // Updated Discount Logic: 10% off for Premium (Matching CartScreen)
  const discount = isPremium ? subTotal * 0.1 : 0;
  const total = Math.max(0, subTotal + tax - discount);

  const [paymentOption, setPaymentOption] = React.useState<
    "MINIMUM" | "FULL" | "CUSTOM"
  >("MINIMUM");
  const [customInput, setCustomInput] = React.useState<string>(
    (total * 0.3).toFixed(2),
  );

  const minDue = total * 0.3;

  let payableNow = minDue;
  if (paymentOption === "FULL") {
    payableNow = total;
  } else if (paymentOption === "CUSTOM") {
    const val = parseFloat(customInput);
    payableNow = isNaN(val) ? minDue : Math.max(minDue, Math.min(total, val));
  }

  const remainingAmount = Math.max(0, total - payableNow);
  const isCustomError =
    paymentOption === "CUSTOM" && parseFloat(customInput) < minDue;

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-8 bg-alabaster dark:bg-onyx text-onyx dark:text-alabaster font-display antialiased transition-colors duration-300">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/95 dark:bg-onyx/95 px-6 py-6 backdrop-blur-md transition-colors duration-300">
        <button
          onClick={() => navigateTo(AppScreen.SLOT_SELECTION)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-onyx-light text-onyx dark:text-alabaster transition-colors hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "20px" }}
          >
            arrow_back
          </span>
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-white/80">
          Secure Checkout
        </h1>
        <div className="h-10 w-10"></div>
      </header>

      <div className="flex flex-col items-center justify-center py-10">
        <span className="mb-2 text-xs font-bold uppercase tracking-widest text-primary/80">
          Total Payment
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-light tracking-tighter text-onyx dark:text-white">
            ₹{payableNow.toFixed(2)}
          </span>
          {payableNow < total && (
            <span className="text-sm font-bold text-gray-400 dark:text-gray-500 line-through">
              ₹{total.toFixed(2)}
            </span>
          )}
        </div>

        <div className="mt-8 w-full max-w-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-gray-700 dark:text-white/80 self-start">
            Choose an amount to pay
          </h2>

          {/* Minimum Due Option */}
          <button
            onClick={() => setPaymentOption("MINIMUM")}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${paymentOption === "MINIMUM" ? "border-primary bg-primary/5 shadow-md" : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                  Minimum due 30%
                </p>
                <p className="text-xs text-gray-400 dark:text-white/40">
                  Pay Rest at Service
                </p>
              </div>
              <p className="text-lg font-bold text-onyx dark:text-white text-right">
                ₹{minDue.toFixed(2)}
              </p>
            </div>
          </button>

          {/* Pay Full Option */}
          <button
            onClick={() => setPaymentOption("FULL")}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${paymentOption === "FULL" ? "border-primary bg-primary/5 shadow-md" : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                  PAY FULL
                </p>
                <p className="text-xs text-gray-400 dark:text-white/40">
                  Zero balance due
                </p>
              </div>
              <p className="text-lg font-bold text-onyx dark:text-white text-right">
                ₹{total.toFixed(2)}
              </p>
            </div>
          </button>

          <div className="h-px bg-gray-200 dark:bg-white/5 my-2"></div>

          {/* Custom Amount Option */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 dark:text-white/80">
              Or enter a custom amount
            </h3>
            <div
              onClick={() => setPaymentOption("CUSTOM")}
              className={`w-full p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentOption === "CUSTOM" ? "border-primary bg-primary/5 shadow-md" : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"}`}
            >
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Other amount
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-onyx dark:text-white">
                  ₹
                </span>
                <input
                  type="number"
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value);
                    setPaymentOption("CUSTOM");
                  }}
                  className="w-full bg-transparent text-lg font-bold text-onyx dark:text-white focus:outline-none"
                  placeholder="0.00"
                />
              </div>
              {isCustomError && (
                <p className="text-[9px] font-bold text-red-500 mt-2 uppercase tracking-tight italic">
                  Min payment must be at least ₹{minDue.toFixed(2)} (30%)
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 px-3 py-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${payableNow >= total ? "bg-blue-500" : "bg-green-500"}`}
            ></span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-white/60">
              {payableNow >= total
                ? "100% Full Payment"
                : `${((payableNow / total) * 100).toFixed(0)}% Advance Payment`}
            </span>
          </div>
          {payableNow < total && (
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Pay remaining ₹{remainingAmount.toFixed(2)} at service
            </p>
          )}
        </div>
      </div>

      <section className="flex-1 px-6">
        {/* Scheduled Items Summary */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">
              Scheduled Appointments
            </h2>
            <button
              onClick={() => navigateTo(AppScreen.SLOT_SELECTION)}
              className="text-xs font-bold text-primary hover:underline"
            >
              Edit All
            </button>
          </div>

          {cart.map((item, index) => {
            const slot = serviceSlots[item.service.id] || {
              date: "Not Set",
              time: "Not Set",
            };

            return (
              <div
                key={item.service.id}
                className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {/* Number badge */}
                  <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-onyx dark:text-white">
                      {item.service.title}
                      {item.quantity > 1 && (
                        <span className="ml-1 text-primary">
                          x{item.quantity}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="material-symbols-outlined text-[14px] text-primary">
                        event
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {slot.date} @ {slot.time}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.service.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-all active:scale-90"
                  title="Remove Service"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "18px" }}
                  >
                    close
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Service Address */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">
              Service Address
            </h2>
            <button
              onClick={() => navigateTo(AppScreen.ADDRESSES)}
              className="text-xs font-bold text-primary hover:underline"
            >
              Change
            </button>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                location_on
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-onyx dark:text-white truncate">
                {currentLocationLabel}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2">
                {currentLocation}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-onyx dark:text-white">
            Payment Method
          </h2>
          <button className="text-xs font-medium text-primary hover:text-primary-dim transition-colors">
            Manage
          </button>
        </div>
        <div className="space-y-3">
          <label className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-primary/40 bg-white dark:bg-[#161618] p-5 shadow-[0_4px_20px_-10px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.15)] dark:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)] transition-all hover:bg-gray-50 dark:hover:bg-[#1a1a1d]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-14 items-center justify-center rounded bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white/90 shadow-inner">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "24px" }}
                  >
                    credit_card
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-onyx dark:text-white">
                    Saved Card
                  </p>
                  <p className="text-xs text-gray-500 dark:text-white/40 font-mono tracking-wide">
                    Ending in 4242
                  </p>
                </div>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-primary bg-primary shadow-[0_0_10px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.3)]">
                <div className="h-2 w-2 rounded-full bg-white dark:bg-onyx"></div>
              </div>
            </div>
          </label>

          <label className="group relative flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-onyx-light p-5 transition-all hover:border-gray-300 dark:hover:border-white/10 hover:bg-gray-100 dark:hover:bg-[#202022]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-14 items-center justify-center rounded bg-white dark:bg-white/5 text-gray-500 dark:text-white/60">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "22px" }}
                >
                  account_balance_wallet
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-white/80 group-hover:text-black dark:group-hover:text-white">
                  UPI
                </p>
                <p className="text-xs text-gray-500 dark:text-white/40">
                  GooglePay, PhonePe
                </p>
              </div>
            </div>
            <div className="h-5 w-5 rounded-full border border-gray-300 dark:border-white/10 group-hover:border-gray-400 dark:group-hover:border-white/30"></div>
          </label>

          <label className="group relative flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-onyx-light p-5 transition-all hover:border-gray-300 dark:hover:border-white/10 hover:bg-gray-100 dark:hover:bg-[#202022]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-14 items-center justify-center rounded bg-black border border-white/5 text-white">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  phone_iphone
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-white/80 group-hover:text-black dark:group-hover:text-white">
                  Apple Pay
                </p>
                <p className="text-xs text-gray-500 dark:text-white/40">
                  Default Wallet
                </p>
              </div>
            </div>
            <div className="h-5 w-5 rounded-full border border-gray-300 dark:border-white/10 group-hover:border-gray-400 dark:group-hover:border-white/30"></div>
          </label>
        </div>
      </section>

      <div className="mt-auto px-6 pt-8">
        <div className="mb-6 flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 border border-primary/10">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: "14px" }}
            >
              lock
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Secure Checkout
            </span>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-white/30">
            256-bit SSL Encrypted Transaction
          </p>
        </div>
        {coverageError && (
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-500/10 p-4 border border-red-100 dark:border-red-500/20 animate-in slide-in-from-top-2">
            <span className="material-symbols-outlined text-red-500">
              warning
            </span>
            <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-tight">
              {coverageError}
            </p>
          </div>
        )}
        <button
          onClick={() => {
            if (!selectedArea) {
              setCoverageError(
                "Area not covered. We don't serve this location yet.",
              );
              return;
            }
            setCoverageError("");
            if (!userName || userName === "New User") {
              setShowProfilePopup(true);
            } else {
              setIsProcessing(true);
              setTimeout(() => {
                setIsProcessing(false);
                onPaymentComplete({ name: userName, email: userEmail });
              }, 2000);
            }
          }}
          disabled={isCustomError || isProcessing}
          className={`group relative w-full overflow-hidden rounded-lg py-4 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] transition-transform active:scale-[0.98] ${isCustomError || isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-onyx dark:bg-white"}`}
        >
          <span
            className={`relative z-10 text-base font-bold ${isCustomError || isProcessing ? "text-white" : "text-white dark:text-onyx"}`}
          >
            {isProcessing
              ? "Processing..."
              : payableNow >= total
                ? `Pay Full ₹${total.toFixed(2)}`
                : `Pay ₹${payableNow.toFixed(2)}`}
          </span>
          {!isCustomError && !isProcessing && (
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-gray-200/50 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
          )}
        </button>
        <div className="mt-6 flex justify-center gap-4 grayscale opacity-20">
          <div className="h-4 w-7 rounded bg-black dark:bg-white"></div>
          <div className="h-4 w-7 rounded bg-black dark:bg-white"></div>
          <div className="h-4 w-7 rounded bg-black dark:bg-white"></div>
        </div>
      </div>

      {/* Profile Completion Popup */}
      {showProfilePopup && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-onyx rounded-t-[32px] p-8 animate-in slide-in-from-bottom duration-500">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-onyx dark:text-white">
                Complete your profile
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                We need your details to proceed with the booking.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {profileError && (
                <p className="text-[10px] font-bold text-red-500 uppercase italic">
                  {profileError}
                </p>
              )}

              <button
                onClick={() => {
                  if (!selectedArea) {
                    setProfileError("Area not covered. Please change address.");
                    return;
                  }
                  if (!userName.trim()) {
                    setProfileError("Full name is mandatory");
                    return;
                  }
                  setShowProfilePopup(false);
                  setIsProcessing(true);
                  setTimeout(() => {
                    setIsProcessing(false);
                    onPaymentComplete({ name: userName, email: userEmail });
                  }, 2000);
                }}
                className="w-full h-12 bg-black dark:bg-white text-white dark:text-onyx font-bold rounded-xl active:scale-95 transition-transform"
              >
                Save & Continue
              </button>
              <button
                onClick={() => setShowProfilePopup(false)}
                className="w-full h-12 bg-transparent text-gray-500 font-bold rounded-xl"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Removed Gateway Popup as per user request */}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-white dark:bg-black text-center p-8">
          <div className="relative h-24 w-24 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">
                payments
              </span>
            </div>
          </div>
          <h3 className="text-xl font-bold dark:text-white">
            Securely processing your payment...
          </h3>
          <p className="text-gray-500 mt-2">
            Please do not refresh or press back button
          </p>
        </div>
      )}
    </div>
  );
};
