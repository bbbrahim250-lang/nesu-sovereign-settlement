import React from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@react-native-vector-icons/ionicons";

import { Screen } from "@/src/components/Screen";
import { Logo } from "@/src/components/Header";
import { Txt } from "@/src/components/Txt";
import { useLang } from "@/src/i18n";
import { HERO_MAP_IMAGE } from "@/src/i18n/content";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

export default function HomeScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, isRTL } = useLang();

  const forItems = [t("home_for_1"), t("home_for_2"), t("home_for_3")];
  const notForItems = [t("home_notfor_1"), t("home_notfor_2"), t("home_notfor_3")];

  return (
    <Screen testID="home-screen" contentStyle={{ padding: 0 }}>
      {/* Hero */}
      <View style={styles.hero}>
        <Image source={{ uri: HERO_MAP_IMAGE }} style={styles.heroImg} contentFit="cover" transition={300} />
        <LinearGradient
          colors={["rgba(5,10,16,0.35)", "rgba(5,10,16,0.95)"]}
          style={styles.heroOverlay}
        />
        <View style={styles.heroContent}>
          <Logo size={56} />
          <Txt variant="display" size={44} weight="700" align="center" color={colors.brandPrimary} style={styles.heroTitle}>
            {t("appName")}
          </Txt>
          <Txt size={15} weight="600" align="center" color={colors.onSurface}>
            {t("tagline")}
          </Txt>
          <Txt size={12} align="center" color={colors.muted} style={styles.heroInit}>
            {t("initiative")}
          </Txt>
        </View>
      </View>

      <View style={styles.body}>
        {/* Summary */}
        <View style={styles.card}>
          <Txt size={15} color={colors.onSurfaceSecondary} style={styles.summary}>
            {t("home_summary")}
          </Txt>
        </View>

        {/* Who for */}
        <View style={[styles.card, styles.forCard]}>
          <View style={[styles.cardHead, isRTL && styles.rowRTL]}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Txt variant="display" size={22} weight="700" color={colors.onSurface} style={styles.cardTitle}>
              {t("home_for_title")}
            </Txt>
          </View>
          {forItems.map((it, i) => (
            <Row key={i} icon="checkmark" color={colors.success} text={it} isRTL={isRTL} />
          ))}
        </View>

        {/* Who not for */}
        <View style={[styles.card, styles.notForCard]}>
          <View style={[styles.cardHead, isRTL && styles.rowRTL]}>
            <Ionicons name="close-circle" size={20} color={colors.error} />
            <Txt variant="display" size={22} weight="700" color={colors.onSurface} style={styles.cardTitle}>
              {t("home_notfor_title")}
            </Txt>
          </View>
          {notForItems.map((it, i) => (
            <Row key={i} icon="close" color={colors.error} text={it} isRTL={isRTL} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

function Row({ icon, color, text, isRTL }: { icon: string; color: string; text: string; isRTL: boolean }) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={[styles.itemRow, isRTL && styles.rowRTL]}>
      <Ionicons name={icon as any} size={16} color={color} style={styles.itemIcon} />
      <Txt size={14} color={colors.onSurfaceSecondary} style={styles.itemText}>
        {text}
      </Txt>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  hero: { height: 260, justifyContent: "flex-end" },
  heroImg: { ...StyleSheet.absoluteFillObject },
  heroOverlay: { ...StyleSheet.absoluteFillObject },
  heroContent: { alignItems: "center", padding: spacing.xl, gap: 4 },
  heroTitle: { lineHeight: 48, letterSpacing: 1 },
  heroInit: { marginTop: spacing.xs },
  body: { padding: spacing.lg, gap: spacing.lg },
  card: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  forCard: { borderColor: colors.brandSecondary },
  notForCard: { borderColor: colors.border },
  summary: { lineHeight: 23 },
  cardHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  rowRTL: { flexDirection: "row-reverse" },
  cardTitle: { flexShrink: 1 },
  itemRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingVertical: 6 },
  itemIcon: { marginTop: 2 },
  itemText: { flex: 1, lineHeight: 20 },
}));
