import { showToast, Toast, LaunchProps, getPreferenceValues, open, getSelectedText } from "@raycast/api";
import { kebabCase, camelCase } from "scule";
import { components, proComponents, proseComponents } from "./components";

interface Preferences {
  prefix: string;
  version: string;
}

function sanitizeComponentName(componentName: string, prefix: string) {
  const sanitized =
    componentName.replace(prefix, "").charAt(0).toLowerCase() + componentName.replace(prefix, "").slice(1);
  return kebabCase(sanitized);
}

function findComponent(sanitizedName: string): { exists: boolean; isPro: boolean, isProse: boolean } {
  const camelCaseName = camelCase(sanitizedName);

  const componentExists = components.includes(camelCaseName);

  const proComponentExists = proComponents.includes(camelCaseName);

  const proseComponentExists = proseComponents.includes(sanitizedName);

  return {
    exists: componentExists || proComponentExists || proseComponentExists,
    isPro: proComponentExists,
    isProse: proseComponentExists,
  };
}

export default async function SearchComponentTheme(props: LaunchProps<{ arguments: Arguments.SearchComponentTheme }>) {
  const { prefix, version } = getPreferenceValues<Preferences>();
  const name = props.arguments?.componentName ?? (await getSelectedText());

  if (!name) {
    await showToast(Toast.Style.Failure, "Please select a component name");
    return;
  }

  const sanitizedName = sanitizeComponentName(name, prefix);
  const { exists, isPro, isProse } = findComponent(sanitizedName);

  if (!exists) {
    await showToast(Toast.Style.Failure, "Component not found");
    return;
  }

  let versionUrl = version === "v3" ? "https://ui3.nuxt.dev" : "https://ui.nuxt.com";

  if (isPro && version === "v2") {
    versionUrl = `${versionUrl}/pro`;
  }

  await showToast(Toast.Style.Animated, "Opening documentation...");
  if (!isProse) {
    await open(`${versionUrl}/components/${sanitizedName}#theme`);
  } else {
    await open(`https://ui3.nuxt.dev/getting-started/typography#${sanitizedName}`);
  }
}
