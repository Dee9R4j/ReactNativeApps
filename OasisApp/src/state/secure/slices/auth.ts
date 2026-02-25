/**
 * Auth slice — stores JWT, user profile, and auth status
 * Persisted in expo-secure-store (encrypted)
 * setToken accepts individual params to match old calling convention
 */
import type { StateCreator } from "zustand";

export interface AuthSlice {
  // State
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

  // Actions — accepts individual params like old code
  setToken: (
    jwt: string,
    userId: number,
    qrCode: string,
    name: string,
    email: string,
    phone: string,
    referralCode: string,
    bitsianId: string,
  ) => void;
  setIsBitsian: (value: boolean) => void;
  clearToken: () => void;
  logOut: () => void;
}

const initialState = {
  JWT: "",
  user_id: 0,
  qr_code: "",
  name: "",
  email: "",
  phone: "",
  referral_code: "",
  bitsian_id: "",
  fcm_token: null as string | null,
  photo: null as string | null,
  isbitsian: false,
};

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (
  set,
) => ({
  ...initialState,

  setToken: (jwt, userId, qrCode, name, email, phone, referralCode, bitsianId) => {
    set({
      JWT: jwt,
      user_id: userId,
      qr_code: qrCode,
      name,
      email,
      phone,
      referral_code: referralCode,
      bitsian_id: bitsianId,
    });
  },

  setIsBitsian: (value: boolean) => set({ isbitsian: value }),

  clearToken: () => set(initialState),

  logOut: () => set(initialState),
});
