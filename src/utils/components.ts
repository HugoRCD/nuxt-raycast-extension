import { camelCase, kebabCase } from "scule";
import type { ComponentInfo, ComponentContext } from "../types/components";
import { components, proseComponents } from "./components-list";
import { DOCS_URL } from "./search";

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
  const isProse = proseComponents.includes(camelCaseName);

  return {
    exists: isBase || isProse,
    isBase,
    isProse,
  };
}

/**
 * Builds the documentation URL based on component info and preferences
 */
export function buildDocumentationUrl(context: ComponentContext): string {
  const { sanitizedName, hasProsePrefix, componentInfo } = context;
  const { isBase, isProse } = componentInfo;

  if (hasProsePrefix) {
    return `${DOCS_URL}/getting-started/typography#${sanitizedName.replace(/-/g, "")}`;
  }

  if (isProse && !isBase) {
    return `${DOCS_URL}/getting-started/typography#${sanitizedName.replace(/-/g, "")}`;
  }

  return `${DOCS_URL}/components/${sanitizedName}#theme`;
}
