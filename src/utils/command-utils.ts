import { showToast, Toast, Clipboard, getPreferenceValues } from "@raycast/api";

interface Preferences {
  prefix: string;
  version: string;
}

/**
 * Get the preferences for the extension
 */
export function getExtensionPreferences(): Preferences {
  return getPreferenceValues<Preferences>();
}

/**
 * Show a success toast with a message
 */
export async function showSuccessToast(message: string): Promise<void> {
  await showToast(Toast.Style.Success, message);
}

/**
 * Show a failure toast with a message
 */
export async function showFailureToast(message: string): Promise<void> {
  await showToast(Toast.Style.Failure, message);
}

/**
 * Show an animated toast with a message
 */
export async function showAnimatedToast(message: string): Promise<void> {
  await showToast(Toast.Style.Animated, message);
}

/**
 * Copy text to clipboard and show a success toast
 */
export async function copyToClipboard(text: string, successMessage: string = "Copied to clipboard"): Promise<void> {
  try {
    await Clipboard.copy(text);
    await showSuccessToast(successMessage);
  } catch (error) {
    await showFailureToast("Failed to copy to clipboard");
  }
}

/**
 * Handle errors in commands
 */
export async function handleCommandError(error: unknown, message: string = "An error occurred"): Promise<void> {
  console.error(error);
  await showFailureToast(message);
} 