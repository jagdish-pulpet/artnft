
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { Loader2, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress'; 

const SPLASH_DURATION = 3000; 
const PROGRESS_UPDATE_INTERVAL = 100; 

export default function SplashScreen() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing Artiverse...");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let progressTimer: NodeJS.Timeout;
    let messageTimer: NodeJS.Timeout;
    let navigationTimer: NodeJS.Timeout;

    if (!isLoadingComplete) {
      progressTimer = setInterval(() => {
        setProgress(oldProgress => {
          if (oldProgress >= 100) {
            clearInterval(progressTimer);
            return 100;
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }, PROGRESS_UPDATE_INTERVAL);

      const messages = [
          "Polishing Pixels...",
          "Connecting to the Metaverse...",
          "Unveiling Masterpieces...",
          "Sparking Creativity...",
          "Almost There!"
        ];
      let messageIndex = 0;
      setLoadingMessage(messages[messageIndex]); 
      messageTimer = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        setLoadingMessage(messages[messageIndex]);
      }, SPLASH_DURATION / messages.length);

      navigationTimer = setTimeout(() => {
        clearInterval(progressTimer);
        clearInterval(messageTimer);
        setProgress(100);
        setLoadingMessage("Welcome!");
        setIsLoadingComplete(true); 
      }, SPLASH_DURATION);
    }

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
      clearTimeout(navigationTimer);
    };
  }, [isMounted, isLoadingComplete]);

  useEffect(() => {
    if (isLoadingComplete && isMounted) {
      router.push('/welcome');
    }
  }, [isLoadingComplete, isMounted, router]);

  if (!isMounted) {
    // Minimal loader for pre-mount phase
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-rainbow-swirl text-white p-4">
        <ArtNFTLogo size="large" className="text-white" />
        <p className="mt-4 text-xl font-medium">Loading ArtNFT...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rainbow-swirl text-white p-4 overflow-hidden relative">
      {/* Ripple Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-1 h-1"> {/* Center point for ripples */}
          <div className="ripple" style={{ width: '200px', height: '200px', animationDelay: '0s' }}></div>
          <div className="ripple" style={{ width: '200px', height: '200px', animationDelay: '1s' }}></div>
          <div className="ripple" style={{ width: '200px', height: '200px', animationDelay: '2s' }}></div>
        </div>
      </div>

      <div className="text-center space-y-8 relative z-10"> {/* Ensure content is above ripples */}
        <div className="absolute -top-16 -left-16 opacity-30">
          <Sparkles className="h-32 w-32 text-white/70 animate-pulse" />
        </div>
        <div className="absolute -bottom-16 -right-16 opacity-30">
          <Sparkles className="h-32 w-32 text-white/70 animate-pulse delay-500" />
        </div>
        
        <div className="relative z-10">
          <ArtNFTLogo size="large" className="text-white animate-pulse-slow mb-4" />
          <p className="text-xl font-light tracking-wider">
            Discover, Create, and Trade Digital Art.
          </p>
        </div>

        <div className="w-full max-w-xs md:max-w-sm space-y-3 relative z-10">
          {!isLoadingComplete ? (
            <>
              <Progress value={progress} className="w-full h-2 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-white/70 [&>div]:to-white transition-all duration-150 ease-linear" />
              <p className="text-sm text-white/80 min-h-[20px]">{loadingMessage}</p>
            </>
          ) : (
            <Loader2 className="h-8 w-8 text-white animate-spin mx-auto" />
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
