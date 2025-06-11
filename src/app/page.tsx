
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Gem, ArrowRight, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Simulate a loading animation or delay for content to appear
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-primary/20 p-4 text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Enhanced: Activated subtle animated particle background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/40 via-accent/20 to-transparent animate-pulse"></div>
      </div>
      
      <div className={`z-10 flex flex-col items-center transition-opacity duration-1000 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <Gem className="w-20 h-20 sm:w-28 sm:h-28 text-accent mb-6 transform transition-all duration-500 ease-out group-hover:scale-110 animate-float" />
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-primary-foreground mb-3">
          ArtNFT
        </h1>
        <p className="text-lg sm:text-xl text-foreground/80 mb-10 max-w-md sm:max-w-xl">
          Discover, collect, and create extraordinary NFTs. Your gateway to the future of digital ownership.
        </p>

        <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:gap-6 w-full max-w-xs sm:max-w-md">
          <Link href="/home" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transition-transform hover:scale-105 focus:ring-2 focus:ring-accent focus:ring-offset-2">
              Explore Marketplace <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/profile" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full border-foreground/30 text-foreground hover:bg-foreground/5 shadow-lg transition-transform hover:scale-105 focus:ring-2 focus:ring-foreground/50 focus:ring-offset-2">
              Sign Up / Login <UserPlus className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <footer className={`absolute bottom-6 sm:bottom-8 text-center w-full z-10 transition-opacity duration-1000 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-xs sm:text-sm text-muted-foreground">&copy; {new Date().getFullYear()} ArtNFT. All rights reserved.</p>
      </footer>
    </div>
  );
}
