
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { Loader2 } from 'lucide-react';

export default function SplashScreen() {
  const router = useRouter();
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Signal that the component has mounted
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Don't run timeout logic until mounted

    const timer = setTimeout(() => {
      setIsLoadingComplete(true); // Mark loading as complete
    }, 3000); // Increased splash visibility to 3 seconds for testing

    return () => clearTimeout(timer);
  }, [isMounted]); // Depend on isMounted

  useEffect(() => {
    if (isLoadingComplete && isMounted) { // Ensure component is mounted before navigating
      // Only navigate after loading is marked as complete
      router.push('/welcome');
    }
  }, [isLoadingComplete, router, isMounted]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-artistic-gradient text-white p-4">
      <div className="text-center space-y-6">
        <ArtNFTLogo size="large" className="text-white" />
        <p className="text-xl font-medium">
          Discover, Create, and Trade Digital Art.
        </p>
        {!isLoadingComplete && isMounted && ( // Show loader only if not complete AND mounted
          <div className="flex items-center justify-center pt-8">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <p className="ml-2">Loading ArtNFT...</p>
          </div>
        )}
        {isLoadingComplete && isMounted && ( // Show redirecting message only when it's actually about to happen
            <p className="pt-8 text-sm">Redirecting...</p>
        )}
        {!isMounted && ( // Fallback loader if component is somehow rendered before mount effect
             <div className="flex items-center justify-center pt-8">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <p className="ml-2">Initializing...</p>
            </div>
        )}
      </div>
    </div>
  );
}
