// Design tokens for NESU. Dark-only sovereign palette (from design_guidelines.json).
// The single theme lives in the `light` slot with dark values so the app renders
// dark on every device regardless of the system setting.
//
// Use makeStyles() for StyleSheets and useTheme().colors for color props.

import { useMemo } from "react";
import { Appearance, StyleSheet, useColorScheme } from "react-native";

export type ColorScheme = "light" | "dark";

const dark = {
  // Surfaces
  surface: "#050A10",
  onSurface: "#F3F4F6",
  surfaceSecondary: "#0B131E",
  onSurfaceSecondary: "#E5E7EB",
  surfaceTertiary: "#111A26",
  onSurfaceTertiary: "#D1D5DB",
  surfaceInverse: "#FFFFFF",
  onSurfaceInverse: "#050A10",
  muted: "#8B98A9",

  // Brand — gold primary, green secondary
  brand: "#D4AF37",
  onBrand: "#050A10",
  brandPrimary: "#D4AF37",
  onBrandPrimary: "#050A10",
  brandSecondary: "#1E4E3B",
  onBrandSecondary: "#F3F4F6",
  brandTertiary: "#26231A",
  onBrandTertiary: "#D4AF37",

  // Status
  success: "#2E7D57",
  onSuccess: "#F3F4F6",
  warning: "#B8860B",
  onWarning: "#050A10",
  error: "#C0392B",
  onError: "#F3F4F6",
  info: "#2A3645",
  onInfo: "#F3F4F6",

  // Lines
  border: "#1F2937",
  borderStrong: "#374151",
  divider: "#1F2937",
};

export type ThemeColors = typeof dark;

export const defaultScheme = "light" satisfies ColorScheme;

// App is dark-only: the `light` slot holds the dark palette.
export const themes: { light: ThemeColors; dark?: ThemeColors } = { light: dark };

export function setColorScheme(scheme: ColorScheme | null) {
  Appearance.setColorScheme?.(scheme ?? "unspecified");
}

setColorScheme?.(themes.dark ? null : defaultScheme);

export function useTheme(): { scheme: ColorScheme; colors: ThemeColors } {
  const system = useColorScheme();
  const scheme: ColorScheme = system && themes[system] ? system : defaultScheme;
  return { scheme, colors: themes[scheme] ?? themes.light };
}

export function makeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: ThemeColors) => T & StyleSheet.NamedStyles<any>,
): () => T {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}

// Shared spacing + radius tokens (from design_guidelines.json)
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, "2xl": 32, "3xl": 48 } as const;
export const radius = { sm: 4, md: 8, lg: 16, pill: 999 } as const;
