// THIS FILE IS DEPRECATED AND NO LONGER IN USE.
// The active NFTCard component is now located at:
// apps/web/src/components/NFTCard.tsx
// Please remove this file (src/components/nft-card.tsx) from your project.

import Image from 'next/image';
import Link from 'next/link';

type DeprecatedNFTCardProps = {
  id: string;
  imageUrl: string;
  title: string;
  artist: string;
  price: string;
  aiHint?: string;
};

export default function DeprecatedNFTCard({ id, imageUrl, title, artist, price }: DeprecatedNFTCardProps) {
  return (
    <div style={{ border: '2px dashed red', padding: '10px', margin: '10px', opacity: 0.5 }}>
      <p style={{ color: 'red', fontWeight: 'bold' }}>
        This NFTCard component (src/components/nft-card.tsx) is DEPRECATED.
      </p>
      <p>Please use the component from apps/web/src/components/NFTCard.tsx</p>
      <Image src={imageUrl} alt={title} width={100} height={100} />
      <h3>{title}</h3>
      <p>By {artist}</p>
      <p>{price}</p>
      <Link href={`/marketplace/${id}`}>View (Old Link)</Link>
    </div>
  );
}
