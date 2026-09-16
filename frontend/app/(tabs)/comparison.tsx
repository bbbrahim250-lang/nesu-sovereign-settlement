import React from "react";
import { View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import { Screen } from "@/src/components/Screen";
import { ShareCard } from "@/src/components/ShareCard";
import { Txt } from "@/src/components/Txt";
import { useLang } from "@/src/i18n";
import { COMPARISON_ROWS, PRECEDENTS } from "@/src/i18n/content";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

export default function ComparisonScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, tc, isRTL } = useLang();

  const order = <T,>(cells: T[]) => (isRTL ? [...cells].reverse() : cells);

  return (
    <Screen testID="comparison-screen">
      <Txt variant="display" size={30} weight="700" color={colors.onSurface}>
        {t("comp_title")}
      </Txt>
      <Txt size={13} color={colors.muted} style={styles.sub}>
        {t("comp_sub")}
      </Txt>

      <View style={styles.table} testID="comparison-table">
        {/* header */}
        <View style={[styles.row, styles.headRow]}>
          {order([
            <HeadCell key="d" flex={1.15} text={t("comp_dimension")} />,
            <HeadCell key="n" flex={1} text={t("comp_nesu")} highlight />,
            <HeadCell key="b" flex={1} text={t("comp_bitcoin")} />,
          ])}
        </View>

        {COMPARISON_ROWS.map((r, i) => (
          <View key={i} style={[styles.row, i < COMPARISON_ROWS.length - 1 && styles.rowBorder]}>
            {order([
              <Cell key="d" flex={1.15}>
                <Txt size={12} weight="700" color={colors.onSurface}>
                  {tc(r.dimension)}
                </Txt>
              </Cell>,
              <Cell key="n" flex={1} highlight>
                <Txt size={12} color={colors.onSurfaceSecondary}>
                  {tc(r.nesu)}
                </Txt>
              </Cell>,
              <Cell key="b" flex={1}>
                <Txt size={12} color={colors.muted}>
                  {tc(r.bitcoin)}
                </Txt>
              </Cell>,
            ])}
          </View>
        ))}
      </View>

      <View style={styles.shareWrap}>
        <ShareCard heading={t("share_heading")} testID="comparison-share-card" />
      </View>

      {/* precedents */}
      <Txt variant="display" size={24} weight="700" color={colors.onSurface} style={styles.precTitle}>
        {t("comp_precedents_title")}
      </Txt>
      <Txt size={13} color={colors.muted} style={styles.sub}>
        {t("comp_precedents_sub")}
      </Txt>

      {PRECEDENTS.map((p) => (
        <View key={p.name} style={[styles.prec, isRTL && styles.rowRTL]}>
          <View style={styles.precIcon}>
            <Ionicons name="git-network" size={18} color={colors.brandPrimary} />
          </View>
          <View style={styles.precText}>
            <Txt size={15} weight="700" color={colors.onSurface}>
              {p.name}
            </Txt>
            <Txt size={13} color={colors.onSurfaceSecondary} style={styles.precDesc}>
              {tc(p.desc)}
            </Txt>
          </View>
        </View>
      ))}
    </Screen>
  );
}

function HeadCell({ flex, text, highlight }: { flex: number; text: string; highlight?: boolean }) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={[styles.cell, { flex }, highlight && styles.cellHighlight]}>
      <Txt size={12} weight="700" color={highlight ? colors.brandPrimary : colors.onSurfaceSecondary}>
        {text}
      </Txt>
    </View>
  );
}

function Cell({ flex, highlight, children }: { flex: number; highlight?: boolean; children: React.ReactNode }) {
  const styles = useStyles();
  return <View style={[styles.cell, { flex }, highlight && styles.cellHighlight]}>{children}</View>;
}

const useStyles = makeStyles((colors) => ({
  rowRTL: { flexDirection: "row-reverse" },
  sub: { marginTop: spacing.xs, marginBottom: spacing.lg, lineHeight: 19 },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  row: { flexDirection: "row" },
  headRow: { backgroundColor: colors.surfaceSecondary },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  cell: { paddingVertical: spacing.md, paddingHorizontal: spacing.sm, justifyContent: "center" },
  cellHighlight: { backgroundColor: colors.brandTertiary },
  shareWrap: { marginTop: spacing.xl },
  precTitle: { marginTop: spacing["2xl"] },
  prec: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  precIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.brandTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  precText: { flex: 1 },
  precDesc: { marginTop: 4, lineHeight: 19 },
}));
