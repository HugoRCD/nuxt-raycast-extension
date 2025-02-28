import { $fetch } from "ofetch";

type Input = {
  /**
   * The name of the component to get the code source from
   */
  componentName: string;
};

/**
 * Fetch the complete source code for a specified Nuxt UI component
 * This includes the types, props, slots, and the code template to better understand the component
 */
export default async function tool(input: Input) {
  //capitalize the first letter
  const componentName = input.componentName.charAt(0).toUpperCase() + input.componentName.slice(1);
  return await $fetch(
    `https://raw.githubusercontent.com/nuxt/ui/refs/heads/v3/src/runtime/components/${componentName}.vue`,
    {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );
}
