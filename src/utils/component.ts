import { Icon, open, showToast, Toast, getPreferenceValues } from "@raycast/api";
import type { ComponentContext } from "../types/components";
import { getComponentInfo, buildDocumentationUrl } from "./components";
import { showAnimatedToast, showSuccessToast } from "./commands";
import { showFailureToast } from "@raycast/utils";
import { pascalCase } from "scule";

export interface ComponentItem {
  name: string;
  type: "base" | "prose";
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
  const { prefix } = getPreferenceValues();

  if (component.type === "base") {
    // For base components, add the prefix and capitalize each word
    // e.g., "dropdown-menu" -> "UDropdownMenu"
    return prefix + pascalCase(component.camelCaseName);
  } else if (component.type === "prose") {
    // For prose components, add "Prose" prefix and capitalize
    return "Prose" + capitalizeFirstLetter(component.camelCaseName);
  } else {
    // For pro components, just capitalize each word
    return pascalCase(component.camelCaseName);
  }
}

/**
 * Helper function to get display name for the list (capitalized but without prefix)
 */
export function getDisplayName(component: ComponentItem): string {
  return capitalizeFirstLetter(component.camelCaseName);
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

    if (!context.componentInfo.exists) {
      await showToast(Toast.Style.Failure, "Component not found");
      return;
    }

    // Build documentation URL and remove #theme if not needed
    let documentationUrl = buildDocumentationUrl(context);
    if (!showTheme) {
      documentationUrl = documentationUrl.replace(/#theme$/, "");
    }

    await showAnimatedToast(`Opening ${showTheme ? "theme " : ""}documentation...`);
    await open(documentationUrl);
    await showSuccessToast("Documentation opened successfully");
  } catch (error) {
    await showFailureToast(error, { title: "Failed to open documentation" });
  }
}

/**
 * Get the appropriate icon for a component type
 */
export function getComponentIcon(type: ComponentItem["type"]): Icon {
  switch (type) {
    case "base":
      return Icon.Box;
    case "prose":
      return Icon.Text;
    default:
      return Icon.Box;
  }
}

/**
 * Get the label for a component type
 */
export function getComponentTypeLabel(type: ComponentItem["type"]): string {
  switch (type) {
    case "base":
      return "Base Component";
    case "prose":
      return "Prose Component";
    default:
      return "";
  }
}
