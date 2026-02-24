import { Redirect } from "expo-router";

// Main entry route. _layout.tsx handles redirecting authenticated/unauthenticated users
export default function Index() {
  return <Redirect href="/login/authentication" />;
}
