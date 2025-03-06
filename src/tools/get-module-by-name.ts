import { $fetch } from "ofetch";
import type { Module } from "../types/modules.ts";

/**
 * Fetch information about a specific Nuxt module by name
 *
 * Use this tool when:
 * - You need detailed information about a specific module
 * - You want to check compatibility, maintainers, or other details of a module
 * - You need to provide specific information about a module to the user
 *
 * @param name - The name of the module (e.g., "ui", "algolia")
 * @returns The module information if found
 */
export default async function tool(name: string) {
  const url = `https://api.nuxt.com/modules/${name}`;
  return await $fetch<Module>(url);
} 