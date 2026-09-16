import React from "react";
import { View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import { Screen } from "@/src/components/Screen";
import { Txt } from "@/src/components/Txt";
import { useLang } from "@/src/i18n";
import { ARCHITECTURE_LAYERS } from "@/src/i18n/content";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

export default function HowItWorksScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, tc, isRTL } = useLang();

  return (
    <Screen testID="how-it-works-screen">
      {/* SERVICE != MONEY callout */}
      <View style={styles.callout}>
        <View style={[styles.calloutHead, isRTL && styles.rowRTL]}>
          <Ionicons name="warning" size={20} color={colors.warning} />
          <Txt variant="display" size={26} weight="700" color={colors.brandPrimary} style={styles.calloutTitle}>
            {t("how_callout_title")}
          </Txt>
        </View>
        <Txt size={14} color={colors.onSurfaceSecondary} style={styles.calloutBody}>
          {t("how_callout_body")}
        </Txt>
      </View>

      <Txt variant="display" size={26} weight="700" color={colors.onSurface} style={styles.sectionTitle}>
        {t("how_layers_title")}
      </Txt>
      <Txt size={13} color={colors.muted} style={styles.sectionSub}>
        {t("how_layers_sub")}
      </Txt>

      {ARCHITECTURE_LAYERS.map((layer, idx) => (
        <View key={layer.key} style={styles.layer}>
          <View style={[styles.layerRow, isRTL && styles.rowRTL]}>
            <View style={styles.iconBox}>
              <Ionicons name={layer.icon as any} size={22} color={colors.brandPrimary} />
            </View>
            <View style={styles.layerText}>
              <View style={[styles.layerTitleRow, isRTL && styles.rowRTL]}>
                <Txt size={11} weight="700" color={colors.muted} style={styles.layerNum}>
                  {String(idx + 1).padStart(2, "0")}
                </Txt>
                <Txt variant="display" size={20} weight="700" color={colors.onSurface} style={styles.layerTitle}>
                  {tc(layer.title)}
                </Txt>
              </View>
              <Txt size={13} color={colors.onSurfaceSecondary} style={styles.layerDesc}>
                {tc(layer.desc)}
              </Txt>
            </View>
          </View>
        </View>
      ))}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  rowRTL: { flexDirection: "row-reverse" },
  callout: {
    backgroundColor: colors.brandTertiary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  calloutHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  calloutTitle: { flexShrink: 1, letterSpacing: 1 },
  calloutBody: { lineHeight: 21 },
  sectionTitle: { marginBottom: spacing.xs },
  sectionSub: { marginBottom: spacing.lg },
  layer: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  layerRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.brandTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  layerText: { flex: 1 },
  layerTitleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: 4 },
  layerNum: { letterSpacing: 1 },
  layerTitle: { flexShrink: 1, lineHeight: 24 },
  layerDesc: { lineHeight: 19 },
}));
