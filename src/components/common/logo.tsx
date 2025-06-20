import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      aria-label="ArtNFT Logo"
      role="img"
      {...props}
    >
      <title>ArtNFT Logo</title>
      {/* Optional: A subtle background rectangle for the logo itself if needed, or remove if logo design is purely text/shape based */}
      {/* <rect width="200" height="50" rx="10" fill="currentColor" fillOpacity="0.05" /> */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="inherit" // Inherits font from parent, which should be Inter via font-headline
        fontSize="32" // Increased size for impact
        fontWeight="bold"
        fill="currentColor"
      >
        ArtNFT
      </text>
    </svg>
  );
}
