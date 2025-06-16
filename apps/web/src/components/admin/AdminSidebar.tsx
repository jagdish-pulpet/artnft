
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Palette, Settings2Icon, Package, BarChartBig, Star, ClipboardList, ShieldAlert, ClipboardCheck, SlidersHorizontal } from 'lucide-react'; // Added SlidersHorizontal
import ArtNFTLogo from '@ui/ArtNFTLogo'; // Updated import
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/nfts', label: 'NFTs', icon: Palette },
  { href: '/admin/categories', label: 'Categories', icon: Package },
  { href: '/admin/promotions', label: 'Promotions', icon: Star },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChartBig },
  { href: '/admin/audit-log', label: 'Audit Log', icon: ClipboardList },
  { href: '/admin/moderation', label: 'Moderation', icon: ShieldAlert },
  { href: '/admin/tasks', label: 'Tasks & Alerts', icon: ClipboardCheck },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings2Icon },
  { href: '/admin/feature-toggles', label: 'Feature Toggles', icon: SlidersHorizontal }, // New item
];

interface AdminSidebarProps {
  className?: string;
  onLinkClick?: () => void; // For closing mobile drawer
}

export default function AdminSidebar({ className, onLinkClick }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col h-full bg-card text-card-foreground border-r border-border", className)}>
      <div className="h-16 flex items-center justify-center px-4 border-b border-border">
        <Link href="/admin/dashboard" onClick={onLinkClick}>
          <ArtNFTLogo size="small" />
        </Link>
      </div>
      <nav className="flex-grow p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin/dashboard') || (pathname === '/admin' && item.href === '/admin/dashboard');
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                isActive ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <Separator />
      <div className="p-4 text-xs text-center text-muted-foreground">
         © {new Date().getFullYear()} ArtNFT Admin
      </div>
    </aside>
  );
}
