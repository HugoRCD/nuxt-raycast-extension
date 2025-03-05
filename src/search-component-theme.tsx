import { LaunchProps, getSelectedText } from "@raycast/api";
import { openDocumentation } from "./utils/component-utils";
import { sanitizeComponentName, getComponentInfo } from "./utils/components";
import { getExtensionPreferences, showFailureToast, handleCommandError } from "./utils/command-utils";

/**
 * Main function to handle component theme search
 */
export default async function SearchComponentTheme(props: LaunchProps<{ arguments: Arguments.SearchComponentTheme }>) {
  try {
    const { prefix, version: preferenceVersion } = getExtensionPreferences();
    const name = props.arguments?.componentName ?? (await getSelectedText());
    const version = props.arguments?.version ?? preferenceVersion;

    if (!name) {
      await showFailureToast("Please select a component name");
      return;
    }

    // Create a temporary component item to use with our utility functions
    const hasProsePrefix = name.startsWith("Prose") || name.startsWith("prose");
    const sanitizedName = sanitizeComponentName(name, prefix);
    const componentInfo = getComponentInfo(sanitizedName);
    
    if (!componentInfo.exists) {
      await showFailureToast("Component not found");
      return;
    }

    // Determine component type based on name
    let type: "base" | "pro" | "prose" = "base";
    if (hasProsePrefix) {
      type = "prose";
    } else if (name.includes("Dashboard") || name.includes("Page") || name.includes("Color")) {
      type = "pro";
    }

    // Create a component item to use with our utility functions
    const componentItem = {
      name: sanitizedName,
      type,
      camelCaseName: sanitizedName
    };

    // Open the theme documentation
    await openDocumentation(componentItem, true);
  } catch (error) {
    await handleCommandError(error, "Failed to open documentation");
  }
}
