import { Tabs } from "expo-router";
import Ionicons from "@react-native-vector-icons/ionicons";

import { useLang } from "@/src/i18n";
import { useTheme } from "@/src/theme";

type TabDef = { name: string; labelKey: string; icon: string };

const TABS: TabDef[] = [
  { name: "home", labelKey: "tab_home", icon: "home" },
  { name: "how-it-works", labelKey: "tab_how", icon: "layers" },
  { name: "corridors", labelKey: "tab_corridors", icon: "git-network" },
  { name: "comparison", labelKey: "tab_comparison", icon: "stats-chart" },
  { name: "membership", labelKey: "tab_membership", icon: "card" },
  { name: "research", labelKey: "tab_research", icon: "document-text" },
];

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t, isRTL } = useLang();

  // Mirror tab order for Arabic (RTL) so navigation reads right-to-left.
  const ordered = isRTL ? [...TABS].reverse() : TABS;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandPrimary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surfaceSecondary,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 9, fontWeight: "600" },
        tabBarAllowFontScaling: false,
        tabBarItemStyle: { alignSelf: "center", paddingHorizontal: 0 },
      }}
    >
      {ordered.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarLabel: t(tab.labelKey),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon as any} size={size ? size - 2 : 20} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
