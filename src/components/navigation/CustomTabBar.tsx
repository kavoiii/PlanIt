import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';
import { radius } from '../../constants/radius';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

type CustomTabBarProps = {
  state: { routes: { key: string; name: string; params?: object }[]; index: number };
  descriptors: Record<string, { options: { title?: string; tabBarLabel?: unknown; tabBarAccessibilityLabel?: string } }>;
  navigation: any;
  insets: { bottom: number };
};

const icons: Record<string, { active: string; inactive: string }> = {
  index: { active: '◷', inactive: '◷' },
  planner: { active: '▦', inactive: '▦' },
  alarms: { active: '◉', inactive: '◉' },
  tasks: { active: '☑', inactive: '☐' },
};

export function CustomTabBar({ state, descriptors, navigation, insets }: CustomTabBarProps) {
  return (
    <View pointerEvents="box-none" style={[styles.positioner, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <View accessibilityRole="tablist" style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const color = focused ? colors.primary : colors.textSecondary;
          const label = typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title ?? route.name;
          const iconSet = icons[route.name] ?? icons.index;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
              }}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}
              android_ripple={{ color: colors.primaryLight, borderless: false }}
            >
              <View style={[styles.content, focused && styles.activeContent]}>
                <Text style={[styles.icon, { color }]}>{focused ? iconSet.active : iconSet.inactive}</Text>
                <Text numberOfLines={1} style={[styles.label, { color, fontWeight: focused ? '600' : '500' }]}>{label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  positioner: { marginHorizontal: spacing.lg, paddingTop: 2 },
  bar: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0,
    shadowRadius: 12,
    elevation: 8,
  },
  item: { flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: radius.lg, paddingHorizontal: 2 },
  content: { minHeight: 48, minWidth: 58, alignItems: 'center', justifyContent: 'center', borderRadius: radius.lg, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  activeContent: { backgroundColor: colors.primaryLight },
  pressed: { opacity: 0.72 },
  label: { ...typography.caption, fontSize: 11, lineHeight: 14 },
  icon: { fontSize: 23, lineHeight: 25, fontWeight: '700' },
});
