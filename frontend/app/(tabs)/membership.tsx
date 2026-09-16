import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import ViewShot from "react-native-view-shot";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import { Screen } from "@/src/components/Screen";
import { Logo } from "@/src/components/Header";
import { RequestTracker } from "@/src/components/RequestTracker";
import { ShareCard } from "@/src/components/ShareCard";
import { TierBenefits, TierCompareModal } from "@/src/components/TierBenefits";
import { Txt } from "@/src/components/Txt";
import { useToast } from "@/src/components/Toast";
import { useLang } from "@/src/i18n";
import { MEMBERSHIP_TIERS, REGIONS, type MembershipTier } from "@/src/i18n/content";
import { fetchTotals, submitMembership, type Certificate } from "@/src/api";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

const CARD_WIDTH = 272;

export default function MembershipScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, tc, isRTL } = useLang();
  const toast = useToast();
  const queryClient = useQueryClient();

  const totalsQuery = useQuery({ queryKey: ["totals"], queryFn: fetchTotals });

  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [tierKey, setTierKey] = useState<string>(MEMBERSHIP_TIERS[0].key);
  const [region, setRegion] = useState<string | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [certReady, setCertReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const shotRef = useRef<ViewShot>(null);

  const mutation = useMutation({
    mutationFn: submitMembership,
    onSuccess: (cert) => {
      setCertificate(cert);
      setCertReady(false);
      queryClient.invalidateQueries({ queryKey: ["totals"] });
      toast.show(t("mem_success"), "success");
    },
    onError: () => toast.show(t("mem_error"), "error"),
  });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit =
    name.trim() && institution.trim() && country.trim() && emailValid && region && !mutation.isPending;

  const onSubmit = () => {
    if (!canSubmit) {
      toast.show(t("mem_required"), "error");
      return;
    }
    mutation.mutate({
      name: name.trim(),
      institution: institution.trim(),
      country: country.trim(),
      email: email.trim(),
      message: message.trim() || undefined,
      tier: tierKey,
      region: region!,
    });
  };

  const resetForm = () => {
    setCertificate(null);
    setCertReady(false);
    setName("");
    setInstitution("");
    setCountry("");
    setEmail("");
    setMessage("");
    setTierKey(MEMBERSHIP_TIERS[0].key);
    setRegion(null);
  };

  const onSaveShare = async () => {
    if (!certReady || saving) return;
    setSaving(true);
    try {
      const uri = await shotRef.current!.capture!();
      if (Platform.OS === "web") {
        toast.show(t("cert_shared"), "success");
      } else {
        // Loaded dynamically so the web bundle never touches native-only modules.
        const MediaLibrary = await import("expo-media-library");
        const Sharing = await import("expo-sharing");
        const perm = await MediaLibrary.requestPermissionsAsync();
        if (perm.granted) {
          await MediaLibrary.saveToLibraryAsync(uri);
          toast.show(t("cert_saved"), "success");
        }
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else if (!perm.granted) {
          toast.show(t("cert_shared"), "success");
        }
      }
    } catch {
      toast.show(t("cert_export_unsupported"), "info");
    } finally {
      setSaving(false);
    }
  };

  const regionLabel = useMemo(() => {
    if (!certificate) return "";
    const r = REGIONS.find((x) => x.key === certificate.region);
    return r ? tc(r.label) : certificate.region;
  }, [certificate, tc]);

  const selectedTier = MEMBERSHIP_TIERS.find((x) => x.key === tierKey)!;
  const orderedTiers = isRTL ? [...MEMBERSHIP_TIERS].reverse() : MEMBERSHIP_TIERS;

  return (
    <Screen testID="membership-screen" keyboardAware>
      <Txt variant="display" size={30} weight="700" color={colors.onSurface}>
        {t("mem_title")}
      </Txt>
      <Txt size={13} color={colors.muted} style={styles.sub}>
        {t("mem_sub")}
      </Txt>

      {/* Live shared totals */}
      <View style={styles.totalsCard} testID="membership-totals">
        <Txt size={13} weight="600" color={colors.muted}>
          {t("mem_totals_title")}
        </Txt>
        {totalsQuery.isLoading ? (
          <ActivityIndicator color={colors.brandPrimary} style={{ marginVertical: spacing.md }} />
        ) : (
          <>
            <Txt variant="display" size={48} weight="700" color={colors.brandPrimary} testID="membership-total-count">
              {totalsQuery.data?.total ?? 0}
            </Txt>
            <Txt size={12} color={colors.muted} style={styles.byRegionLabel}>
              {t("mem_totals_by_region")}
            </Txt>
            <View style={styles.regionGrid}>
              {REGIONS.map((r) => (
                <View key={r.key} style={[styles.regionStat, isRTL && styles.rowRTL]} testID={`total-${r.key}`}>
                  <Txt size={12} color={colors.onSurfaceSecondary} style={styles.regionStatLabel} numberOfLines={2}>
                    {tc(r.label)}
                  </Txt>
                  <View style={styles.countPill}>
                    <Txt size={12} weight="700" color={colors.brandPrimary}>
                      {totalsQuery.data?.by_region?.[r.key] ?? 0}
                    </Txt>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      {certificate ? (
        <CertificateBlock
          certificate={certificate}
          tier={MEMBERSHIP_TIERS.find((x) => x.key === certificate.tier) ?? selectedTier}
          regionLabel={regionLabel}
          shotRef={shotRef}
          onLayoutReady={() => setCertReady(true)}
          certReady={certReady}
          saving={saving}
          onSaveShare={onSaveShare}
          onReset={resetForm}
        />
      ) : (
        <View style={styles.form}>
          {/* Tier cards */}
          <Field label={t("mem_tier")} hint={t("mem_tier_hint")}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsRow}
              style={styles.cardsScroll}
              testID="tier-cards"
            >
              {orderedTiers.map((tier) => (
                <TierCard key={tier.key} tier={tier} active={tier.key === tierKey} onPress={() => setTierKey(tier.key)} />
              ))}
            </ScrollView>
            <View style={[styles.selectedRow, isRTL && styles.rowRTL]} testID="selected-tier">
              <View style={[styles.dot, { backgroundColor: selectedTier.accent }]} />
              <Txt size={13} weight="700" color={colors.onSurface}>
                {tc(selectedTier.name)} {t("mem_membership")}
              </Txt>
              <Txt size={13} color={colors.muted}>
                · {tc(selectedTier.amount)}
              </Txt>
            </View>

            {/* What the tapped tier unlocks */}
            <View style={[styles.benefitsPanel, { borderColor: selectedTier.accent }]} testID="tier-benefits">
              <Txt size={11} weight="700" color={selectedTier.accent} style={styles.benefitsTitle}>
                {t("mem_benefits_title").toUpperCase()}
              </Txt>
              <TierBenefits tier={selectedTier} />
              <Pressable
                testID="compare-tiers"
                onPress={() => setCompareOpen(true)}
                style={[styles.compareLink, isRTL && styles.rowRTL]}
                accessibilityRole="button"
              >
                <Ionicons name="git-compare" size={14} color={colors.brandPrimary} />
                <Txt size={13} weight="700" color={colors.brandPrimary}>
                  {t("mem_compare_all")}
                </Txt>
              </Pressable>
            </View>
          </Field>

          <Field label={t("mem_name")}>
            <Input value={name} onChangeText={setName} testID="input-name" />
          </Field>
          <Field label={t("mem_institution")}>
            <Input value={institution} onChangeText={setInstitution} testID="input-institution" />
          </Field>
          <Field label={t("mem_country")}>
            <Input value={country} onChangeText={setCountry} testID="input-country" />
          </Field>
          <Field label={t("mem_email")}>
            <Input
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              testID="input-email"
            />
          </Field>

          {/* Region select */}
          <Field label={t("mem_region")} hint={t("mem_region_hint")}>
            <View style={styles.pillWrap}>
              {REGIONS.map((r) => {
                const active = region === r.key;
                return (
                  <Pressable
                    key={r.key}
                    testID={`region-${r.key}`}
                    onPress={() => setRegion(r.key)}
                    style={[styles.regionPill, active ? styles.pillActive : styles.pillIdle]}
                  >
                    <Txt
                      size={13}
                      weight="600"
                      align="center"
                      color={active ? colors.onBrandPrimary : colors.onSurfaceSecondary}
                    >
                      {tc(r.label)}
                    </Txt>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label={t("mem_message")}>
            <Input value={message} onChangeText={setMessage} multiline testID="input-message" />
          </Field>

          {/* Privacy notice */}
          <View style={[styles.privacyRow, isRTL && styles.rowRTL]}>
            <Ionicons name="lock-closed" size={14} color={colors.muted} style={{ marginTop: 2 }} />
            <Txt size={11} color={colors.muted} style={styles.privacyText}>
              {t("mem_privacy")}
            </Txt>
          </View>

          <Pressable
            testID="submit-membership"
            onPress={onSubmit}
            disabled={!canSubmit}
            style={[styles.submit, !canSubmit && styles.submitDisabled]}
          >
            {mutation.isPending ? (
              <ActivityIndicator color={colors.onBrandPrimary} />
            ) : (
              <Txt size={15} weight="700" align="center" color={colors.onBrandPrimary}>
                {t("mem_submit")}
              </Txt>
            )}
          </Pressable>
        </View>
      )}

      <View style={styles.trackerWrap}>
        <RequestTracker initialId={certificate?.id ?? ""} key={certificate?.id ?? "blank"} />
      </View>

      <TierCompareModal
        visible={compareOpen}
        selectedKey={tierKey}
        onSelect={setTierKey}
        onClose={() => setCompareOpen(false)}
      />
    </Screen>
  );
}

/** A selectable membership card modelled on the NESU GOV · POWER · TRADE · CARD artwork. */
function TierCard({ tier, active, onPress }: { tier: MembershipTier; active: boolean; onPress: () => void }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, tc, isRTL } = useLang();
  return (
    <Pressable
      testID={`tier-${tier.key}`}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[
        styles.card,
        { backgroundColor: tier.body, borderColor: active ? colors.brandPrimary : tier.accent },
        active && styles.cardActive,
      ]}
    >
      <View style={[styles.cardTop, isRTL && styles.rowRTL]}>
        <View style={[styles.cardBrand, isRTL && styles.rowRTL]}>
          <Logo size={26} />
          <Txt variant="display" size={16} weight="700" color={tier.accent}>
            NESU
          </Txt>
        </View>
        <Txt size={8} weight="700" color={tier.accent} style={styles.cardLine}>
          {t("mem_card_line")}
        </Txt>
      </View>

      <View style={styles.cardMid}>
        <View style={[styles.chip, { borderColor: tier.accent }]} />
        <View style={styles.cardMidText}>
          <Txt variant="display" size={22} weight="700" color={tier.accent}>
            {tc(tier.name).toUpperCase()}
          </Txt>
          <Txt size={9} weight="700" color={colors.onSurfaceSecondary} style={styles.cardLine}>
            {t("mem_membership").toUpperCase()}
          </Txt>
        </View>
      </View>

      <Txt variant="display" size={20} weight="700" color={colors.onSurface}>
        {tc(tier.amount)}
      </Txt>

      <View style={[styles.cardBottom, isRTL && styles.rowRTL]}>
        <Txt size={9} weight="700" color={colors.onSurfaceSecondary} style={styles.cardLine}>
          {t("mem_global_member")}
        </Txt>
        {active ? <Ionicons name="checkmark-circle" size={18} color={colors.brandPrimary} /> : null}
      </View>
      <Txt size={9} color={tier.accent} numberOfLines={1}>
        {tc(tier.tagline)}
      </Txt>
    </Pressable>
  );
}

function CertificateBlock({
  certificate,
  tier,
  regionLabel,
  shotRef,
  onLayoutReady,
  certReady,
  saving,
  onSaveShare,
  onReset,
}: {
  certificate: Certificate;
  tier: MembershipTier;
  regionLabel: string;
  shotRef: React.RefObject<ViewShot>;
  onLayoutReady: () => void;
  certReady: boolean;
  saving: boolean;
  onSaveShare: () => void;
  onReset: () => void;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, tc } = useLang();

  return (
    <View style={styles.certWrap}>
      <ViewShot ref={shotRef} options={{ format: "png", quality: 1 }}>
        <View
          style={[styles.cert, { borderColor: tier.accent }]}
          collapsable={false}
          // Enable save/share only once the certificate has fully laid out —
          // capturing before layout produces a blank/zero-size image.
          onLayout={() => requestAnimationFrame(onLayoutReady)}
          testID="certificate"
        >
          {/* watermark */}
          <View style={styles.watermark}>
            <Txt size={13} weight="700" align="center" color={colors.brandPrimary} style={styles.watermarkText}>
              {t("cert_watermark")}
            </Txt>
          </View>

          <View style={styles.certHead}>
            <Logo size={48} />
            <Txt size={9} weight="700" color={colors.muted} style={styles.cardLine}>
              {t("mem_card_line")}
            </Txt>
            <Txt variant="display" size={24} weight="700" align="center" color={colors.brandPrimary} style={styles.certTitle}>
              {t("cert_title")}
            </Txt>
          </View>

          <View style={styles.certDivider} />

          <View style={styles.certRow}>
            <Txt size={11} weight="600" align="center" color={colors.muted}>
              {t("cert_tier").toUpperCase()}
            </Txt>
            <View style={[styles.tierBadge, { borderColor: tier.accent }]}>
              <View style={[styles.dot, { backgroundColor: tier.accent }]} />
              <Txt variant="display" size={22} weight="700" color={tier.accent}>
                {tc(tier.name)} {t("mem_membership")}
              </Txt>
            </View>
            <Txt size={15} weight="700" align="center" color={colors.onSurface}>
              {tc(tier.amount)}
            </Txt>
          </View>

          <CertRow label={t("cert_name")} value={certificate.name} />
          <CertRow label={t("cert_institution")} value={certificate.institution} />
          <CertRow label={t("cert_region")} value={regionLabel} />
          <CertRow label={t("cert_date")} value={dayjs(certificate.date).format("DD MMM YYYY")} />
          <CertRow label={t("cert_status")} value={t("cert_status_value")} small />

          <View style={styles.certDivider} />
          <Txt size={11} align="center" color={colors.muted}>
            {t("cert_issued")}
          </Txt>
          <Txt size={10} align="center" color={colors.muted} style={styles.certId}>
            ID · {certificate.id}
          </Txt>
          <Txt size={10} align="center" color={colors.brandPrimary} style={styles.certId}>
            {t("track_keep_id")}
          </Txt>
        </View>
      </ViewShot>

      <Pressable
        testID="save-certificate"
        onPress={onSaveShare}
        disabled={!certReady || saving}
        style={[styles.submit, (!certReady || saving) && styles.submitDisabled]}
      >
        {saving ? (
          <ActivityIndicator color={colors.onBrandPrimary} />
        ) : (
          <Txt size={15} weight="700" align="center" color={colors.onBrandPrimary}>
            {certReady ? t("cert_save") : t("cert_preparing")}
          </Txt>
        )}
      </Pressable>

      <Pressable testID="new-membership" onPress={onReset} style={styles.secondaryBtn}>
        <Txt size={14} weight="600" align="center" color={colors.brandPrimary}>
          {t("cert_new")}
        </Txt>
      </Pressable>

      <View style={styles.shareWrap}>
        <ShareCard heading={t("share_after_cert")} testID="membership-share-card" />
      </View>
    </View>
  );
}

function CertRow({ label, value, small }: { label: string; value: string; small?: boolean }) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={styles.certRow}>
      <Txt size={11} weight="600" align="center" color={colors.muted}>
        {label.toUpperCase()}
      </Txt>
      <Txt size={small ? 13 : 16} weight={small ? "600" : "700"} align="center" color={colors.onSurface}>
        {value}
      </Txt>
    </View>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={styles.field}>
      <Txt size={13} weight="600" color={colors.onSurfaceSecondary}>
        {label}
      </Txt>
      {hint ? (
        <Txt size={11} color={colors.muted}>
          {hint}
        </Txt>
      ) : null}
      {children}
    </View>
  );
}

function Input(props: React.ComponentProps<typeof TextInput> & { multiline?: boolean }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { isRTL } = useLang();
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      {...props}
      style={[
        styles.input,
        props.multiline && styles.inputMultiline,
        { textAlign: isRTL ? "right" : "left" },
        props.style,
      ]}
    />
  );
}

const useStyles = makeStyles((colors) => ({
  rowRTL: { flexDirection: "row-reverse" },
  sub: { marginTop: spacing.xs, marginBottom: spacing.lg, lineHeight: 19 },

  totalsCard: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.brandSecondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  byRegionLabel: { marginTop: spacing.xs, marginBottom: spacing.sm },
  regionGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  regionStat: {
    width: "47%",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  regionStatLabel: { flex: 1 },
  countPill: {
    minWidth: 30,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.brandTertiary,
    alignItems: "center",
  },

  form: { gap: spacing.lg },
  field: { gap: spacing.xs },
  input: {
    backgroundColor: colors.surfaceTertiary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.onSurface,
    fontSize: 15,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: "top" },

  // tier cards
  cardsScroll: { marginHorizontal: -spacing.lg, marginTop: spacing.xs },
  cardsRow: { paddingHorizontal: spacing.lg, gap: spacing.md },
  card: {
    width: CARD_WIDTH,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: spacing.md,
    gap: spacing.sm,
    overflow: "hidden",
  },
  cardActive: { borderWidth: 2.5 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  cardBrand: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  cardLine: { letterSpacing: 1.2 },
  cardMid: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.xs },
  cardMidText: { flex: 1 },
  chip: {
    width: 34,
    height: 26,
    borderRadius: 6,
    borderWidth: 1.5,
    backgroundColor: colors.brandTertiary,
  },
  cardBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  selectedRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  benefitsPanel: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
  },
  benefitsTitle: { letterSpacing: 1 },
  compareLink: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 36, marginTop: 2 },
  trackerWrap: { marginTop: spacing["2xl"] },

  pillWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  regionPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    minWidth: "30%",
    alignItems: "center",
  },
  pillActive: { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimary },
  pillIdle: { backgroundColor: colors.surfaceTertiary, borderColor: colors.border },

  privacyRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  privacyText: { flex: 1, lineHeight: 16 },

  submit: {
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  submitDisabled: { opacity: 0.5 },
  secondaryBtn: { paddingVertical: spacing.md, alignItems: "center", marginTop: spacing.sm },

  certWrap: { gap: spacing.sm },
  shareWrap: { marginTop: spacing.lg },
  cert: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.xl,
    overflow: "hidden",
  },
  watermark: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: "none",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.12,
    transform: [{ rotate: "-20deg" }],
  },
  watermarkText: { letterSpacing: 1 },
  certHead: { alignItems: "center", gap: spacing.sm },
  certTitle: { letterSpacing: 0.5 },
  certDivider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.lg },
  certRow: { alignItems: "center", gap: 4, marginBottom: spacing.md },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  certId: { marginTop: 2 },
}));
