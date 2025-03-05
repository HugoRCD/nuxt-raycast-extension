import { ActionPanel, List, Action, Icon, showToast, Toast, getPreferenceValues, open } from "@raycast/api";
import { useState } from "react";
import type { ComponentContext } from "./types/components";
import { components, proComponents, proseComponents } from "./utils/components-list";
import { sanitizeComponentName, getComponentInfo, buildDocumentationUrl } from "./utils/components";

interface Preferences {
  prefix: string;
  version: string;
}

interface ComponentItem {
  name: string;
  type: "base" | "pro" | "prose";
  camelCaseName: string;
}

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { prefix, version: preferenceVersion } = getPreferenceValues<Preferences>();

  // Prepare component lists
  const baseComponents: ComponentItem[] = components.map(name => ({
    name: name,
    type: "base",
    camelCaseName: name
  }));

  const proComponentsList: ComponentItem[] = proComponents.map(name => ({
    name: name,
    type: "pro",
    camelCaseName: name
  }));

  const proseComponentsList: ComponentItem[] = proseComponents.map(name => ({
    name: name,
    type: "prose",
    camelCaseName: name
  }));

  // Combine all components
  const allComponents = [...baseComponents, ...proComponentsList, ...proseComponentsList];

  // Filter components based on search text and selected type
  const filteredComponents = allComponents.filter((component) => {
    const matchesSearchText = !searchText || 
      component.name.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesType = !selectedType || 
      (selectedType === "base" && component.type === "base") ||
      (selectedType === "pro" && component.type === "pro") ||
      (selectedType === "prose" && component.type === "prose");
    
    return matchesSearchText && matchesType;
  });

  // Sort components alphabetically
  const sortedComponents = [...filteredComponents].sort((a, b) => a.name.localeCompare(b.name));

  // Helper function to create a component context
  function createComponentContext(component: ComponentItem): ComponentContext {
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

  // Helper function to get properly formatted component name with prefix
  function getFormattedComponentName(component: ComponentItem): string {
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

  // Helper function to capitalize the first letter of a string
  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Helper function to get display name for the list (capitalized but without prefix)
  function getDisplayName(component: ComponentItem): string {
    return capitalizeFirstLetter(component.name);
  }

  // Open documentation with or without the theme section
  async function openDocumentation(component: ComponentItem, showTheme: boolean = false) {
    try {
      const context = createComponentContext(component);

      if (!context.componentInfo.exists) {
        await showToast(Toast.Style.Failure, "Component not found");
        return;
      }

      // Build documentation URL and remove #theme if not needed
      let documentationUrl = buildDocumentationUrl(context, preferenceVersion);
      if (!showTheme) {
        documentationUrl = documentationUrl.replace(/#theme$/, "");
      }

      await showToast(Toast.Style.Animated, `Opening ${showTheme ? "theme " : ""}documentation...`);
      await open(documentationUrl);
    } catch (error) {
      await showToast(Toast.Style.Failure, "Failed to open documentation");
    }
  }

  return (
    <List
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search Nuxt UI components..."
      throttle
      searchBarAccessory={
        <List.Dropdown
          tooltip="Filter by Type"
          value={selectedType || ""}
          onChange={setSelectedType}
        >
          <List.Dropdown.Item title="All Types" value="" />
          <List.Dropdown.Item title="Base Components" value="base" />
          <List.Dropdown.Item title="Pro Components" value="pro" />
          <List.Dropdown.Item title="Prose Components" value="prose" />
        </List.Dropdown>
      }
    >
      {sortedComponents.map((component) => {
        return (
          <List.Item
            key={`${component.type}-${component.name}`}
            icon={getComponentIcon(component.type)}
            title={getDisplayName(component)}
            subtitle={getComponentTypeLabel(component.type)}
            actions={
              <ActionPanel>
                <Action
                  title="Open Documentation"
                  icon={Icon.Book}
                  onAction={() => openDocumentation(component, false)}
                />
                <Action
                  title="Open Theme Documentation"
                  icon={Icon.Brush}
                  onAction={() => openDocumentation(component, true)}
                />
                <Action.CopyToClipboard
                  title="Copy Component Name"
                  content={getFormattedComponentName(component)}
                />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}

function getComponentIcon(type: string) {
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

function getComponentTypeLabel(type: string) {
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