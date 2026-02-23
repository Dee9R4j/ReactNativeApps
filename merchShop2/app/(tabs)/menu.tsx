//app/(tabs)/menu.tsx
import React from 'react';
import { View, Text } from 'react-native';

// This screen is effectively a dummy screen for the tab item
// The actual functionality is handled by the tabPress listener in (tabs)/_layout.tsx
export default function MenuScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Menu Tab</Text>
      {/* Content here will not be shown if tabPress is prevented */}
    </View>
  );
}