
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { Loader2 } from 'lucide-react';

export default function SplashScreen() {
  const router = useRouter();
  const [isShowingSplash, setIsShowingSplash] = useState(true); // Renamed for clarity

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowingSplash(false); // Explicitly set to false before navigating
      router.push('/welcome');
    }, 2000); // Reduced duration to 2 seconds for faster testing

    // Clear the timer if the component unmounts before the timeout finishes
    return () => clearTimeout(timer);
  }, [router]); // router dependency is correct for router.push

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-artistic-gradient text-white p-4">
      <div className="text-center space-y-6">
        <ArtNFTLogo size="large" className="text-white" />
        <p className="text-xl font-medium">
          Discover, Create, and Trade Digital Art.
        </p>
        {/* Show loader only while isShowingSplash is true */}
        {isShowingSplash && (
          <div className="flex items-center justify-center pt-8">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
