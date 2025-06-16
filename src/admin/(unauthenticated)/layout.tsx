
import type React from 'react';

export default function UnauthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
