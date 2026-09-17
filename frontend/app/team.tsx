import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, RefreshControl, ScrollView, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import { Header } from "@/src/components/Header";
import { Txt } from "@/src/components/Txt";
import { useToast } from "@/src/components/Toast";
import { useLang } from "@/src/i18n";
import { MEMBERSHIP_TIERS, REGIONS } from "@/src/i18n/content";
import {
  listMemberships,
  UnauthorizedError,
  updateMembershipStatus,
  verifyAdminKey,
  type MembershipRecord,
  type RequestStatus,
} from "@/src/api";
import { clearTeamKey, loadTeamKey, saveTeamKey } from "@/src/team-key";
import { makeStyles, radius, spacing, useTheme, type ThemeColors } from "@/src/theme";

type Status = RequestStatus["status"];
const STATUSES: Status[] = ["pending_review", "in_review", "approved", "declined"];

function statusColor(status: Status, colors: ThemeColors) {
  if (status === "approved") return colors.success;
  if (status === "declined") return colors.error;
  if (status === "in_review") return colors.warning;
  return colors.brandPrimary;
}

/** Protected team console: unlock with the team access key, then review requests. */
export default function TeamScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, isRTL } = useLang();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [key, setKey] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    loadTeamKey()
      .then((k) => setKey(k))
      .finally(() => setBooting(false));
  }, []);

  const lock = async () => {
    await clearTeamKey();
    setKey(null);
  };

  return (
    <View style={styles.root} testID="team-screen">
      <Header />
      <View style={[styles.topRow, isRTL && styles.rowRTL]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, isRTL && styles.rowRTL]} testID="team-back" accessibilityRole="button">
          <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={20} color={colors.brandPrimary} />
          <Txt size={14} weight="600" color={colors.brandPrimary}>
            {t("back")}
          </Txt>
        </Pressable>
        {key ? (
          <Pressable onPress={lock} style={[styles.backBtn, isRTL && styles.rowRTL]} testID="team-lock">
            <Ionicons name="lock-closed" size={16} color={colors.muted} />
            <Txt size={13} color={colors.muted}>
              {t("team_lock")}
            </Txt>
          </Pressable>
        ) : null}
      </View>

      {booting ? (
        <ActivityIndicator color={colors.brandPrimary} style={{ marginTop: spacing["2xl"] }} />
      ) : key ? (
        <Console adminKey={key} onUnauthorized={lock} bottomInset={insets.bottom} />
      ) : (
        <Unlock onUnlocked={setKey} />
      )}
    </View>
  );
}

function Unlock({ onUnlocked }: { onUnlocked: (key: string) => void }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, isRTL } = useLang();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const submit = async () => {
    if (!value.trim() || busy) return;
    setBusy(true);
    setInvalid(false);
    try {
      const ok = await verifyAdminKey(value.trim());
      if (ok) {
        await saveTeamKey(value.trim());
        onUnlocked(value.trim());
      } else {
        setInvalid(true);
      }
    } catch {
      setInvalid(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.body}>
      <Txt variant="display" size={30} weight="700" color={colors.onSurface}>
        {t("team_title")}
      </Txt>
      <Txt size={13} color={colors.muted} style={styles.sub}>
        {t("team_sub")}
      </Txt>
      <View style={styles.card}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={t("team_key_placeholder")}
          placeholderTextColor={colors.muted}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={submit}
          testID="team-key-input"
          style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
        />
        {invalid ? (
          <Txt size={12} color={colors.error} testID="team-key-invalid">
            {t("team_invalid_key")}
          </Txt>
        ) : null}
        <Pressable testID="team-unlock" onPress={submit} disabled={!value.trim() || busy} style={[styles.primary, (!value.trim() || busy) && styles.disabled]}>
          {busy ? (
            <ActivityIndicator color={colors.onBrandPrimary} />
          ) : (
            <Txt size={15} weight="700" align="center" color={colors.onBrandPrimary}>
              {t("team_unlock")}
            </Txt>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function Console({ adminKey, onUnauthorized, bottomInset }: { adminKey: string; onUnauthorized: () => void; bottomInset: number }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, isRTL } = useLang();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Status | "all">("all");

  const query = useQuery({
    queryKey: ["admin-memberships", filter],
    queryFn: () => listMemberships(adminKey, filter === "all" ? undefined : filter),
  });

  useEffect(() => {
    if (query.error instanceof UnauthorizedError) onUnauthorized();
  }, [query.error, onUnauthorized]);

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) => updateMembershipStatus(adminKey, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-memberships"] });
      queryClient.invalidateQueries({ queryKey: ["totals"] });
      toast.show(t("team_updated"), "success");
    },
    onError: (e) => {
      if (e instanceof UnauthorizedError) onUnauthorized();
      else toast.show(t("team_error"), "error");
    },
  });

  const confirmChange = (id: string, status: Status) => {
    const run = () => mutation.mutate({ id, status });
    if (Platform.OS === "web") {
      if (window.confirm(`${t("team_confirm_title")} ${t("team_confirm_msg")}`)) run();
      return;
    }
    Alert.alert(t("team_confirm_title"), t("team_confirm_msg"), [
      { text: t("team_cancel"), style: "cancel" },
      { text: t("team_confirm_yes"), onPress: run },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.body, { paddingBottom: bottomInset + spacing.xl }]}
      refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={query.refetch} tintColor={colors.brandPrimary} />}
      testID="team-console"
    >
      <Txt variant="display" size={30} weight="700" color={colors.onSurface}>
        {t("team_title")}
      </Txt>
      <Txt size={13} color={colors.muted} style={styles.sub}>
        {t("team_sub")}
      </Txt>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters} style={styles.filtersScroll}>
        {(["all", ...STATUSES] as (Status | "all")[]).map((s) => {
          const active = filter === s;
          return (
            <Pressable key={s} testID={`filter-${s}`} onPress={() => setFilter(s)} style={[styles.pill, active ? styles.pillActive : styles.pillIdle]}>
              <Txt size={12} weight="700" color={active ? colors.onBrandPrimary : colors.onSurfaceSecondary}>
                {s === "all" ? t("team_all") : t(`status_${s}`)}
              </Txt>
            </Pressable>
          );
        })}
      </ScrollView>

      {query.isLoading ? (
        <ActivityIndicator color={colors.brandPrimary} style={{ marginVertical: spacing.xl }} />
      ) : !query.data?.length ? (
        <Txt size={13} color={colors.muted} align="center" style={styles.empty} testID="team-empty">
          {t("team_empty")}
        </Txt>
      ) : (
        query.data.map((m) => (
          <RequestCard key={m.id} record={m} busy={mutation.isPending && mutation.variables?.id === m.id} onChange={(s) => confirmChange(m.id, s)} isRTL={isRTL} />
        ))
      )}
    </ScrollView>
  );
}

function RequestCard({ record: m, busy, onChange, isRTL }: { record: MembershipRecord; busy: boolean; onChange: (s: Status) => void; isRTL: boolean }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, tc } = useLang();
  const tier = MEMBERSHIP_TIERS.find((x) => x.key === m.tier);
  const region = REGIONS.find((r) => r.key === m.region);
  const color = statusColor(m.status, colors);

  return (
    <View style={[styles.card, { borderColor: color }]} testID={`request-${m.id}`}>
      <View style={[styles.cardHead, isRTL && styles.rowRTL]}>
        <View style={styles.cardHeadText}>
          <Txt size={16} weight="700" color={colors.onSurface}>
            {m.institution}
          </Txt>
          <Txt size={12} color={colors.onSurfaceSecondary}>
            {m.name} · {m.country}
          </Txt>
        </View>
        <View style={[styles.statusPill, { backgroundColor: color }]}>
          <Txt size={11} weight="700" color={colors.onBrandPrimary} testID={`status-${m.id}`}>
            {t(`status_${m.status}`)}
          </Txt>
        </View>
      </View>

      <View style={[styles.metaRow, isRTL && styles.rowRTL]}>
        {tier ? (
          <Txt size={12} weight="700" color={tier.accent}>
            {tc(tier.name)} {t("mem_membership")} · {tc(tier.amount)}
          </Txt>
        ) : null}
        <Txt size={12} color={colors.muted}>
          {region ? tc(region.label) : m.region}
        </Txt>
      </View>
      <Txt size={12} color={colors.brandPrimary} selectable>
        {m.email}
      </Txt>
      {m.message ? (
        <Txt size={12} color={colors.onSurfaceSecondary} style={styles.message}>
          {t("team_message")}: {m.message}
        </Txt>
      ) : null}
      <Txt size={10} color={colors.muted}>
        {t("team_requested")} · {dayjs(m.created_at).format("DD MMM YYYY HH:mm")} · ID {m.id}
      </Txt>

      <Txt size={11} weight="700" color={colors.muted} style={styles.setLabel}>
        {t("team_set_status").toUpperCase()}
      </Txt>
      <View style={[styles.actions, isRTL && styles.rowRTL]}>
        {STATUSES.filter((s) => s !== m.status).map((s) => (
          <Pressable
            key={s}
            testID={`set-${s}-${m.id}`}
            disabled={busy}
            onPress={() => onChange(s)}
            style={[styles.action, { borderColor: statusColor(s, colors) }, busy && styles.disabled]}
          >
            <Txt size={12} weight="700" color={statusColor(s, colors)}>
              {t(`status_${s}`)}
            </Txt>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  rowRTL: { flexDirection: "row-reverse" },
  root: { flex: 1, backgroundColor: colors.surface },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.md },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, minHeight: 44, paddingHorizontal: spacing.xs },
  body: { padding: spacing.lg, gap: spacing.md },
  sub: { lineHeight: 19, marginBottom: spacing.xs },
  card: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceTertiary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.onSurface,
    fontSize: 15,
    minHeight: 48,
  },
  primary: { backgroundColor: colors.brandPrimary, borderRadius: radius.md, minHeight: 48, justifyContent: "center", marginTop: spacing.xs },
  disabled: { opacity: 0.5 },
  filtersScroll: { marginHorizontal: -spacing.lg },
  filters: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  pill: { paddingHorizontal: spacing.md, minHeight: 40, justifyContent: "center", borderRadius: radius.pill, borderWidth: 1 },
  pillActive: { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimary },
  pillIdle: { backgroundColor: colors.surfaceTertiary, borderColor: colors.border },
  empty: { marginVertical: spacing.xl },
  cardHead: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.sm },
  cardHeadText: { flex: 1, gap: 2 },
  statusPill: { paddingHorizontal: spacing.sm, paddingVertical: 5, borderRadius: radius.pill },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm, flexWrap: "wrap" },
  message: { lineHeight: 18 },
  setLabel: { letterSpacing: 1, marginTop: spacing.xs },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  action: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.md, minHeight: 40, justifyContent: "center" },
}));
