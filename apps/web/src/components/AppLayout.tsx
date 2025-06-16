// THIS FILE IS DEPRECATED AND NO LONGER IN USE.
// The global layout functionality is now handled by AppLayout.tsx
// located in the @artnft/ui package (packages/ui/src/AppLayout.tsx).
// Please remove this file (apps/web/src/components/AppLayout.tsx) from your project.
import type { ReactNode } from 'react';

export default function DeprecatedAppLayout({ children }: { children: ReactNode}) {
  return (
    <div>
      <p style={{ color: 'red', fontWeight: 'bold', padding: '20px', textAlign: 'center' }}>
        This AppLayout component (apps/web/src/components/AppLayout.tsx) is DEPRECATED.
      </p>
      <p style={{textAlign: 'center'}}>Use AppLayout from @artnft/ui instead.</p>
      <div>{children}</div>
    </div>
  );
}
