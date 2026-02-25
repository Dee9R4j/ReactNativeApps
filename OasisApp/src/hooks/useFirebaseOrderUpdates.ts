import { useEffect } from "react";

export const useFirebaseOrderUpdates = (props?: any) => {
  useEffect(() => {
    console.log("[Mock] Firebase order updates disabled for UI testing");
  }, []);
};
