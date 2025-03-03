import { ActionPanel, List, Action, Icon, showToast, Toast, Clipboard } from "@raycast/api";
import { useState, useEffect } from "react";
import { $fetch } from "ofetch";

interface Module {
  name: string;
  npm: string;
  description: string;
  icon?: string;
  github?: string;
  website?: string;
  category?: string;
  maintainers?: {
    name: string;
    github: string;
  }[];
  compatibility?: {
    nuxt: string;
  };
}

interface ApiResponse {
  modules: Module[]
}

export default function Command() {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function fetchModules() {
      try {
        const response = await $fetch<ApiResponse>("https://api.nuxt.com/modules");
        setModules(response.modules);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching modules:", error);
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to fetch modules",
          message: String(error),
        });
        setIsLoading(false);
      }
    }

    fetchModules();
  }, []);

  const filteredModules = modules.filter((module) => {
    if (!searchText) return true;
    return (
      module.name.toLowerCase().includes(searchText.toLowerCase()) ||
      module.description.toLowerCase().includes(searchText.toLowerCase()) ||
      module.npm.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const sortedModules = [...filteredModules].sort((a, b) => a.name.localeCompare(b.name));

  async function copyInstallCommand(npmPackage: string) {
    const command = `npm install ${npmPackage}`;
    await Clipboard.copy(command);
    await showToast({
      style: Toast.Style.Success,
      title: "Copied to clipboard",
      message: command,
    });
  }

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search Nuxt modules..."
      throttle
    >
      {sortedModules.map((module) => {
        const iconUrl = moduleImage(module.icon)
        
        return (
          <List.Item
            key={module.npm}
            icon={iconUrl || { source: Icon.Box }}
            title={module.name}
            subtitle={module.description}
            accessories={[{ text: module.npm }]}
            actions={
              <ActionPanel>
                <Action
                  title="Copy Install Command"
                  icon={{ source: Icon.CopyClipboard }}
                  onAction={() => copyInstallCommand(`npx nuxi module add ${module.name}`)}
                />
                {module.github && (
                  <Action.OpenInBrowser
                    title="Open GitHub Repository"
                    url={module.github}
                    icon={{ source: Icon.Globe }}
                  />
                )}
                {module.website && (
                  <Action.OpenInBrowser
                    title="Open Website"
                    url={module.website}
                    icon={{ source: Icon.Globe }}
                  />
                )}
                <ActionPanel.Section title="Package Managers">
                  <Action
                    title="Copy bun Command"
                    icon={{ source: Icon.CopyClipboard }}
                    onAction={() => Clipboard.copy(`bun add ${module.npm}`)}
                  />
                  <Action
                    title="Copy pnpm Command"
                    icon={{ source: Icon.CopyClipboard }}
                    onAction={() => Clipboard.copy(`pnpm add ${module.npm}`)}
                  />
                  <Action
                    title="Copy yarn Command"
                    icon={{ source: Icon.CopyClipboard }}
                    onAction={() => Clipboard.copy(`yarn add ${module.npm}`)}
                  />
                  <Action
                    title="Copy npm Command"
                    icon={{ source: Icon.CopyClipboard }}
                    onAction={() => Clipboard.copy(`npm i ${module.npm}`)}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}


export const moduleImage = function (icon: string = '', size: number = 80) {
  if (!icon) return

  if (/^http(s)?:\/\//.test(icon)) return icon

  if (/\.svg$/.test(icon)) return `https://raw.githubusercontent.com/nuxt/modules/main/icons/${icon}`

  return `https://ipx.nuxt.com/s_${size},f_auto/gh/nuxt/modules/main/icons/${icon}`
}