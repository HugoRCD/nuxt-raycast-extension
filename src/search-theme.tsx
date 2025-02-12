import { showToast, Toast, LaunchProps, getPreferenceValues, open } from "@raycast/api";
import { getSelection } from "./utils";
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

export default async function SearchTheme(props: LaunchProps<{ arguments: Arguments.SearchTheme }>) {
  const { prefix, version } = getPreferenceValues<Preferences>();

  const name = props.arguments?.componentName ?? (await getSelection());

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

  /*if (proComponents.includes(name)) {
    await showToast(Toast.Style.Failure, "Pro components are not yet supported");
    return;
  }*/

  await showToast(Toast.Style.Animated, "Opening documentation...");
  await open(`${versionUrl}/components/${sanitizedName}#theme`);
}
