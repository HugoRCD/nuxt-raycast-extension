import { $fetch } from "ofetch";
import type { ApiResponse } from "../types/modules.ts";

/**
 * Fetch Nuxt modules filtered by category
 *
 * Use this tool when:
 * - You need to find modules in a specific category
 * - You want to recommend modules from a particular category
 * - You need a more focused list of modules than the complete list
 *
 * @param category - The category to filter modules by (e.g., "ui", "cms", "seo")
 * @returns The list of modules in the specified category
 */
export default async function tool(category: string) {
  const url = `https://api.nuxt.com/modules?category=${category}`;
  return await $fetch<ApiResponse>(url);
} 