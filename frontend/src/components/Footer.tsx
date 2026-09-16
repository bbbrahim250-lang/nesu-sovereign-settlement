import React from "react";
import { View } from "react-native";

import { makeStyles, spacing } from "@/src/theme";
import { useLang } from "@/src/i18n";
import { useTheme } from "@/src/theme";
import { Txt } from "./Txt";

// Persistent legal disclaimer rendered at the bottom of every screen.
export function FooterDisclaimer() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useLang();
  return (
    <View style={styles.wrap} testID="footer-disclaimer">
      <View style={styles.rule} />
      <Txt size={11} color={colors.muted} style={styles.text}>
        {t("footerDisclaimer")}
      </Txt>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  wrap: { marginTop: spacing["2xl"] },
  rule: { height: 1, backgroundColor: colors.divider, marginBottom: spacing.md },
  text: { lineHeight: 16 },
}));
