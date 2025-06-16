// THIS FILE IS DEPRECATED AND NO LONGER IN USE.
// The global layout functionality is now handled by AppLayout.tsx
// located in the @artnft/ui package (packages/ui/src/AppLayout.tsx).
// Please remove this file from your project.
import type { ReactNode } from 'react';

export default function DeprecatedMainLayout({ children }: { children: ReactNode}) {
  return (
    <div>
      <p>This MainLayout component (src/components/layout/main-layout.tsx) is deprecated and should be removed.</p>
      <p>Use AppLayout from @artnft/ui instead.</p>
      <div>{children}</div>
    </div>
  );
}
