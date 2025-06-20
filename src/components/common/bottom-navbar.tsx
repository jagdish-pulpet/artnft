
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, PlusCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider'; // Import useAuth


interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isActive }) => {
  return (
    <Link href={href} className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg group">
      <Icon
        className={cn(
          'h-6 w-6 mb-0.5 transition-colors group-hover:text-primary',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}
      />
      <span
        className={cn(
          'text-xs font-medium transition-colors group-hover:text-primary',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        {label}
      </span>
    </Link>
  );
};

export function BottomNavbar() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth(); // Use auth context

  const navItemsBase = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/collections', icon: LayoutGrid, label: 'Collections' },
  ];

  let navItemsDynamic = [];
  if (isAuthenticated) {
    navItemsDynamic = [
        ...navItemsBase,
        { href: '/create-nft', icon: PlusCircle, label: 'Create' },
        { href: '/profile', icon: User, label: 'Profile' }
    ];
  } else {
    navItemsDynamic = [
        ...navItemsBase,
        { href: '/signin', icon: User, label: 'Account' } // Or some other placeholder
    ];
  }
  
  // Don't render navbar during initial auth loading if not authenticated yet
  if (isLoading && !isAuthenticated) {
    return null;
  }


  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/60 shadow-[0_-2px_10px_-3px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto flex h-16 items-center justify-around px-2">
        {navItemsDynamic.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href || (item.href === "/profile" && pathname.startsWith("/profile"))}
          />
        ))}
      </div>
    </nav>
  );
}
