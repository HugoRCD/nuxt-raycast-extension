import { camelCase, kebabCase } from "scule";
import type { ComponentInfo, ComponentContext } from "../types/components";
import { components, proComponents, proseComponents } from "./components-list";

/**
 * Cleans and normalizes a component name
 * @param componentName - Name of the component to clean (e.g., 'UButton', 'ProseBadge')
 * @param prefix - Prefix to remove (e.g., 'U')
 * @returns The normalized component name in kebab-case
 */
export function sanitizeComponentName(componentName: string, prefix: string): string {
  return kebabCase(componentName.replace(/^(Prose|prose)/, "").replace(prefix, ""));
}

/**
 * Determines component type and existence
 */
export function getComponentInfo(sanitizedName: string): ComponentInfo {
  const camelCaseName = camelCase(sanitizedName);

  const isBase = components.includes(camelCaseName);
  const isPro = proComponents.includes(camelCaseName);
  const isProse = proseComponents.includes(camelCaseName);

  return {
    exists: isBase || isPro || isProse,
    isBase,
    isPro,
    isProse,
  };
}

/**
 * Builds the documentation URL based on component info and preferences
 */
export function buildDocumentationUrl(context: ComponentContext, version: string): string {
  const { sanitizedName, hasProsePrefix, componentInfo } = context;
  const { isBase, isPro, isProse } = componentInfo;

  const baseUrl = version === "v3" ? "https://ui3.nuxt.dev" : "https://ui.nuxt.com";
  const versionUrl = isPro && version === "v2" ? `${baseUrl}/pro` : baseUrl;

  if (hasProsePrefix) {
    return `https://ui3.nuxt.dev/getting-started/typography#${sanitizedName.replace(/-/g, "")}`;
  }

  if (isProse && !isBase) {
    return `https://ui3.nuxt.dev/getting-started/typography#${sanitizedName.replace(/-/g, "")}`;
  }

  return `${versionUrl}/components/${sanitizedName}#theme`;
}
