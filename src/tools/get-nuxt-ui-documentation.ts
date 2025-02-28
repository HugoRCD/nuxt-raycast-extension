import { $fetch } from "ofetch";

/**
 * Fetch the complete documentation of Nuxt UI (through /llms_full.txt route)
 */
export default async function tool() {
  return await $fetch("https://ui3.nuxt.dev/llms_full.txt", {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
