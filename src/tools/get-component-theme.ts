import { $fetch } from "ofetch";

type Input = {
  /**
   * The name of the component to get the theme from
   */
  componentName: string;
};

/**
 * Fetch the complete theme for a specified Nuxt UI component
 * Useful to customize a button using the `:ui` prop
 * This defines the slots and the styles for the component
 */
export default async function tool(input: Input) {
  return await $fetch(`https://raw.githubusercontent.com/nuxt/ui/refs/heads/v3/src/theme/${input.componentName}.ts`, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
