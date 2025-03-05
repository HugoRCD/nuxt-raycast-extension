import { Icon, open } from "@raycast/api";
import type { ComponentContext } from "../types/components";
import { sanitizeComponentName, getComponentInfo, buildDocumentationUrl } from "./components";
import { getExtensionPreferences, showAnimatedToast, showFailureToast } from "./command-utils";

export interface ComponentItem {
  name: string;
  type: "base" | "pro" | "prose";
  camelCaseName: string;
}

/**
 * Helper function to capitalize the first letter of a string
 */
export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Helper function to get properly formatted component name with prefix
 */
export function getFormattedComponentName(component: ComponentItem): string {
  const { prefix } = getExtensionPreferences();
  
  if (component.type === "base") {
    // For base components, add the prefix and capitalize each word
    // e.g., "dropdown-menu" -> "UDropdownMenu"
    return prefix + component.name.split(/[-_]/).map(capitalizeFirstLetter).join("");
  } else if (component.type === "prose") {
    // For prose components, add "Prose" prefix and capitalize
    return "Prose" + capitalizeFirstLetter(component.name);
  } else {
    // For pro components, just capitalize each word
    return component.name.split(/[-_]/).map(capitalizeFirstLetter).join("");
  }
}

/**
 * Helper function to get display name for the list (capitalized but without prefix)
 */
export function getDisplayName(component: ComponentItem): string {
  return capitalizeFirstLetter(component.name);
}

/**
 * Helper function to create a component context
 */
export function createComponentContext(component: ComponentItem): ComponentContext {
  const hasProsePrefix = component.type === "prose";
  const sanitizedName = component.name;
  const componentInfo = getComponentInfo(sanitizedName);
  
  return {
    name: getFormattedComponentName(component),
    sanitizedName,
    hasProsePrefix,
    componentInfo,
  };
}

/**
 * Open documentation with or without the theme section
 */
export async function openDocumentation(component: ComponentItem, showTheme: boolean = false): Promise<void> {
  try {
    const context = createComponentContext(component);
    const { version: preferenceVersion } = getExtensionPreferences();

    if (!context.componentInfo.exists) {
      await showFailureToast("Component not found");
      return;
    }

    // Build documentation URL and remove #theme if not needed
    let documentationUrl = buildDocumentationUrl(context, preferenceVersion);
    if (!showTheme) {
      documentationUrl = documentationUrl.replace(/#theme$/, "");
    }

    await showAnimatedToast(`Opening ${showTheme ? "theme " : ""}documentation...`);
    await open(documentationUrl);
  } catch (error) {
    await showFailureToast("Failed to open documentation");
  }
}

/**
 * Get the appropriate icon for a component type
 */
export function getComponentIcon(type: string) {
  switch (type) {
    case "base":
      return Icon.Box;
    case "pro":
      return Icon.Star;
    case "prose":
      return Icon.Text;
    default:
      return Icon.Box;
  }
}

/**
 * Get the label for a component type
 */
export function getComponentTypeLabel(type: string): string {
  switch (type) {
    case "base":
      return "Base Component";
    case "pro":
      return "Pro Component";
    case "prose":
      return "Prose Component";
    default:
      return "";
  }
} 