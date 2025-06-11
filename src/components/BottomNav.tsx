
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusSquare, BarChart3, UserCircle as ProfileIcon } from 'lucide-react'; // Changed LayoutDashboard to UserCircle
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/create-nft', label: 'Create', icon: PlusSquare },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: ProfileIcon }, // Changed label and icon
];

const SCROLL_THRESHOLD = 50;
const MIN_SCROLL_DELTA = 5;

export default function BottomNav() {
  const pathname = usePathname();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const initialScrollY = window.scrollY;
    setLastScrollY(initialScrollY);
    if (initialScrollY > SCROLL_THRESHOLD) {
      setIsNavVisible(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= SCROLL_THRESHOLD) {
        setIsNavVisible(true);
      } else {
        if (currentScrollY > lastScrollY && (currentScrollY - lastScrollY) > MIN_SCROLL_DELTA) {
          setIsNavVisible(false); 
        } else if (currentScrollY < lastScrollY && (lastScrollY - currentScrollY) > MIN_SCROLL_DELTA) {
          setIsNavVisible(true); 
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);


  return (
    <nav className={cn(
        "fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-50 md:hidden",
        "transition-transform duration-300 ease-in-out",
        isNavVisible ? 'translate-y-0' : 'translate-y-full'
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
    

    
