import React, { useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import dayjs from "dayjs";

import { Txt } from "@/src/components/Txt";
import { useLang } from "@/src/i18n";
import { MEMBERSHIP_TIERS } from "@/src/i18n/content";
import { fetchRequestStatus, type RequestStatus } from "@/src/api";
import { makeStyles, radius, spacing, useTheme, type ThemeColors } from "@/src/theme";

const STATUS_ICON: Record<RequestStatus["status"], string> = {
  pending_review: "time",
  in_review: "search",
  approved: "checkmark-circle",
  declined: "close-circle",
};

function statusColor(status: RequestStatus["status"], colors: ThemeColors) {
  switch (status) {
    case "approved":
      return colors.success;
    case "declined":
      return colors.error;
    case "in_review":
      return colors.warning;
    default:
      return colors.brandPrimary;
  }
}

/** Public lookup of a membership request by the ID printed on the certificate. */
export function RequestTracker({ initialId = "" }: { initialId?: string }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, tc, isRTL } = useLang();
  const [id, setId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RequestStatus | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);

  const check = async () => {
    if (!id.trim() || loading) return;
    setLoading(true);
    setNotFound(false);
    setError(false);
    setResult(null);
    try {
      const r = await fetchRequestStatus(id);
      if (r) setResult(r);
      else setNotFound(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const tier = result ? MEMBERSHIP_TIERS.find((x) => x.key === result.tier) : null;
  const color = result ? statusColor(result.status, colors) : colors.brandPrimary;

  return (
    <View style={styles.card} testID="request-tracker">
      <View style={[styles.head, isRTL && styles.rowRTL]}>
        <Ionicons name="locate" size={18} color={colors.brandPrimary} />
        <Txt variant="display" size={22} weight="700" color={colors.onSurface}>
          {t("track_title")}
        </Txt>
      </View>
      <Txt size={12} color={colors.muted} style={styles.sub}>
        {t("track_sub")}
      </Txt>

      <View style={[styles.inputRow, isRTL && styles.rowRTL]}>
        <TextInput
          value={id}
          onChangeText={setId}
          placeholder={t("track_placeholder")}
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={check}
          testID="track-input"
          style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
        />
        <Pressable
          testID="track-button"
          onPress={check}
          disabled={!id.trim() || loading}
          style={[styles.btn, (!id.trim() || loading) && styles.btnDisabled]}
        >
          {loading ? (
            <ActivityIndicator color={colors.onBrandPrimary} />
          ) : (
            <Txt size={13} weight="700" color={colors.onBrandPrimary}>
              {t("track_button")}
            </Txt>
          )}
        </Pressable>
      </View>

      {notFound ? (
        <Txt size={12} color={colors.error} style={styles.msg} testID="track-not-found">
          {t("track_not_found")}
        </Txt>
      ) : null}
      {error ? (
        <Txt size={12} color={colors.error} style={styles.msg}>
          {t("track_error")}
        </Txt>
      ) : null}

      {result ? (
        <View style={[styles.result, { borderColor: color }]} testID="track-result">
          <View style={[styles.statusRow, isRTL && styles.rowRTL]}>
            <View style={[styles.statusPill, { backgroundColor: color }]}>
              <Ionicons name={STATUS_ICON[result.status] as any} size={14} color={colors.onBrandPrimary} />
              <Txt size={12} weight="700" color={colors.onBrandPrimary} testID="track-status">
                {t(`status_${result.status}`)}
              </Txt>
            </View>
            {tier ? (
              <Txt size={12} weight="700" color={tier.accent}>
                {tc(tier.name)} {t("mem_membership")}
              </Txt>
            ) : null}
          </View>
          <Txt size={13} color={colors.onSurfaceSecondary} style={styles.desc}>
            {t(`status_${result.status}_desc`)}
          </Txt>
          <Txt size={13} weight="700" color={colors.onSurface}>
            {result.institution}
          </Txt>
          <Txt size={11} color={colors.muted}>
            {t("track_submitted")} · {dayjs(result.date).format("DD MMM YYYY")}
            {result.updated_at ? `   ${t("track_updated")} · ${dayjs(result.updated_at).format("DD MMM YYYY")}` : ""}
          </Txt>
          <Txt size={10} color={colors.muted}>
            ID · {result.id}
          </Txt>
        </View>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  rowRTL: { flexDirection: "row-reverse" },
  card: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  sub: { lineHeight: 17 },
  inputRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceTertiary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.onSurface,
    fontSize: 14,
    minHeight: 48,
  },
  btn: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: { opacity: 0.5 },
  msg: { marginTop: spacing.xs },
  result: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 6,
    backgroundColor: colors.surfaceTertiary,
  },
  statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  desc: { lineHeight: 19 },
}));
