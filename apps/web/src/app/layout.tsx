import type { Metadata } from 'next';
import './globals.css'; // Path is now relative to this file
import { Toaster } from "@/components/ui/toaster"; // Reverted to alias

export const metadata: Metadata = {
  title: 'ArtNFT Marketplace',
  description: 'Discover, Create, and Trade Digital Art.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
