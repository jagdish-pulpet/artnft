
import type { Metadata } from 'next';
// Global styles and the main Toaster are inherited from the root src/app/layout.tsx
// Font links (Inter) are also inherited from the root layout.

export const metadata: Metadata = {
  title: 'ArtNFT Admin',
  description: 'Admin Panel for ArtNFT Marketplace',
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This layout component wraps all content under the /admin route.
  // It does not re-declare <html>, <head>, or <body>.
  // The admin section's specific background 'bg-muted/40' is applied to this top-level div.
  // min-h-screen ensures this div attempts to fill the viewport height.
  return (
    <div className="bg-muted/40 min-h-screen">
      {children}
    </div>
  );
}
