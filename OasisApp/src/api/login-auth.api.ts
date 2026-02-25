/**
 * Mock login auth API
 */
import {
  MOCK_CREDENTIALS,
  MOCK_USER_DATA,
  simulateNetworkDelay,
} from "./dummyData";
import { INVALID_CREDENTIALS_ERROR } from "@/utils/authErrors";

export async function loginUser(credentials: {
  username: string;
  password: string;
  reg_token?: string;
}) {
  await simulateNetworkDelay(500, 1000);

  if (
    credentials.username.trim().toLowerCase() ===
      MOCK_CREDENTIALS.username.toLowerCase() &&
    credentials.password.trim() === MOCK_CREDENTIALS.password
  ) {
    console.log("✅ Mock login successful");
    return {
      success: true as const,
      data: {
        ...MOCK_USER_DATA,
        JWT: MOCK_USER_DATA.access,
        isbitsian: MOCK_USER_DATA.bitsian_id.length > 0,
      },
      errorMessage: undefined as string | undefined,
    };
  }

  return {
    success: false as const,
    data: undefined,
    errorMessage: INVALID_CREDENTIALS_ERROR,
  };
}
