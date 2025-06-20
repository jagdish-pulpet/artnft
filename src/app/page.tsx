import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-background to-accent/30">
      <Card className="w-full max-w-2xl shadow-2xl overflow-hidden">
        <CardHeader className="bg-primary/20 p-8 text-center">
          <div className="mx-auto mb-6 bg-primary text-primary-foreground rounded-full p-4 w-24 h-24 flex items-center justify-center shadow-lg">
            <Palette size={48} />
          </div>
          <CardTitle className="text-5xl font-headline text-primary-foreground tracking-tight">Welcome to ArtNFT</CardTitle>
          <CardDescription className="text-xl text-primary-foreground/80 mt-2 font-body">
            Your gateway to the world of digital art.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="text-lg mb-8 text-foreground/90">
            Discover, collect, and trade unique NFT art pieces from talented artists around billowing globe.
            Immerse yourself in a vibrant community of art enthusiasts and creators.
          </p>
          <Image 
            src="https://placehold.co/600x400.png" 
            alt="Abstract Art Compilation" 
            data-ai-hint="abstract art"
            width={600} 
            height={400} 
            className="rounded-lg mb-8 shadow-lg mx-auto" 
          />
          <Link href="/login" passHref>
            <Button size="lg" className="w-full max-w-xs text-lg py-3 px-6 bg-primary text-primary-foreground hover:bg-primary/80 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md">
              Explore & Login
            </Button>
          </Link>
        </CardContent>
      </Card>
      <footer className="mt-12 text-center text-foreground/70">
        <p>&copy; {new Date().getFullYear()} ArtNFT. All rights reserved.</p>
        <p className="text-sm">Crafted with passion for digital art.</p>
      </footer>
    </main>
  );
}
