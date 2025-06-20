
'use client';

import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  inputClassName?: string;
  containerClassName?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onComplete,
  inputClassName,
  containerClassName,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(new Array(length).fill(null));

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value)) && value !== '') return; // Allow only digits or empty string for backspace

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last entered digit if multiple are pasted/typed
    setOtp(newOtp);

    if (value !== '' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const completedOtp = newOtp.join('');
    if (completedOtp.length === length) {
      onComplete(completedOtp);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // If current input is empty and not the first one, move focus to previous
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = ''; // Optionally clear previous input as well
        setOtp(newOtp);
      } else {
        // If current input has value, clear it and stay, or if it's the first input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        // Focus remains on the current input after clearing its value
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, ''); // Remove non-digits
    if (!pasteData) return;

    const newOtp = [...otp];
    let currentFocusIndex = 0;

    for (let i = 0; i < Math.min(length, pasteData.length); i++) {
      newOtp[i] = pasteData[i];
      currentFocusIndex = i;
    }
    setOtp(newOtp);

    if (currentFocusIndex < length - 1) {
      inputRefs.current[currentFocusIndex + 1]?.focus();
    } else {
      inputRefs.current[currentFocusIndex]?.focus(); // Keep focus on last filled input
    }
    
    const completedOtp = newOtp.join('');
    if (completedOtp.length === length) {
      onComplete(completedOtp);
    }
  };

  return (
    <div className={cn("flex justify-center space-x-2 sm:space-x-3", containerClassName)}>
      {otp.map((digit, index) => (
        <Input
          key={index}
          type="tel" // Use "tel" for numeric keyboard on mobile
          maxLength={1}
          value={digit}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          ref={(el) => (inputRefs.current[index] = el)}
          className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl md:text-2xl font-medium border-input focus:border-primary focus:ring-primary transition-all duration-200 ease-in-out shadow-sm rounded-md",
            inputClassName
          )}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};
