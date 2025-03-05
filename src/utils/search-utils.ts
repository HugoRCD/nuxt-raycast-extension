import { ComponentItem } from "./component-utils";
import { components, proComponents, proseComponents } from "./components-list";

/**
 * Get all components from all categories
 */
export function getAllComponents(): ComponentItem[] {
  const allComponents: ComponentItem[] = [];

  // Add base components
  components.forEach((name: string) => {
    allComponents.push({
      name,
      type: "base",
      camelCaseName: name.split(/[-_]/).map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(""),
    });
  });

  // Add pro components
  proComponents.forEach((name: string) => {
    allComponents.push({
      name,
      type: "pro",
      camelCaseName: name.split(/[-_]/).map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(""),
    });
  });

  // Add prose components
  proseComponents.forEach((name: string) => {
    allComponents.push({
      name,
      type: "prose",
      camelCaseName: name.split(/[-_]/).map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(""),
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
  selectedType: string | null
): ComponentItem[] {
  return components.filter((component) => {
    // Filter by type if selected
    if (selectedType && component.type !== selectedType) {
      return false;
    }

    // Filter by search text
    if (searchText) {
      const normalizedSearchText = searchText.toLowerCase();
      return component.name.toLowerCase().includes(normalizedSearchText);
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