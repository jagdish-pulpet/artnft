
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'; // Added SheetTitle
import { Home, Store, PlusCircle, User, Sparkles, Menu } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { href: '/marketplace', label: 'Marketplace', icon: <Store className="h-5 w-5" /> },
  { href: '/create', label: 'Create NFT', icon: <PlusCircle className="h-5 w-5" /> },
  { href: '/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4">
        <Link href="/" className="flex items-center space-x-2" aria-label="ArtNFT Home">
          <Sparkles className="h-8 w-8 text-accent" />
          <span className="font-headline text-2xl font-bold text-foreground">ArtNFT</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild>
              <Link href={item.href} className="flex items-center space-x-2 px-3 py-2 text-sm font-medium hover:text-accent-foreground hover:bg-accent/10 rounded-md transition-colors">
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <Link href="/" className="flex items-center space-x-2" aria-label="ArtNFT Home">
                    <Sparkles className="h-7 w-7 text-accent" />
                    <span className="font-headline text-xl font-bold text-foreground">ArtNFT</span>
                  </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  {navItems.map((item) => (
                     <Button key={item.label} variant="ghost" asChild className="w-full justify-start">
                        <Link href={item.href} className="flex items-center space-x-3 px-3 py-2.5 text-base font-medium hover:text-accent-foreground hover:bg-accent/10 rounded-md transition-colors">
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                    </Button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
