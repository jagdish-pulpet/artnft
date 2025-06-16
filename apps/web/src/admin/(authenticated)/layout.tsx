// THIS FILE IS DEPRECATED AND NO LONGER IN USE.
// The active version is now located at:
// apps/web/src/app/admin/(authenticated)/layout.tsx
// Please remove this file from your project.

export default function DeprecatedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <p style={{ color: 'red', fontWeight: 'bold', padding: '20px', textAlign: 'center' }}>
        This file (apps/web/src/admin/(authenticated)/layout.tsx) is DEPRECATED and should be removed.
        The active layout is in apps/web/src/app/admin/(authenticated)/
      </p>
      {children}
    </div>
  );
}
