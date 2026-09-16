import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, Pressable, TextInput, View } from "react-native";
import ViewShot from "react-native-view-shot";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import { Screen } from "@/src/components/Screen";
import { Logo } from "@/src/components/Header";
import { ShareCard } from "@/src/components/ShareCard";
import { Txt } from "@/src/components/Txt";
import { useToast } from "@/src/components/Toast";
import { useLang } from "@/src/i18n";
import { REGIONS, TIERS } from "@/src/i18n/content";
import { fetchTotals, submitPledge, type Certificate } from "@/src/api";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

function formatMoney(n: number) {
  return "$" + n.toLocaleString("en-US");
}

export default function PledgeScreen() {
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
  const [tier, setTier] = useState<number>(TIERS[0]);
  const [region, setRegion] = useState<string | null>(null);

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [certReady, setCertReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const shotRef = useRef<ViewShot>(null);

  const mutation = useMutation({
    mutationFn: submitPledge,
    onSuccess: (cert) => {
      setCertificate(cert);
      setCertReady(false);
      queryClient.invalidateQueries({ queryKey: ["totals"] });
      toast.show(t("pledge_success"), "success");
    },
    onError: () => toast.show(t("pledge_error"), "error"),
  });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit =
    name.trim() && institution.trim() && country.trim() && emailValid && region && !mutation.isPending;

  const onSubmit = () => {
    if (!canSubmit) {
      toast.show(t("pledge_required"), "error");
      return;
    }
    mutation.mutate({
      name: name.trim(),
      institution: institution.trim(),
      country: country.trim(),
      email: email.trim(),
      message: message.trim() || undefined,
      tier,
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
    setTier(TIERS[0]);
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

  return (
    <Screen testID="pledge-screen" keyboardAware>
      <Txt variant="display" size={30} weight="700" color={colors.onSurface}>
        {t("pledge_title")}
      </Txt>
      <Txt size={13} color={colors.muted} style={styles.sub}>
        {t("pledge_sub")}
      </Txt>

      {/* Live shared totals */}
      <View style={styles.totalsCard} testID="pledge-totals">
        <Txt size={13} weight="600" color={colors.muted}>
          {t("pledge_totals_title")}
        </Txt>
        {totalsQuery.isLoading ? (
          <ActivityIndicator color={colors.brandPrimary} style={{ marginVertical: spacing.md }} />
        ) : (
          <>
            <Txt variant="display" size={48} weight="700" color={colors.brandPrimary} testID="pledge-total-count">
              {totalsQuery.data?.total ?? 0}
            </Txt>
            <Txt size={12} color={colors.muted} style={styles.byRegionLabel}>
              {t("pledge_totals_by_region")}
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
          {/* Tier */}
          <Field label={t("pledge_tier")}>
            <View style={styles.pillWrap}>
              {TIERS.map((tv) => {
                const active = tier === tv;
                return (
                  <Pressable
                    key={tv}
                    testID={`tier-${tv}`}
                    onPress={() => setTier(tv)}
                    style={[styles.pill, active ? styles.pillActive : styles.pillIdle]}
                  >
                    <Txt size={13} weight="700" color={active ? colors.onBrandPrimary : colors.onSurfaceSecondary}>
                      {formatMoney(tv)}
                    </Txt>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label={t("pledge_name")}>
            <Input value={name} onChangeText={setName} testID="input-name" />
          </Field>
          <Field label={t("pledge_institution")}>
            <Input value={institution} onChangeText={setInstitution} testID="input-institution" />
          </Field>
          <Field label={t("pledge_country")}>
            <Input value={country} onChangeText={setCountry} testID="input-country" />
          </Field>
          <Field label={t("pledge_email")}>
            <Input
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              testID="input-email"
            />
          </Field>

          {/* Region select */}
          <Field label={t("pledge_region")} hint={t("pledge_region_hint")}>
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

          <Field label={t("pledge_message")}>
            <Input value={message} onChangeText={setMessage} multiline testID="input-message" />
          </Field>

          {/* Privacy notice */}
          <View style={[styles.privacyRow, isRTL && styles.rowRTL]}>
            <Ionicons name="lock-closed" size={14} color={colors.muted} style={{ marginTop: 2 }} />
            <Txt size={11} color={colors.muted} style={styles.privacyText}>
              {t("pledge_privacy")}
            </Txt>
          </View>

          <Pressable
            testID="submit-pledge"
            onPress={onSubmit}
            disabled={!canSubmit}
            style={[styles.submit, !canSubmit && styles.submitDisabled]}
          >
            {mutation.isPending ? (
              <ActivityIndicator color={colors.onBrandPrimary} />
            ) : (
              <Txt size={15} weight="700" align="center" color={colors.onBrandPrimary}>
                {t("pledge_submit")}
              </Txt>
            )}
          </Pressable>
        </View>
      )}
    </Screen>
  );
}

function CertificateBlock({
  certificate,
  regionLabel,
  shotRef,
  onLayoutReady,
  certReady,
  saving,
  onSaveShare,
  onReset,
}: {
  certificate: Certificate;
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
  const { t } = useLang();

  return (
    <View style={styles.certWrap}>
      <ViewShot ref={shotRef} options={{ format: "png", quality: 1 }}>
        <View
          style={styles.cert}
          collapsable={false}
          // Enable save/share only once the certificate has fully laid out —
          // capturing before layout produces a blank/zero-size image.
          onLayout={() => requestAnimationFrame(onLayoutReady)}
          testID="certificate"
        >
          {/* watermark */}
          <View style={styles.watermark} pointerEvents="none">
            <Txt size={13} weight="700" align="center" color={colors.brandPrimary} style={styles.watermarkText}>
              {t("cert_watermark")}
            </Txt>
          </View>

          <View style={styles.certHead}>
            <Logo size={48} />
            <Txt variant="display" size={24} weight="700" align="center" color={colors.brandPrimary} style={styles.certTitle}>
              {t("cert_title")}
            </Txt>
          </View>

          <View style={styles.certDivider} />

          <CertRow label={t("cert_tier")} value={formatMoney(certificate.tier)} big />
          <CertRow label={t("cert_name")} value={certificate.name} />
          <CertRow label={t("cert_institution")} value={certificate.institution} />
          <CertRow label={t("cert_region")} value={regionLabel} />
          <CertRow label={t("cert_date")} value={dayjs(certificate.date).format("DD MMM YYYY")} />

          <View style={styles.certDivider} />
          <Txt size={11} align="center" color={colors.muted}>
            {t("cert_issued")}
          </Txt>
          <Txt size={10} align="center" color={colors.muted} style={styles.certId}>
            ID · {certificate.id}
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

      <Pressable testID="new-pledge" onPress={onReset} style={styles.secondaryBtn}>
        <Txt size={14} weight="600" align="center" color={colors.brandPrimary}>
          {t("cert_new")}
        </Txt>
      </Pressable>

      <View style={styles.shareWrap}>
        <ShareCard heading={t("share_after_cert")} testID="pledge-share-card" />
      </View>
    </View>
  );
}

function CertRow({ label, value, big }: { label: string; value: string; big?: boolean }) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={styles.certRow}>
      <Txt size={11} weight="600" align="center" color={colors.muted}>
        {label.toUpperCase()}
      </Txt>
      <Txt
        variant={big ? "display" : "body"}
        size={big ? 26 : 16}
        weight="700"
        align="center"
        color={colors.onSurface}
      >
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
      <Txt size={13} weight="600" color={colors.onSurfaceSecondary} style={styles.fieldLabel}>
        {label}
      </Txt>
      {hint ? (
        <Txt size={11} color={colors.muted} style={styles.fieldHint}>
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
  fieldLabel: {},
  fieldHint: {},
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

  pillWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
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
    borderColor: colors.brandPrimary,
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
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.12,
    transform: [{ rotate: "-20deg" }],
  },
  watermarkText: { letterSpacing: 1 },
  certHead: { alignItems: "center", gap: spacing.sm },
  certTitle: { letterSpacing: 0.5 },
  certDivider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.lg },
  certRow: { alignItems: "center", gap: 3, marginBottom: spacing.md },
  certId: { marginTop: 2 },
}));
