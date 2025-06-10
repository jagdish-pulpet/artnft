import type { Metadata } from 'next';
import { Inter, Literata } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  weight: ['400', '700'], // Specify weights needed
});

export const metadata: Metadata = {
  title: 'ArtNft - AI Powered Content Creation',
  description: 'Create, manage, and improve your textual content with ArtNft.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${literata.variable}`}>
      <head>
        {/* Google Font links are managed via next/font, explicit <link> tags not needed here with this setup */}
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
