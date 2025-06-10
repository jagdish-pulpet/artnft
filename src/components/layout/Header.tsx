import Link from 'next/link';
import { BookOpenText, Users, Sparkles, Home } from 'lucide-react';
import { NavLink } from './NavLink';

export function Header() {
  return (
    <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BookOpenText className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold font-headline text-foreground">ArtNft</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <NavLink href="/">
            <Home className="h-4 w-4" />
            Home
          </NavLink>
          <NavLink href="/admin">
            <Users className="h-4 w-4" />
            Admin
          </NavLink>
          <NavLink href="/improve-text">
            <Sparkles className="h-4 w-4" />
            AI Improve
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
