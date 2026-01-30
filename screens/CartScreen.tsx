import React from 'react';
import { AppScreen, NavigationProps } from '../types';

export const CartScreen: React.FC<NavigationProps> = ({ navigateTo, cart, removeFromCart, addToCart, decreaseQuantity, isPremium }) => {
  const subTotal = cart.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);
  const tax = subTotal * 0.05;
  const discount = isPremium ? 250 : 0;
  const total = Math.max(0, subTotal + tax - discount);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-alabaster dark:bg-onyx text-onyx dark:text-alabaster font-display antialiased transition-colors duration-300">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/95 dark:bg-onyx/95 px-6 py-4 backdrop-blur-md transition-colors duration-300">
        <button 
          onClick={() => navigateTo(AppScreen.SERVICE_SELECTION)}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-onyx-light transition-colors hover:bg-gray-200 dark:hover:bg-white hover:text-onyx dark:hover:text-onyx active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
        </button>
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-white/60">Cart</span>
        <div className="h-10 w-10"></div>
      </header>

      <div className="px-6 pt-4 pb-2">
        <h1 className="text-[3rem] font-black leading-none tracking-tighter text-onyx dark:text-alabaster">
          Your<br/><span className="text-primary">Order.</span>
        </h1>
        <p className="mt-2 text-sm text-gray-400 dark:text-white/40 font-medium">{cart.length} service types</p>
      </div>

      <section className="mt-4 px-6 min-h-[200px]">
        {cart.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-12 opacity-50">
             <span className="material-symbols-outlined text-6xl mb-4">remove_shopping_cart</span>
             <p>Your cart is empty</p>
             <button onClick={() => navigateTo(AppScreen.SERVICE_SELECTION)} className="text-primary font-bold mt-4">Browse Services</button>
           </div>
        ) : (
            <div className="space-y-6">
            {cart.map((item) => (
                <div key={item.service.id} className="relative flex items-start gap-4 border-b border-gray-200 dark:border-white/5 pb-6">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-onyx-light border border-gray-200 dark:border-white/5 overflow-hidden">
                        <img src={item.service.image} alt={item.service.title} className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-onyx dark:text-alabaster leading-tight">{item.service.title}</h3>
                                <p className="mt-1 text-xs font-medium text-gray-500 dark:text-white/40">{item.service.duration}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-semibold tracking-tight text-onyx dark:text-white">₹{item.service.price * item.quantity}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                             {/* Quantity Controls */}
                             <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-lg h-8">
                                <button 
                                    onClick={() => decreaseQuantity(item.service)}
                                    className="w-8 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 rounded-l-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">remove</span>
                                </button>
                                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                <button 
                                    onClick={() => addToCart(item.service)}
                                    className="w-8 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 rounded-r-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                </button>
                             </div>

                            <button 
                                onClick={() => removeFromCart(item.service.id)}
                                className="text-xs text-red-500 font-medium hover:underline flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}
      </section>

      {cart.length > 0 && (
          <>
            {isPremium && (
                <section className="px-6 py-6">
                    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-gray-50 to-white dark:from-onyx-light dark:to-[#1a1a1a] p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined fill-current">stars</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-onyx dark:text-white">Use Gold Credit</p>
                            <p className="text-xs text-primary/80">Balance: ₹2500.00</p>
                        </div>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                        <input className="peer sr-only" type="checkbox" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 dark:bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                        </label>
                    </div>
                    </div>
                </section>
            )}

            <section className="px-6 pb-6">
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">Payment Breakdown</h4>
                <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-alabaster/70">
                    <span>Subtotal</span>
                    <span className="font-medium text-onyx dark:text-alabaster">₹{subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-alabaster/70">
                    <span>Taxes & Fees (5%)</span>
                    <span className="font-medium text-onyx dark:text-alabaster">₹{tax.toFixed(2)}</span>
                </div>
                {isPremium && (
                    <div className="flex justify-between text-primary/80">
                        <span>Gold Member Savings</span>
                        <span className="font-medium">-₹{discount.toFixed(2)}</span>
                    </div>
                )}
                </div>
                <div className="my-6 h-px w-full bg-gray-200 dark:bg-white/5"></div>
                <div className="flex items-end justify-between">
                <span className="mb-1 text-sm font-medium text-gray-500 dark:text-white/50">Total Amount</span>
                <span className="text-4xl font-black tracking-tight text-onyx dark:text-white">₹{total.toFixed(2)}</span>
                </div>
            </section>

            <div className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-md mx-auto border-t border-gray-200 dark:border-white/5 bg-white/90 dark:bg-onyx/90 p-6 backdrop-blur-xl transition-colors duration-300">
                <button 
                onClick={() => navigateTo(AppScreen.SLOT_SELECTION)}
                className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-onyx dark:bg-alabaster py-4 transition-all hover:bg-black dark:hover:bg-white active:scale-[0.98]"
                >
                <span className="relative z-10 text-sm font-bold uppercase tracking-widest text-white dark:text-onyx">Select Slot</span>
                <div className="absolute inset-0 -translate-x-full bg-primary opacity-0 transition-transform duration-300 group-hover:translate-x-0 group-hover:opacity-10"></div>
                </button>
                <div className="h-2 w-full"></div>
            </div>
          </>
      )}
    </div>
  );
};