import React, { useRef, useState } from "react";
import { ActivityIndicator, Platform, Pressable, View } from "react-native";
import ViewShot from "react-native-view-shot";
import Ionicons from "@react-native-vector-icons/ionicons";

import { Logo } from "@/src/components/Header";
import { Txt } from "@/src/components/Txt";
import { useToast } from "@/src/components/Toast";
import { useLang } from "@/src/i18n";
import { COMPARISON_ROWS } from "@/src/i18n/content";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

// Rows of the comparison table that fit a single shareable image:
// purpose, value backing, volatility, energy footprint, cost of capital.
const CARD_ROW_INDEXES = [0, 2, 3, 4, 5];

/**
 * One-tap shareable image summarising NESU's asset backing vs Bitcoin.
 * Rendered on the Comparison tab and after the pledge certificate.
 */
export function ShareCard({ heading, testID = "share-card" }: { heading?: string; testID?: string }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, tc, isRTL } = useLang();
  const toast = useToast();
  const shotRef = useRef<ViewShot>(null);
  const [ready, setReady] = useState(false);
  const [sharing, setSharing] = useState(false);

  const onShare = async () => {
    if (!ready || sharing) return;
    setSharing(true);
    try {
      const uri = await shotRef.current!.capture!();
      if (Platform.OS === "web") {
        toast.show(t("share_ready"), "success");
      } else {
        const Sharing = await import("expo-sharing");
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: t("share_title") });
        } else {
          toast.show(t("share_ready"), "success");
        }
      }
    } catch {
      toast.show(t("share_unsupported"), "info");
    } finally {
      setSharing(false);
    }
  };

  return (
    <View style={styles.wrap} testID={testID}>
      {heading ? (
        <Txt variant="display" size={22} weight="700" color={colors.onSurface} style={styles.heading}>
          {heading}
        </Txt>
      ) : null}

      <ViewShot ref={shotRef} options={{ format: "png", quality: 1 }}>
        <View
          style={styles.card}
          collapsable={false}
          onLayout={() => requestAnimationFrame(() => setReady(true))}
          testID={`${testID}-image`}
        >
          <View style={[styles.cardHead, isRTL && styles.rowRTL]}>
            <Logo size={40} />
            <View style={styles.cardHeadText}>
              <Txt variant="display" size={20} weight="700" color={colors.brandPrimary}>
                {t("share_title")}
              </Txt>
              <Txt size={11} color={colors.muted}>
                {t("share_subtitle")}
              </Txt>
            </View>
          </View>

          <View style={[styles.legend, isRTL && styles.rowRTL]}>
            <View style={styles.legendCol} />
            <Txt size={11} weight="700" color={colors.brandPrimary} style={styles.legendCol} align="center">
              {t("comp_nesu")}
            </Txt>
            <Txt size={11} weight="700" color={colors.muted} style={styles.legendCol} align="center">
              {t("comp_bitcoin")}
            </Txt>
          </View>

          {CARD_ROW_INDEXES.map((i) => {
            const r = COMPARISON_ROWS[i];
            return (
              <View key={i} style={[styles.row, isRTL && styles.rowRTL]}>
                <Txt size={11} weight="700" color={colors.onSurfaceSecondary} style={styles.legendCol}>
                  {tc(r.dimension)}
                </Txt>
                <View style={[styles.legendCol, styles.nesuCell]}>
                  <Txt size={11} color={colors.onSurface} align="center">
                    {tc(r.nesu)}
                  </Txt>
                </View>
                <Txt size={11} color={colors.muted} style={styles.legendCol} align="center">
                  {tc(r.bitcoin)}
                </Txt>
              </View>
            );
          })}

          <View style={styles.divider} />
          <Txt size={10} align="center" color={colors.muted}>
            {t("share_footer")}
          </Txt>
        </View>
      </ViewShot>

      <Pressable
        testID={`${testID}-button`}
        onPress={onShare}
        disabled={!ready || sharing}
        style={[styles.btn, isRTL && styles.rowRTL, (!ready || sharing) && styles.btnDisabled]}
      >
        {sharing ? (
          <ActivityIndicator color={colors.brandPrimary} />
        ) : (
          <>
            <Ionicons name="share-social" size={16} color={colors.brandPrimary} />
            <Txt size={14} weight="700" color={colors.brandPrimary}>
              {ready ? t("share_cta") : t("share_preparing")}
            </Txt>
          </>
        )}
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  rowRTL: { flexDirection: "row-reverse" },
  wrap: { gap: spacing.sm },
  heading: { marginBottom: spacing.xs },
  card: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.brandPrimary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardHead: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.xs },
  cardHeadText: { flex: 1 },
  legend: {
    flexDirection: "row",
    gap: spacing.xs,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  legendCol: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  nesuCell: {
    backgroundColor: colors.brandTertiary,
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  divider: { height: 1, backgroundColor: colors.divider, marginTop: spacing.xs },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
  },
  btnDisabled: { opacity: 0.5 },
}));
