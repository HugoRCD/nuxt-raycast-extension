import { showToast, Toast, LaunchProps, getPreferenceValues, open, getSelectedText } from "@raycast/api";
import { kebabCase } from "scule";
import { components, proComponents } from "./components";

interface Preferences {
  prefix: string;
  version: string;
}

function sanitizeComponentName(componentName: string, prefix: string) {
  const sanitized =
    componentName.replace(prefix, "").charAt(0).toLowerCase() + componentName.replace(prefix, "").slice(1);
  return kebabCase(sanitized);
}

export default async function SearchComponentTheme(props: LaunchProps<{ arguments: Arguments.SearchComponentTheme }>) {
  const { prefix, version } = getPreferenceValues<Preferences>();
  const name = props.arguments?.componentName ?? (await getSelectedText());

  if (!name) {
    await showToast(Toast.Style.Failure, "Please select a component name");
    return;
  }
  const sanitizedName = sanitizeComponentName(name, prefix);
  if (!components.includes(sanitizedName) && !proComponents.includes(sanitizedName)) {
    await showToast(Toast.Style.Failure, "Component not found");
    return;
  }

  let versionUrl = version === "v3" ? "https://ui3.nuxt.dev" : "https://ui.nuxt.com";

  if (proComponents.includes(sanitizedName) && version === "v2") {
    versionUrl = `${versionUrl}/pro`;
  }

  await showToast(Toast.Style.Animated, "Opening documentation...");
  await open(`${versionUrl}/components/${sanitizedName}#theme`);
}
