// This file is intentionally kept minimal to ensure it does not conflict
// with the (admin) route group, which handles all /admin/* routes.
// The actual admin landing page (e.g., dashboard or login redirect) should be defined
// within src/app/(admin)/admin/page.tsx or through layout/middleware logic.
// By not exporting a default React component, this file will not
// create a page route for the base /admin path.
