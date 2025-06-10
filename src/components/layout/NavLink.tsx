'use client';

import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NavLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

export function NavLink({ children, href, className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href.toString()));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
