import { components, proseComponents, proComponents } from "../components";

/**
 * Get the list of available components and their type (pro, prose, etc...)
 *
 * @returns { components: string[], proComponents: string[], proseComponents: string[] }
 */
export default async function tool() {
  return {
    components: components,
    proComponents: proComponents,
    proseComponents: proseComponents
  }
};
