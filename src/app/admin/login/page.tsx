// This file is intentionally modified to resolve a routing conflict.
// The active admin login page is located at /src/app/(admin)/admin/login/page.tsx.

export default function PlaceholderAdminLogin() {
  // Returning null or an empty fragment ensures this file doesn't render a page
  // and thus doesn't conflict with the other admin login route.
  return null;
}
