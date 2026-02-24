import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0A001A" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="manage/[id]" />
      <Stack.Screen name="EventPerms" />
      <Stack.Screen name="qr/selectevent" />
      <Stack.Screen name="qr/[id]" />
    </Stack>
  );
}
