//app/(tabs)/settings.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView 
        style={[styles.container]}
        contentContainerStyle={{
            paddingTop: insets.top + 70, // 60 for header + 10 buffer
            paddingBottom: insets.bottom + 70, // 60 for tab bar + 10 buffer
            paddingHorizontal: 20,
        }}
    >
      <Text style={styles.title}>Settings</Text>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>App Version</Text>
        <Text style={styles.settingValue}>1.0.0</Text>
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Text style={styles.settingValue}>Coming Soon!</Text>
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Notifications</Text>
        <Text style={styles.settingValue}>Enabled</Text>
      </View>
       {/* Add more settings options here */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f4ee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  settingItem: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 3,
  },
  settingText: {
    fontSize: 16,
    color: '#444',
  },
  settingValue: {
    fontSize: 16,
    color: '#777',
  }
});