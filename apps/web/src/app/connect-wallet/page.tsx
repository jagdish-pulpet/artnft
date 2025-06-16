
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ArtNFTLogo from '@ui/ArtNFTLogo'; // Updated import
import { ChevronLeft, Wallet, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function ConnectWalletPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleWalletConnect = (walletName: string) => {
    // Simulate wallet connection logic
    toast({
      title: 'Connecting Wallet (Simulated)',
      description: `Attempting to connect with ${walletName}... This is a simulation.`,
    });
    // In a real app, you'd initiate connection here and handle response.
    // For simulation, we can redirect or show a success message.
    setTimeout(() => {
      toast({
        title: 'Wallet Connected (Simulated)!',
        description: `You have successfully connected with ${walletName}.`,
      });
      router.push('/home'); // Or to settings, or wherever is appropriate
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 relative">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Button variant="ghost" asChild onClick={() => router.back()}>
          <Link href="#"> {/* Link href is not strictly needed with router.back() but good for semantics */}
            <ChevronLeft className="h-4 w-4 mr-2" /> Back
          </Link>
        </Button>
      </div>
      <Card className="bg-card shadow-xl rounded-lg p-6 md:p-8 w-full max-w-md space-y-6 mt-16 md:mt-0">
        <CardHeader className="text-center">
          <ArtNFTLogo className="mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold font-headline">Connect Your Wallet</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Choose your preferred wallet provider to continue.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start text-base py-6 h-auto" 
            onClick={() => handleWalletConnect('MetaMask')}
          >
            <Image src="https://placehold.co/32x32.png" alt="MetaMask" width={32} height={32} className="rounded-sm shrink-0" data-ai-hint="MetaMask logo" />
            <span className="flex-1 min-w-0 text-left">
              <span className="truncate block">MetaMask</span>
            </span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-base py-6 h-auto" 
            onClick={() => handleWalletConnect('WalletConnect')}
          >
             <Image src="https://placehold.co/32x32.png" alt="WalletConnect" width={32} height={32} className="rounded-sm shrink-0" data-ai-hint="WalletConnect logo" />
             <span className="flex-1 min-w-0 text-left">
               <span className="truncate block">WalletConnect</span>
             </span>
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start text-base py-6 h-auto" 
            onClick={() => handleWalletConnect('Coinbase Wallet')}
          >
            <Image src="https://placehold.co/32x32.png" alt="Coinbase Wallet" width={32} height={32} className="rounded-sm shrink-0" data-ai-hint="Coinbase logo" />
            <span className="flex-1 min-w-0 text-left">
              <span className="truncate block">Coinbase Wallet</span>
            </span>
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col items-center text-center space-y-3">
          <p className="text-xs text-muted-foreground px-4">
            By connecting your wallet, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>. Wallet connection is simulated.
          </p>
          <Button variant="link" onClick={() => router.push('/home')} className="text-sm">
            Continue without connecting (Explore as Guest)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

