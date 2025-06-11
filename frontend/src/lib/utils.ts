// Utility functions for class name merging and conditional class application in React components.
// Uses clsx for conditional class names and tailwind-merge to resolve Tailwind CSS class conflicts.

import { clsx, type ClassValue } from "clsx" // clsx: utility for conditionally joining classNames
import { twMerge } from "tailwind-merge" // twMerge: merges Tailwind CSS classes, resolving conflicts
 
// Combines class names using clsx and then merges them with tailwind-merge
// Ensures that only the correct Tailwind classes are applied (e.g., no duplicate/conflicting classes)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)) // First join with clsx, then merge with twMerge
}