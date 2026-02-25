import React from "react";
import {Stack} from "expo-router";
import {SnackbarProvider} from "@/utils/contextprovider/SnackbarProvider";
import {InternetProvider} from "@/providers/InternetProvider";

const Layout = () => {
    return (
        <SnackbarProvider>
            <InternetProvider>
                <Stack>
                    <Stack.Screen name="index" options={{headerShown: false}}/>
                </Stack>
            </InternetProvider>
        </SnackbarProvider>
    );
};

export default Layout;
