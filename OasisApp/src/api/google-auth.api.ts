/**
 * Mock Google auth API — bypasses native Google Sign-In
 */
import { MOCK_USER_DATA, simulateNetworkDelay } from "./dummyData";

export async function googleAuth(reg_token?: string, fcm_token?: string) {
  await simulateNetworkDelay(500, 1000);

  const mockGoogleUser = {
    JWT: MOCK_USER_DATA.access,
    user_id: MOCK_USER_DATA.user_id,
    qr_code: MOCK_USER_DATA.qr_code,
    name: "Google Test User",
    email: "google.test@bits-oasis.org",
    phone: MOCK_USER_DATA.phone,
    referral_code: MOCK_USER_DATA.referral_code,
    bitsian_id: "",
    fcm_token: MOCK_USER_DATA.fcm_token,
    photo: "https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff",
  };

  console.log("[Mock] Google login successful");
  return {
    success: true as const,
    data: mockGoogleUser,
    errorMessage: undefined as string | undefined,
  };
}
