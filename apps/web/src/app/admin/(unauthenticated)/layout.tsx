
// DEPRECATED: This layout was for the (unauthenticated) admin route group.
// If the login page was the only page in this group and has been moved,
// this layout and the (unauthenticated) folder might no longer be needed.
// Please review and remove if appropriate.
import type React from 'react';

export default function UnauthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
