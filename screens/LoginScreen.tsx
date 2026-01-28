import React, { useState } from 'react';
import { AppScreen, NavigationProps, UserRole } from '../types';

export const LoginScreen: React.FC<NavigationProps> = ({ login }) => {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isPartnerMode, setIsPartnerMode] = useState(false);

  const handleSendOtp = () => {
    if (phone.length > 3) {
      setStep('OTP');
    }
  };

  const handleVerify = () => {
    if (otp === '1234') {
      login(phone, isPartnerMode ? UserRole.PARTNER : UserRole.CUSTOMER);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black p-6 items-center justify-center font-display">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black text-onyx dark:text-white mb-2">
            HOME<span className="text-primary">WASH</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isPartnerMode ? 'Partner App' : 'Luxury Home Services'}
          </p>
        </div>

        {step === 'PHONE' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
              <div className="flex items-center border-b-2 border-gray-200 dark:border-white/20 pb-2">
                <span className="text-lg font-medium text-gray-400 mr-3">+1</span>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold text-onyx dark:text-white focus:outline-none"
                  placeholder="000 000 0000"
                />
              </div>
            </div>
            <button 
              onClick={handleSendOtp}
              className="w-full bg-onyx dark:bg-white text-white dark:text-black font-bold h-12 rounded-lg"
            >
              Get Verification Code
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Enter OTP</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-transparent border-b-2 border-gray-200 dark:border-white/20 pb-2 text-3xl font-bold text-center tracking-[0.5em] text-onyx dark:text-white focus:outline-none focus:border-primary"
                placeholder="0000"
              />
              <p className="text-center text-xs text-gray-400 mt-2">Use code 1234 for demo</p>
            </div>
            <button 
              onClick={handleVerify}
              className="w-full bg-primary text-black font-bold h-12 rounded-lg"
            >
              Verify & Login
            </button>
            <button 
              onClick={() => setStep('PHONE')}
              className="w-full text-gray-500 text-sm font-medium"
            >
              Change Phone Number
            </button>
          </div>
        )}
        
        <div className="pt-10 flex justify-center">
            <button 
                onClick={() => setIsPartnerMode(!isPartnerMode)}
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
            >
                {isPartnerMode ? 'Switch to Customer App' : 'Join as Service Partner'}
            </button>
        </div>
      </div>
    </div>
  );
};
