/**
 * Mock PostHog analytics — stub that does nothing
 */
export const posthog = {
  optIn: () => console.log("[Mock] PostHog opted in"),
  optOut: () => console.log("[Mock] PostHog opted out"),
  capture: (event: string, properties?: Record<string, unknown>) =>
    console.log("[Mock] PostHog event:", event, properties),
  identify: (userId: string, properties?: Record<string, unknown>) =>
    console.log("[Mock] PostHog identify:", userId),
  reset: () => console.log("[Mock] PostHog reset"),
};
