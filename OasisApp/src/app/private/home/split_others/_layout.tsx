import {Stack} from "expo-router";
import React from "react";

export default function SplitLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{title: "Completed Orders", headerShown: false}}
            />
            <Stack.Screen
                name="friends"
                options={{title: "Add Friends", headerShown: false}}
            />
            <Stack.Screen
                name="[token]"
                options={{title: "Friend Request", headerShown: false}}
            />
            <Stack.Screen
                name="scan-qr"
                options={{title: "Scan QR", headerShown: false}}
            />
            <Stack.Screen
                name="split-bill"
                options={{title: "Split Bill", headerShown: false}}
            />
            <Stack.Screen
                name="split-status"
                options={{title: "Split Status", headerShown: false}}
            />
            <Stack.Screen
                name="history"
                options={{title: "Split History", headerShown: false}}
            />
            <Stack.Screen
                name="split-approve"
                options={{title: "Split Approve", headerShown: false}}
            />
        </Stack>
    );
}
