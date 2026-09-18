import React from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Ionicons from "@react-native-vector-icons/ionicons";

import { Screen } from "@/src/components/Screen";
import { Txt } from "@/src/components/Txt";
import { useLang } from "@/src/i18n";
import { MEMBERSHIP_TIERS } from "@/src/i18n/content";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

const HERO_ART = require("../../assets/images/hero.jpg");
const CARDS_ART = require("../../assets/images/membership-cards.jpg");

export default function HomeScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, tc, isRTL } = useLang();
  const router = useRouter();

  const forItems = [t("home_for_1"), t("home_for_2"), t("home_for_3")];
  const notForItems = [t("home_notfor_1"), t("home_notfor_2"), t("home_notfor_3")];

  return (
    <Screen testID="home-screen" contentStyle={{ padding: 0 }}>
      {/* Hero — full NESU · AI · ZERO-INTEREST artwork, centered; text sits below it */}
      <View style={styles.hero}>
        <Image source={HERO_ART} style={styles.heroImg} contentFit="contain" transition={300} />
      </View>
      <View style={styles.heroContent}>
        <Txt variant="display" size={20} weight="700" align="center" color={colors.brandPrimary}>
          {t("tagline")}
        </Txt>
        <Txt size={13} align="center" color={colors.onSurfaceSecondary} style={styles.heroInit}>
          {t("initiative")}
        </Txt>
      </View>

      <View style={styles.body}>
        {/* Summary */}
        <View style={styles.card}>
          <Txt size={15} color={colors.onSurfaceSecondary} style={styles.summary}>
            {t("home_summary")}
          </Txt>
        </View>

        {/* Membership tiers */}
        <View style={[styles.card, styles.memberCard]} testID="home-membership">
          <Txt variant="display" size={22} weight="700" color={colors.onSurface}>
            {t("home_membership_title")}
          </Txt>
          <Txt size={13} color={colors.muted} style={styles.memberSub}>
            {t("home_membership_sub")}
          </Txt>
          <Image source={CARDS_ART} style={styles.cardsImg} contentFit="cover" transition={300} />
          {MEMBERSHIP_TIERS.map((tier) => (
            <Pressable
              key={tier.key}
              testID={`home-tier-${tier.key}`}
              onPress={() => router.push("/membership")}
              style={({ pressed }) => [styles.tierRow, isRTL && styles.rowRTL, { borderColor: tier.accent }, pressed && styles.tierRowPressed]}
            >
              <View style={[styles.tierDot, { backgroundColor: tier.accent }]} />
              <View style={styles.tierText}>
                <Txt size={14} weight="700" color={tier.accent}>
                  {tc(tier.name)} {t("mem_membership")}
                </Txt>
                <Txt size={11} color={colors.muted} numberOfLines={1}>
                  {tc(tier.tagline)}
                </Txt>
              </View>
              <Txt variant="display" size={16} weight="700" color={colors.onSurface}>
                {tc(tier.amount)}
              </Txt>
              <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={16} color={colors.muted} />
            </Pressable>
          ))}
          <Pressable testID="home-membership-cta" onPress={() => router.push("/membership")} style={styles.cta}>
            <Txt size={14} weight="700" align="center" color={colors.onBrandPrimary}>
              {t("home_membership_cta")}
            </Txt>
          </Pressable>
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
  hero: { width: "100%", height: 400, alignItems: "center", justifyContent: "center", paddingTop: spacing.md },
  heroImg: { width: "100%", height: "100%" },
  heroContent: { alignItems: "center", paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.sm, gap: 4 },
  heroInit: { marginTop: 2, lineHeight: 18 },
  memberCard: { borderColor: colors.brandPrimary, gap: spacing.sm },
  memberSub: { lineHeight: 18 },
  cardsImg: { width: "100%", aspectRatio: 1200 / 800, borderRadius: radius.md, marginVertical: spacing.xs },
  tierRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 56,
    backgroundColor: colors.surfaceTertiary,
  },
  tierRowPressed: { opacity: 0.8 },
  tierDot: { width: 10, height: 10, borderRadius: 5 },
  tierText: { flex: 1 },
  cta: { backgroundColor: colors.brandPrimary, borderRadius: radius.md, minHeight: 48, justifyContent: "center", marginTop: spacing.xs },
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
