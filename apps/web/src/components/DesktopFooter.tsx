// THIS FILE IS DEPRECATED AND NO LONGER IN USE.
// The DesktopFooter component is now located at:
// packages/ui/src/DesktopFooter.tsx and should be imported via @artnft/ui.
// Please remove this file (apps/web/src/components/DesktopFooter.tsx) from your project.

export default function DeprecatedDesktopFooter() {
  return (
    <div style={{ border: '2px dashed red', padding: '10px', margin: '10px', opacity: 0.5 }}>
      <p style={{ color: 'red', fontWeight: 'bold' }}>
        This DesktopFooter component (apps/web/src/components/DesktopFooter.tsx) is DEPRECATED.
      </p>
      <p>Please use the component from @artnft/ui (packages/ui/src/DesktopFooter.tsx).</p>
    </div>
  );
}
