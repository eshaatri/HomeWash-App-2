import React, { useState } from 'react';
import { AppScreen, NavigationProps, UserRole } from '../types';

export const LoginScreen: React.FC<NavigationProps> = ({ login }) => {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = () => {
    if (phone.length > 3) {
      setStep('OTP');
    }
  };

  const handleVerify = () => {
    if (otp === '1234') {
      login(phone, UserRole.CUSTOMER);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white p-6 items-center justify-center font-display transition-colors duration-300">
        {/* Main Content Container */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
            
            {/* Logo Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black tracking-tighter text-black">
                    HOME<span className="text-primary">WASH</span>
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-2">
                    Luxury Home Services
                </p>
            </div>

            {/* Form Section */}
            <div className="w-full space-y-6">
                {step === 'PHONE' ? (
                    <>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                Phone Number
                            </label>
                            <div className="flex items-center bg-transparent border-b border-gray-200 h-12 transition-colors focus-within:border-primary">
                                <span className="text-base font-bold text-gray-400 mr-4 select-none">+91</span>
                                <input 
                                    type="tel" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-transparent text-lg font-bold text-black placeholder-gray-300 focus:outline-none"
                                    placeholder="00000 00000"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleSendOtp}
                            className="w-full bg-black text-white font-bold h-12 rounded-lg text-sm active:scale-[0.98] transition-transform hover:opacity-90"
                        >
                            Get Verification Code
                        </button>
                    </>
                ) : (
                    <>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                Enter Code
                            </label>
                            <div className="flex items-center bg-transparent border-b border-gray-200 h-12 transition-colors focus-within:border-primary">
                                <input 
                                    type="text" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-transparent text-lg font-bold text-center tracking-[0.5em] text-black placeholder-gray-300 focus:outline-none"
                                    placeholder="0000"
                                    maxLength={4}
                                />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <button onClick={() => setStep('PHONE')} className="text-xs font-bold text-gray-400 hover:text-primary">Change Number</button>
                                <span className="text-xs text-gray-500">Code: 1234</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleVerify}
                            className="w-full bg-primary text-black font-bold h-12 rounded-lg text-sm active:scale-[0.98] transition-transform hover:brightness-110"
                        >
                            Verify & Login
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
  );
};