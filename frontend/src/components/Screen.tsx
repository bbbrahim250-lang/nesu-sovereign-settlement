import React from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { makeStyles, spacing, useTheme } from "@/src/theme";
import { Header } from "./Header";
import { FooterDisclaimer } from "./Footer";

type Props = {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  keyboardAware?: boolean;
  testID?: string;
};

// Standard screen shell: sticky trilingual Header on top, scrollable body,
// persistent footer disclaimer at the bottom. The tab bar is non-absolute so
// no extra bottom inset is needed above it.
export function Screen({ children, contentStyle, keyboardAware, testID }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const body = (
    <>
      {children}
      <FooterDisclaimer />
    </>
  );

  return (
    <View style={styles.root} testID={testID}>
      <Header />
      {keyboardAware ? (
        <KeyboardAwareScrollView
          bottomOffset={24}
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
          indicatorStyle="white"
        >
          {body}
        </KeyboardAwareScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
          indicatorStyle="white"
        >
          {body}
        </ScrollView>
      )}
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
}));
