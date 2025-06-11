
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: 'Home', icon: Home }, // Updated href
  { href: '/search', label: 'Explore', icon: Search },
  { href: '/create', label: 'Create', icon: PlusCircle },
  { href: '/recommendations',label: 'For You',icon: Sparkles },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card p-1 md:hidden shadow-[-4px_0px_10px_rgba(0,0,0,0.1)] dark:shadow-[-4px_0px_10px_rgba(255,255,255,0.05)]">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/home" && pathname === "/"); // Handle root path also as home
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 p-2 rounded-md transition-colors w-1/5 h-14 focus:outline-none focus-visible:bg-accent/20',
                isActive
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('w-5 h-5 mb-0.5', isActive ? 'text-accent' : '')} />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
