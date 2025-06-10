'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { Loader2 } from 'lucide-react';

export default function SplashScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.push('/welcome');
    }, 3000); // Display splash for 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-artistic-gradient text-white p-4">
      <div className="text-center space-y-6">
        <ArtNFTLogo size="large" className="text-white" />
        <p className="text-xl font-medium">
          Discover, Create, and Trade Digital Art.
        </p>
        {isLoading && (
          <div className="flex items-center justify-center pt-8">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
