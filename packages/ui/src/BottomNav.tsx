
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusSquare, BarChart3, UserCircle as ProfileIcon } from 'lucide-react';
import { cn } from '@artnft/utils'; // Updated path

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/create-nft', label: 'Create', icon: PlusSquare },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: ProfileIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={cn(
        "fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-50 md:hidden"
      )}>
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
                           (item.href === '/profile' && pathname.startsWith('/profile'));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-1/5 text-muted-foreground hover:text-primary transition-colors",
                isActive && "text-primary"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive ? "fill-primary/20" : "")} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
