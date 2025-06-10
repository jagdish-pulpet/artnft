import type React from 'react';

interface ArtNFTLogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const ArtNFTLogo: React.FC<ArtNFTLogoProps> = ({ className, size = 'medium' }) => {
  let textSizeClass = 'text-4xl';
  if (size === 'small') {
    textSizeClass = 'text-2xl';
  } else if (size === 'large') {
    textSizeClass = 'text-6xl';
  }

  return (
    <div className={`font-headline font-bold ${textSizeClass} ${className}`}>
      <span className="text-primary">Art</span>
      <span className="text-accent">NFT</span>
    </div>
  );
};

export default ArtNFTLogo;
