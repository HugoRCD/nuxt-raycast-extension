import { $fetch } from "ofetch";

type Input = {
  /**
   * The name of the component to get the theme from
   * IMPORTANT: Use the exact camelCase name from the components list (e.g., "button", "buttonGroup")
   */
  componentName: string;
};

/**
 * Fetch the complete theme configuration for a specified Nuxt UI component
 *
 * This tool MUST be called after get-available-components and before get-component-source-code
 *
 * @param input.componentName The exact camelCase name from the components list (e.g., "button", "buttonGroup")
 * @returns The component's theme configuration as a string
 */
export default async function tool(input: Input) {
  // Convert first letter to uppercase for the API call
  const componentName = input.componentName.charAt(0).toUpperCase() + input.componentName.slice(1);

  try {
    return await $fetch(`https://raw.githubusercontent.com/nuxt/ui/refs/heads/v3/src/theme/${componentName}.ts`, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    return `Error: Could not fetch theme for ${componentName}. Please verify the component name is correct and try again.`;
  }
}
