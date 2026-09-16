import React from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Txt } from "@/src/components/Txt";
import { useLang } from "@/src/i18n";
import { MEMBERSHIP_TIERS, type MembershipTier } from "@/src/i18n/content";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

/** Bullet list of what a tier unlocks (shown under the selected card). */
export function TierBenefits({ tier, compact, testID }: { tier: MembershipTier; compact?: boolean; testID?: string }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { tc, isRTL } = useLang();
  return (
    <View style={styles.list} testID={testID ?? `benefits-${tier.key}`}>
      {tier.benefits.map((b, i) => (
        <View key={i} style={[styles.item, isRTL && styles.rowRTL]}>
          <Ionicons
            name={i === 0 && tier.key !== "bronze" ? "add-circle" : "checkmark-circle"}
            size={16}
            color={tier.accent}
            style={styles.itemIcon}
          />
          <Txt size={compact ? 12 : 13} color={colors.onSurfaceSecondary} style={styles.itemText}>
            {tc(b)}
          </Txt>
        </View>
      ))}
    </View>
  );
}

/** Full-screen comparison of all five tiers with a select action. */
export function TierCompareModal({
  visible,
  selectedKey,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selectedKey: string;
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, tc, isRTL } = useLang();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <View style={[styles.modal, { paddingTop: insets.top + spacing.md }]} testID="tier-compare-modal">
        <View style={[styles.modalHead, isRTL && styles.rowRTL]}>
          <Txt variant="display" size={22} weight="700" color={colors.onSurface} style={styles.modalTitle}>
            {t("mem_compare_title")}
          </Txt>
          <Pressable onPress={onClose} testID="tier-compare-close" style={styles.closeBtn} accessibilityLabel={t("close")}>
            <Ionicons name="close" size={22} color={colors.onSurface} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={[styles.modalBody, { paddingBottom: insets.bottom + spacing.xl }]}>
          {MEMBERSHIP_TIERS.map((tier) => {
            const active = tier.key === selectedKey;
            return (
              <View
                key={tier.key}
                style={[styles.tierBlock, { backgroundColor: tier.body, borderColor: active ? colors.brandPrimary : tier.accent }]}
                testID={`compare-${tier.key}`}
              >
                <View style={[styles.tierHead, isRTL && styles.rowRTL]}>
                  <View style={styles.tierHeadText}>
                    <Txt variant="display" size={22} weight="700" color={tier.accent}>
                      {tc(tier.name)} {t("mem_membership")}
                    </Txt>
                    <Txt size={12} color={tier.accent}>
                      {tc(tier.tagline)}
                    </Txt>
                  </View>
                  <Txt variant="display" size={18} weight="700" color={colors.onSurface}>
                    {tc(tier.amount)}
                  </Txt>
                </View>
                <TierBenefits tier={tier} compact testID={`compare-benefits-${tier.key}`} />
                <Pressable
                  testID={`compare-select-${tier.key}`}
                  onPress={() => {
                    onSelect(tier.key);
                    onClose();
                  }}
                  style={[styles.selectBtn, { borderColor: tier.accent }, active && { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimary }]}
                >
                  <Txt size={13} weight="700" align="center" color={active ? colors.onBrandPrimary : tier.accent}>
                    {t("mem_select_tier")}
                  </Txt>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const useStyles = makeStyles((colors) => ({
  rowRTL: { flexDirection: "row-reverse" },
  list: { gap: 6 },
  item: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  itemIcon: { marginTop: 1 },
  itemText: { flex: 1, lineHeight: 18 },

  modal: { flex: 1, backgroundColor: colors.surface },
  modalHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: { flex: 1 },
  closeBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  modalBody: { padding: spacing.lg, gap: spacing.md },
  tierBlock: { borderWidth: 1.5, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  tierHead: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.md },
  tierHeadText: { flex: 1, gap: 2 },
  selectBtn: { borderWidth: 1, borderRadius: radius.md, minHeight: 44, justifyContent: "center", paddingHorizontal: spacing.md },
}));
