
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Redirect to home after a few seconds if desired
    // const timer = setTimeout(() => {
    //   router.push('/home');
    // }, 5000); // 5 seconds
    // return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <PartyPopper className="w-20 h-20 sm:w-28 sm:h-28 text-accent mb-6 animate-bounce" />
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-primary-foreground mb-3">
        Welcome to ArtNFT!
      </h1>
      <p className="text-lg sm:text-xl text-foreground/80 mb-10 max-w-md sm:max-w-xl">
        You&apos;re all set to explore the Artiverse. Dive in and discover unique digital art.
      </p>
      <Link href="/home">
        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-transform hover:scale-105">
          Start Exploring
        </Button>
      </Link>
    </div>
  );
}
