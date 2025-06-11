
// This file is intentionally kept minimal to avoid routing conflicts
// with the (admin) route group, which handles /admin/* routes.
// The actual admin landing page (e.g., dashboard) should be defined
// within src/app/(admin)/admin/(authenticated)/.
// By not exporting a default React component, this file will not
// create a page route for /admin.

// No default export
const placeholder = true;
export { placeholder as AdminBasePlaceholder };
