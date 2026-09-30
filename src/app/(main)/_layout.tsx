import { Tabs } from 'expo-router';

import { CustomTabBar } from '../../components/navigation/CustomTabBar';
import { colors } from '../../constants/colors';

export default function MainLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 84, backgroundColor: colors.background, borderTopWidth: 0, elevation: 0 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="planner" options={{ title: 'Planner' }} />
      <Tabs.Screen name="alarms" options={{ title: 'Alarms' }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
    </Tabs>
  );
}
