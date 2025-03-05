import { showToast, Toast, LaunchProps, getPreferenceValues, open, getSelectedText } from "@raycast/api";
import type { ComponentContext } from "./types/components";
import { sanitizeComponentName, getComponentInfo, buildDocumentationUrl } from "./utils/components";

/**
 * Main function to handle component theme search
 */
export default async function SearchComponentTheme(props: LaunchProps<{ arguments: Arguments.SearchComponentTheme }>) {
  try {
    const { prefix, version: preferenceVersion } = getPreferenceValues<Preferences>();
    const name = props.arguments?.componentName ?? (await getSelectedText());
    const version = props.arguments?.version ?? preferenceVersion;

    if (!name) {
      await showToast(Toast.Style.Failure, "Please select a component name");
      return;
    }

    const hasProsePrefix = name.startsWith("Prose") || name.startsWith("prose");
    const sanitizedName = sanitizeComponentName(name, prefix);
    console.log(sanitizedName);
    const componentInfo = getComponentInfo(sanitizedName);

    if (!componentInfo.exists) {
      await showToast(Toast.Style.Failure, "Component not found");
      return;
    }

    const context: ComponentContext = {
      name,
      sanitizedName,
      hasProsePrefix,
      componentInfo,
    };

    const documentationUrl = buildDocumentationUrl(context, version);

    await showToast(Toast.Style.Animated, "Opening documentation...");
    await open(documentationUrl);
  } catch (error) {
    await showToast(Toast.Style.Failure, "Failed to open documentation");
  }
}
