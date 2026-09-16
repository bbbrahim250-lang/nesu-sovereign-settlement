import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

import { useTheme } from "@/src/theme";
import { FONT_ARABIC, FONT_DISPLAY } from "@/src/fonts";
import { useLang } from "@/src/i18n";

type Variant = "display" | "body";

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  /** Force alignment; otherwise mirrors for RTL (start of reading order). */
  align?: TextStyle["textAlign"];
  weight?: TextStyle["fontWeight"];
  size?: number;
};

// Central text primitive: applies the right font per language + variant and
// mirrors alignment for Arabic (RTL) so every screen reads correctly.
export function Txt({ variant = "body", color, align, weight, size, style, ...rest }: Props) {
  const { colors } = useTheme();
  const { isRTL, lang } = useLang();

  const fontFamily =
    lang === "ar" ? FONT_ARABIC : variant === "display" ? FONT_DISPLAY : undefined;

  const resolvedAlign: TextStyle["textAlign"] = align ?? (isRTL ? "right" : "left");

  return (
    <Text
      {...rest}
      style={[
        {
          color: color ?? colors.onSurface,
          fontFamily,
          textAlign: resolvedAlign,
          writingDirection: isRTL ? "rtl" : "ltr",
          ...(size ? { fontSize: size } : null),
          ...(weight ? { fontWeight: weight } : null),
        },
        style,
      ]}
    />
  );
}
