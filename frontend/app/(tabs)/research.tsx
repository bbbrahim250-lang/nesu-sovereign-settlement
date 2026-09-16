import React, { useState } from "react";
import { Pressable, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import Ionicons from "@react-native-vector-icons/ionicons";

import { Screen } from "@/src/components/Screen";
import { Txt } from "@/src/components/Txt";
import { useToast } from "@/src/components/Toast";
import { useLang } from "@/src/i18n";
import { DOCUMENTS } from "@/src/i18n/content";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

export default function ResearchScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, isRTL } = useLang();
  const toast = useToast();
  const [openingKey, setOpeningKey] = useState<string | null>(null);

  const open = async (key: string, url: string | null) => {
    if (!url) return;
    try {
      setOpeningKey(key);
      await WebBrowser.openBrowserAsync(url);
    } catch {
      toast.show(t("research_pending"), "error");
    } finally {
      setOpeningKey(null);
    }
  };

  return (
    <Screen testID="research-screen">
      <Txt variant="display" size={30} weight="700" color={colors.onSurface}>
        {t("research_title")}
      </Txt>
      <Txt size={13} color={colors.muted} style={styles.sub}>
        {t("research_sub")}
      </Txt>

      {DOCUMENTS.map((d) => {
        const title = d.kind === "proposal" ? t("doc_proposal") : t("doc_brief");
        const pending = !d.url;
        return (
          <Pressable
            key={d.key}
            testID={`doc-${d.key}`}
            disabled={pending}
            onPress={() => open(d.key, d.url)}
            style={({ pressed }) => [styles.row, isRTL && styles.rowRTL, pressed && !pending && styles.rowPressed]}
          >
            <View style={styles.docIcon}>
              <Ionicons name="document-text" size={20} color={pending ? colors.muted : colors.brandPrimary} />
            </View>
            <View style={styles.docText}>
              <Txt size={15} weight="700" color={colors.onSurface}>
                {title}
              </Txt>
              <View style={[styles.metaRow, isRTL && styles.rowRTL]}>
                <Txt size={12} color={colors.muted}>
                  {d.langLabel}
                </Txt>
                {d.standin ? (
                  <View style={styles.standinTag}>
                    <Txt size={10} weight="700" color={colors.muted}>
                      {t("doc_standin")}
                    </Txt>
                  </View>
                ) : null}
              </View>
            </View>
            {pending ? (
              <Txt size={12} color={colors.muted}>
                {t("research_pending")}
              </Txt>
            ) : (
              <View style={[styles.openBtn, isRTL && styles.rowRTL]}>
                <Txt size={12} weight="700" color={colors.brandPrimary}>
                  {openingKey === d.key ? t("loading") : t("research_open")}
                </Txt>
                <Ionicons
                  name={isRTL ? "chevron-back" : "chevron-forward"}
                  size={14}
                  color={colors.brandPrimary}
                />
              </View>
            )}
          </Pressable>
        );
      })}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  rowRTL: { flexDirection: "row-reverse" },
  sub: { marginTop: spacing.xs, marginBottom: spacing.lg, lineHeight: 19 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: 64,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  rowPressed: { borderColor: colors.brandPrimary },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.brandTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  docText: { flex: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: 3 },
  standinTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  openBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
}));
