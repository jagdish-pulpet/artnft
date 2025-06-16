// apps/web/src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Re-export cn from the shared package if you want to consolidate logic
// For now, to satisfy components.json directly if needed,
// we define cn here, but it's identical to the one in @artnft/utils.
// Ideally, this would be:
// export { cn } from '@utils'; // Assuming @utils is correctly aliased in tsconfig.json to packages/utils

// To ensure this file is self-contained for "@/lib/utils" resolution as per components.json
// and to avoid issues if @utils isn't resolvable during certain build phases for UI components,
// we'll duplicate the cn function here.
// The BETTER long-term solution is for components to directly use '@utils' if build system allows,
// OR ensure this file properly re-exports. For safety, we'll define it.

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
