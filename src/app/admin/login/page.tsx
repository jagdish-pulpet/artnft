
// This file is intentionally modified to resolve a routing conflict.
// The active admin login page is located at /src/app/(admin)/admin/login/page.tsx.
// By not exporting a default React component, this file will not
// create a page route for /admin/login.

// No default export
const placeholder = true;
export { placeholder as PlaceholderAdminLoginPage };
