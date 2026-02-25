import { useRouter } from "expo-router";
import { useAuth } from "./useAuthentication";

export const useQRNavigation = () => {
  const router = useRouter();
  const { authenticateUser } = useAuth();

  const navigateToQR = async () => {
    const isAuth = await authenticateUser();
    if (isAuth) {
      router.push("/private/home/qr");
    }
  };

  return navigateToQR;
};
