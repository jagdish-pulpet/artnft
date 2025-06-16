// THIS FILE IS DEPRECATED AND NO LONGER IN USE.
// The ArtNFTLogo component is now located at:
// packages/ui/src/ArtNFTLogo.tsx and should be imported via @artnft/ui or @ui.
// Please remove this file (apps/web/src/components/ArtNFTLogo.tsx) from your project.
import type React from 'react';

export default function DeprecatedArtNFTLogo() {
  return (
    <div style={{ border: '2px dashed red', padding: '10px', margin: '10px', opacity: 0.5 }}>
      <p style={{ color: 'red', fontWeight: 'bold' }}>
        This ArtNFTLogo component (apps/web/src/components/ArtNFTLogo.tsx) is DEPRECATED.
      </p>
      <p>Please use the component from @artnft/ui (packages/ui/src/ArtNFTLogo.tsx).</p>
    </div>
  );
}
