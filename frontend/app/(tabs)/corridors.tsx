import React from "react";
import { Dimensions, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import Ionicons from "@react-native-vector-icons/ionicons";

import { Screen } from "@/src/components/Screen";
import { Txt } from "@/src/components/Txt";
import { StatusTag } from "@/src/components/Tag";
import { useLang } from "@/src/i18n";
import { CORRIDORS, GREEN_CORRIDORS_VIDEO } from "@/src/i18n/content";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

// Explicit, fixed video dimensions — an undefined-size video silently fails to
// render on some RN/Expo versions, so width/height are always numeric here.
const SCREEN_W = Dimensions.get("window").width;
const VIDEO_W = SCREEN_W - spacing.lg * 2;
const VIDEO_H = Math.round((VIDEO_W * 9) / 16);

export default function CorridorsScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, tc, isRTL } = useLang();

  const player = useVideoPlayer(GREEN_CORRIDORS_VIDEO, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <Screen testID="corridors-screen">
      <Txt variant="display" size={30} weight="700" color={colors.onSurface}>
        {t("corridors_title")}
      </Txt>

      {/* Inline autoplay / muted / looped explainer video, fixed 16:9 */}
      <View style={styles.videoLabelRow}>
        <Ionicons name="play-circle" size={16} color={colors.brandPrimary} />
        <Txt size={12} weight="600" color={colors.muted}>
          {t("corridors_video_title")}
        </Txt>
      </View>
      <View style={[styles.videoBox, { width: VIDEO_W, height: VIDEO_H }]} testID="corridors-video">
        <VideoView
          style={{ width: VIDEO_W, height: VIDEO_H }}
          player={player}
          nativeControls={false}
          contentFit="cover"
          playsInline
        />
      </View>

      <Txt variant="display" size={22} weight="700" color={colors.onSurface} style={styles.tokensTitle}>
        {t("corridors_tokens_title")}
      </Txt>

      {CORRIDORS.map((c) => (
        <View key={c.key} style={styles.card} testID={`corridor-${c.key}`}>
          <View style={[styles.cardHead, isRTL && styles.rowRTL]}>
            <Txt variant="display" size={20} weight="700" color={colors.onSurface} style={styles.cardName}>
              {c.name}
            </Txt>
            <StatusTag tag={c.tag} testID={`corridor-tag-${c.key}`} />
          </View>
          <Txt size={13} color={colors.onSurfaceSecondary} style={styles.cardDesc}>
            {tc(c.desc)}
          </Txt>
        </View>
      ))}
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  rowRTL: { flexDirection: "row-reverse" },
  videoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  videoBox: {
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceSecondary,
  },
  tokensTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardName: { flexShrink: 1 },
  cardDesc: { lineHeight: 19 },
}));
