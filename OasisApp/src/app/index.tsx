/**
 * Auth guard — redirects based on login state
 * If signed in → go to private/home
 * If not → go to authentication screen
 */
import { useFastStore } from "@/state/fast/fast";
import { useSecureStore } from "@/state/secure/secure";
import { Redirect } from "expo-router";

export default function Index() {
  const signedIn = useFastStore((state) => state.signedIn);
  const token = useSecureStore((state) => state.JWT);

  if (signedIn && token) {
    return <Redirect href={"/private/home"} />;
  }

  return <Redirect href={"/authentication"} />;
}
