import { $fetch } from "ofetch";
import type { ApiResponse } from "../types/modules.ts";

/**
 * Fetch the complete list of available Nuxt modules
 *
 * Use this tool when:
 * - You need to find modules for specific functionality
 * - You want to explore available Nuxt ecosystem solutions
 * - You need to recommend modules based on user requirements
 *
 * @returns The list of all available Nuxt modules with their details
 */
export default async function tool() {
  // This is too long for the AI to handle
  return await $fetch<ApiResponse>("https://api.nuxt.com/modules");
}
