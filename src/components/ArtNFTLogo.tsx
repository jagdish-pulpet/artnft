
import { Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArtNFTLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function ArtNFTLogo({ size = 'medium', className }: ArtNFTLogoProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-20 h-20 sm:w-28 sm:h-28',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Gem className={cn(sizeClasses[size], 'text-inherit')} /> {/* Use text-inherit to respect parent color */}
    </div>
  );
}
