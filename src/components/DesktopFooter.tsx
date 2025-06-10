
import Link from 'next/link';
import ArtNFTLogo from './ArtNFTLogo';
import { Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';

export default function DesktopFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hidden md:block bg-card border-t border-border text-card-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <ArtNFTLogo size="small" />
            <p className="text-sm text-muted-foreground mt-2">
              Discover, Create & Trade Digital Art.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="#" aria-label="ArtNFT Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="ArtNFT Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="ArtNFT Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="ArtNFT LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Quick Links</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li><Link href="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">Explore</Link></li>
              <li><Link href="/create-nft" className="text-sm text-muted-foreground hover:text-primary transition-colors">Create NFT</Link></li>
              <li><Link href="/stats" className="text-sm text-muted-foreground hover:text-primary transition-colors">Market Stats</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Company</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} ArtNFT. All rights reserved. This is a demo application.
          </p>
        </div>
      </div>
    </footer>
  );
}
