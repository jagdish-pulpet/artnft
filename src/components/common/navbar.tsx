
'use client';

import Link from 'next/link';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Wallet, PlusCircle, ShieldCheck, LogOut, UserCircle2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider'; // Import useAuth

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, isAdmin, logout, isLoading } = useAuth(); // Use auth context

  const navLinks = [
    { href: '/home', label: 'Explore' },
    { href: '/collections', label: 'Collections' },
    { href: '/stats', label: 'Stats' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };
  
  if (isLoading && !isAuthenticated && !user) { // Show a minimal loading state or nothing during initial auth check
    return (
         <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                 <div className="mr-4 flex">
                    <Link href="/home" passHref className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
                        <Logo className="h-8 w-auto" />
                    </Link>
                </div>
                <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
            </div>
        </nav>
    );
  }


  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex">
          <Link href="/home" passHref className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
            <Logo className="h-8 w-auto" />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === link.href ? "text-foreground font-semibold" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
           {isAuthenticated && isAdmin && (
            <Link
              href="/admin/dashboard"
              className={cn(
                "transition-colors hover:text-foreground/80 flex items-center",
                pathname.startsWith('/admin') ? "text-primary font-semibold" : "text-foreground/60"
              )}
            >
              <ShieldCheck className="mr-1.5 h-4 w-4" /> Admin
            </Link>
          )}
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <div className="relative w-full max-w-xs hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search NFTs, collections..."
              className="w-full rounded-full bg-muted pl-10 pr-4 h-10 text-sm focus:bg-background"
            />
          </div>

          {isAuthenticated && user ? (
            <>
              <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/create-nft">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create
                </Link>
              </Button>
              {/* Wallet display can be added later if needed from user profile data */}
              {/* <div className="hidden sm:flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">0.42 ETH</span>
              </div> */}
              <Link href="/profile" passHref>
                <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent hover:border-primary transition-colors">
                  <AvatarImage src={user.avatarUrl || `https://placehold.co/40x40.png?text=${user.username.charAt(0)}`} alt={user.username} data-ai-hint="profile avatar" />
                  <AvatarFallback>{user.username ? user.username.substring(0, 1).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout" className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/signin">
                <UserCircle2 className="mr-2 h-5 w-5"/> Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
