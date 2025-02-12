import { getSelectedText } from "@raycast/api";

export async function getSelection() {
  try {
    return await getSelectedText();
  } catch (error) {
    return "";
  }
}
