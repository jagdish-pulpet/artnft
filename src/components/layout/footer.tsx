import { Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 py-8 text-muted-foreground mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
            <Sparkles className="h-6 w-6 text-accent mb-3" />
            <p className="text-sm">
                &copy; {currentYear} ArtNFT. All rights reserved.
            </p>
            <p className="text-xs mt-1">
                A platform for discovering, creating, and trading unique digital art.
            </p>
            <div className="mt-4 space-x-4">
                <a href="#" className="text-xs hover:text-accent transition-colors">Privacy Policy</a>
                <a href="#" className="text-xs hover:text-accent transition-colors">Terms of Service</a>
            </div>
        </div>
      </div>
    </footer>
  );
}
