/**
 * Auth domain models
 */

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface IAuthData {
  JWT: string;
  user_id: number;
  qr_code: string;
  name: string;
  email: string;
  phone: string;
  referral_code: string;
  bitsian_id: string;
  fcm_token: string | null;
  photo: string | null;
  isbitsian: boolean;
}

export interface LoginResult {
  success: boolean;
  data?: IAuthData | Record<string, unknown>;
  errorMessage?: string;
}
