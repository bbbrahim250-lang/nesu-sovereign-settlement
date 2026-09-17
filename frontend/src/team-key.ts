import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "nesu.team.key";

// The team access key lives in the device keychain on iOS/Android; the web
// preview has no SecureStore, so it falls back to AsyncStorage there.
export async function loadTeamKey(): Promise<string | null> {
  if (Platform.OS === "web") return AsyncStorage.getItem(KEY);
  const SecureStore = await import("expo-secure-store");
  return SecureStore.getItemAsync(KEY);
}

export async function saveTeamKey(value: string): Promise<void> {
  if (Platform.OS === "web") return AsyncStorage.setItem(KEY, value);
  const SecureStore = await import("expo-secure-store");
  return SecureStore.setItemAsync(KEY, value);
}

export async function clearTeamKey(): Promise<void> {
  if (Platform.OS === "web") return AsyncStorage.removeItem(KEY);
  const SecureStore = await import("expo-secure-store");
  return SecureStore.deleteItemAsync(KEY);
}
