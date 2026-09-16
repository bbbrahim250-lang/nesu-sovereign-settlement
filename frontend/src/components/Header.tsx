import React from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { makeStyles, radius, spacing, useTheme } from "@/src/theme";
import { LANGS, useLang } from "@/src/i18n";
import { Txt } from "./Txt";

const EMBLEM = require("../../assets/images/emblem.png");

/** Official NESU gold-laurel emblem (cropped from the brand artwork). */
export function Logo({ size = 36 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Image
      source={EMBLEM}
      accessibilityLabel="NESU emblem"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: colors.brandPrimary,
      }}
      contentFit="cover"
    />
  );
}

export function Header() {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { lang, setLang, isRTL, t } = useLang();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.sm }]}>
      <View style={[styles.row, isRTL && styles.rowRTL]}>
        <View style={[styles.brandRow, isRTL && styles.rowRTL]}>
          <Logo />
          <View style={styles.brandText}>
            <Txt variant="display" size={22} weight="700" color={colors.brandPrimary} style={styles.wordmark}>
              {t("appName")}
            </Txt>
            <Txt size={10} color={colors.muted} numberOfLines={1}>
              {t("tagline")}
            </Txt>
          </View>
        </View>

        <View style={[styles.switcher, isRTL && styles.rowRTL]} testID="language-switcher">
          {LANGS.map((l) => {
            const active = l.code === lang;
            return (
              <Pressable
                key={l.code}
                testID={`lang-${l.code}`}
                onPress={() => setLang(l.code)}
                style={[styles.pill, active ? styles.pillActive : styles.pillIdle]}
                accessibilityRole="button"
                accessibilityLabel={`Language ${l.label}`}
              >
                <Txt
                  size={13}
                  weight="700"
                  align="center"
                  color={active ? colors.onBrandPrimary : colors.muted}
                >
                  {l.label}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  wrap: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowRTL: { flexDirection: "row-reverse" },
  brandRow: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  brandText: { marginHorizontal: spacing.sm, flexShrink: 1 },
  wordmark: { lineHeight: 24 },
  switcher: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },
  pill: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  pillActive: { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimary },
  pillIdle: { backgroundColor: "transparent", borderColor: colors.border },
}));
