import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initializeDatabase } from '../services/database/database';

export default function RootLayout() {
  useEffect(() => {
    void initializeDatabase().catch((error: unknown) => {
      console.warn('Unable to initialize the local database.', error);
    });
  }, []);

 return (
  <SafeAreaProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="add-alarm"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.9, 1],
          sheetInitialDetentIndex: 0,
          sheetCornerRadius: 28,
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  </SafeAreaProvider>

  );
}
