import React, {createContext, ReactNode, useEffect, useRef, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {useSnackbar} from "@/providers/SnackbarProvider";

// 1. Define the shape of the context
interface InternetContextType {
    isConnected: boolean;
}

// 2. Create the context with a default value
export const InternetContext = createContext<InternetContextType>({
    isConnected: true,
});

// 3. Define the props type for the Provider
interface InternetProviderProps {
    children: ReactNode;
}

// 4. Create the provider component
export const InternetProvider: React.FC<InternetProviderProps> = ({children}) => {
    const [isConnected, setIsConnected] = useState<boolean>(true);
    const {showSnackbar} = useSnackbar();
    const hasGoneOffline = useRef(false);

    useEffect(() => {
        NetInfo.fetch().then((state) => {
            const connected = !!state.isConnected && state.isInternetReachable !== false;
            setIsConnected(connected);

            if (!connected) {
                hasGoneOffline.current = true;
                showSnackbar({ message: "No Internet Connection", type: "error" });
            }
        });

        const unsubscribe = NetInfo.addEventListener((state) => {
            const connected = !!state.isConnected && state.isInternetReachable !== false;
            setIsConnected(connected);

            if (!connected) {
                hasGoneOffline.current = true;
                showSnackbar({ message: "No Internet Connection", type: "error" });
            } else if (hasGoneOffline.current) {
                showSnackbar({ message: "Back Online", type: "success" });
                hasGoneOffline.current = false;
            }
        });

        return () => unsubscribe();
    }, [showSnackbar]);

    return (
        <InternetContext.Provider value={{isConnected}}>
            {children}
        </InternetContext.Provider>
    );
};
