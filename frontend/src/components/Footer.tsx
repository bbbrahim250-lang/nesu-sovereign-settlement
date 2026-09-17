import React from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@react-native-vector-icons/ionicons";

import { makeStyles, spacing, useTheme } from "@/src/theme";
import { useLang } from "@/src/i18n";
import { Txt } from "./Txt";

// Persistent legal disclaimer rendered at the bottom of every screen, with a
// discreet entry point to the protected team console.
export function FooterDisclaimer() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, isRTL } = useLang();
  const router = useRouter();
  return (
    <View style={styles.wrap} testID="footer-disclaimer">
      <View style={styles.rule} />
      <Txt size={11} color={colors.muted} style={styles.text}>
        {t("footerDisclaimer")}
      </Txt>
      <Pressable
        testID="team-console-link"
        onPress={() => router.push("/team")}
        style={[styles.teamLink, isRTL && styles.rowRTL]}
        accessibilityRole="button"
      >
        <Ionicons name="shield-checkmark-outline" size={13} color={colors.muted} />
        <Txt size={11} color={colors.muted}>
          {t("team_link")}
        </Txt>
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  wrap: { marginTop: spacing["2xl"] },
  rule: { height: 1, backgroundColor: colors.divider, marginBottom: spacing.md },
  text: { lineHeight: 16 },
  teamLink: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 36, marginTop: spacing.xs, alignSelf: "flex-start" },
  rowRTL: { flexDirection: "row-reverse", alignSelf: "flex-end" },
}));
