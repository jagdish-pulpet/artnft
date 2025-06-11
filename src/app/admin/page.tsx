// This file is intentionally kept minimal to avoid routing conflicts
// with the (admin) route group, which handles /admin/* routes.
// The actual admin landing page (e.g., dashboard) should be defined
// within src/app/(admin)/admin/(authenticated)/ or as src/app/(admin)/admin/page.tsx.
// By not exporting a default React component, this file will not
// create a page route for /admin.

const placeholder = true;
// Exporting a non-default constant to make this a valid module
// without it being a page.
export { placeholder as AdminBasePlaceholder };
