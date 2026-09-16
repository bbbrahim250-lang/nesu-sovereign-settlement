import React from "react";
import { View } from "react-native";

import { makeStyles, radius, spacing, useTheme } from "@/src/theme";
import { useLang } from "@/src/i18n";
import { Txt } from "./Txt";
import type { CorridorTag } from "@/src/i18n/content";

export function StatusTag({ tag, testID }: { tag: CorridorTag; testID?: string }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useLang();
  const isLead = tag === "lead";
  return (
    <View
      testID={testID}
      style={[styles.tag, isLead ? styles.lead : styles.roadmap]}
    >
      <Txt
        size={11}
        weight="700"
        color={isLead ? colors.onBrandPrimary : colors.muted}
        style={styles.tagText}
      >
        {t(isLead ? "tag_lead" : "tag_roadmap").toUpperCase()}
      </Txt>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  lead: { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimary },
  roadmap: { backgroundColor: "transparent", borderColor: colors.borderStrong },
  tagText: { letterSpacing: 0.6 },
}));
