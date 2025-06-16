// apps/web/src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This file provides the `cn` utility as expected by ShadCN components
// when using the "@/lib/utils" alias within the apps/web context.
// It uses `clsx` and `twMerge` directly.

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs)) // Corrected: spread inputs
}

// Re-export ClassValue in case any local component attempts to import it from here.
export type { ClassValue };
