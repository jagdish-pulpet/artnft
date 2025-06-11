import Link from 'next/link';
import { Gem, Home, Compass, PlusCircle, User, Sparkles, Search } from 'lucide-react'; // Added Search icon
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-headline font-bold text-primary-foreground hover:text-accent-foreground transition-colors">
          <Gem className="w-7 h-7 text-accent" />
          ArtNFT
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/">
            <Button variant="ghost" className="text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
              <Home className="w-4 h-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="ghost" className="text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
              <Compass className="w-4 h-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline">Explore</span>
            </Button>
          </Link>
           <Link href="/recommendations">
            <Button variant="ghost" className="text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
              <Sparkles className="w-4 h-4 mr-0 sm:mr-2 text-accent" /> <span className="hidden sm:inline">For You</span>
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="ghost" className="text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
              <PlusCircle className="w-4 h-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline">Create</span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
              <User className="w-4 h-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline">Profile</span>
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" size="icon" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Search className="w-4 h-4" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
