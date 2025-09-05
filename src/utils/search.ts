import { ComponentItem, components, proseComponents } from "./components";
import { camelCase, kebabCase } from "scule";
import { getPreferenceValues } from "@raycast/api";

/**
 * Get all components from all categories
 */
export function getAllComponents(): ComponentItem[] {
  const allComponents: ComponentItem[] = [];

  // Add base components
  components.forEach((name: string) => {
    allComponents.push({
      name: kebabCase(name),
      type: "base",
      camelCaseName: camelCase(name),
    });
  });

  // Add prose components
  proseComponents.forEach((name: string) => {
    allComponents.push({
      name: kebabCase(name),
      type: "prose",
      camelCaseName: camelCase(name),
    });
  });

  return allComponents;
}

/**
 * Filter components based on search text and type
 */
export function filterComponents(
  components: ComponentItem[],
  searchText: string,
  selectedType: string | null,
): ComponentItem[] {
  return components.filter((component) => {
    // Filter by type if selected
    if (selectedType && component.type !== selectedType) {
      return false;
    }

    // Filter by search text
    if (searchText) {
      const normalizedSearchText = searchText.toLowerCase();
      return (
        component.name.toLowerCase().includes(normalizedSearchText) ||
        component.camelCaseName.toLowerCase().includes(normalizedSearchText)
      );
    }

    return true;
  });
}

/**
 * Sort components alphabetically by name
 */
export function sortComponentsByName(components: ComponentItem[]): ComponentItem[] {
  return [...components].sort((a, b) => a.name.localeCompare(b.name));
}

type Preferences = {
  docsUrl?: string;
  branch?: string;
  nuxtDocsUrl?: string;
};

const prefs = getPreferenceValues<Preferences>();

export const DOCS_URL = (prefs.docsUrl || "https://ui.nuxt.com").replace(/\/$/, "");
export const BRANCH = prefs.branch || "main";
export const NUXT_DOCS_URL = (prefs.nuxtDocsUrl || "https://nuxt.com/docs/4.x").replace(/\/$/, "");