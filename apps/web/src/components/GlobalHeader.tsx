// THIS FILE IS DEPRECATED AND NO LONGER IN USE.
// The GlobalHeader component is now located at:
// packages/ui/src/GlobalHeader.tsx and should be imported via @artnft/ui.
// Please remove this file (apps/web/src/components/GlobalHeader.tsx) from your project.

export default function DeprecatedGlobalHeader() {
  return (
    <div style={{ border: '2px dashed red', padding: '10px', margin: '10px', opacity: 0.5 }}>
      <p style={{ color: 'red', fontWeight: 'bold' }}>
        This GlobalHeader component (apps/web/src/components/GlobalHeader.tsx) is DEPRECATED.
      </p>
      <p>Please use the component from @artnft/ui (packages/ui/src/GlobalHeader.tsx).</p>
    </div>
  );
}
