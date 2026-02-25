import { useFastStore } from "@/state/fast/fast";
import { Redirect, router } from "expo-router";
import React from "react";

export default function UserRootIndex() {
  const pref = useFastStore();
  if (pref.signedStoreIn) {
    return <Redirect href={"/private/home/events"} />;
  }
  if (!pref.hasSeenOnboarding && pref.shouldShowOnboarding) {
    return <Redirect href={"/private/onboarding" as any} />;
  }

  return <Redirect href={"/private/home"} />;
}
