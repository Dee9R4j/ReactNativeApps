import { StateCreator } from "zustand";

export interface IAuthData {
  accessToken: string | null;
  refreshToken: string | null;
  userID: string | null;
  admin: boolean;
  username: string | null;
}

export interface IAuthSlice extends IAuthData {
  setToken: (data: IAuthData) => void;
  getToken: () => string | null;
  logOut: () => void;
}

export const AuthSlice: StateCreator<any, [], [], IAuthSlice> = (set, get) => ({
  accessToken: null,
  refreshToken: null,
  userID: null,
  admin: false,
  username: null,

  setToken: (data: IAuthData) => {
    set({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userID: data.userID,
      admin: data.admin,
      username: data.username,
    });
  },

  getToken: () => get().accessToken,

  logOut: () => {
    set({
      accessToken: null,
      refreshToken: null,
      userID: null,
      admin: false,
      username: null,
    });
  },
});
