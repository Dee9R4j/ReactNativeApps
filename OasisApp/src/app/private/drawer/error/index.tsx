import {Button, StyleSheet, View, Text} from "react-native"
import {useBaseStore} from "@/state/base/base";
import {router} from "expo-router";
import React from "react";

interface proptypes {

}

export default function ErrorScreen(props: proptypes) {

    const errorCause = useBaseStore(state => state.appOpError)
    const clearError = useBaseStore(state => state.clearAppOpError)

    const onExit = () => {
        clearError()
        router.navigate("/")
    }

    return (
        <View style={styles.box}>
            <Text>...oops</Text>
            <Text>{errorCause}</Text>
            <Button title="Exit" onPress={onExit}/>
        </View>
    )
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})