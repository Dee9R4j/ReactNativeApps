import React from "react";
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import GoogleLogo from "@/../assets/images/login/google.svg";
import {r_h, r_t, r_w} from "@utils/responsive";

interface proptypes {
    onPress: () => void,
    disabled: boolean,
}

export function GoogleSignIn(props: proptypes) {
    return (<TouchableOpacity
        style={styles.Box}
        activeOpacity={0.42}
        disabled={props.disabled}
        onPress={props.onPress}
    >
        {
            props.disabled && (
                <View style={{alignItems: "center"}}>
                    <ActivityIndicator size="large" color="#000000"/>
                </View>
            )
        }
        {
            !props.disabled && (
                <View style={{
                    gap: r_w(18),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <View style={{
                        height: r_t(20),
                        width: r_t(20),
                    }}>
                        <GoogleLogo height={r_t(20)} width={r_t(20)}/>
                    </View>
                    <Text style={styles.Text}>
                        Direct Login
                    </Text>
                </View>
            )
        }
    </TouchableOpacity>)
}

const styles = StyleSheet.create({
    Box: {
        paddingHorizontal: r_w(53.2),
        backgroundColor: "#FFFFFF",
        width: r_w(320),
        height: r_h(51),
        marginTop: r_h(23),
        alignItems: "center",
        justifyContent: "center",
    },
    Logo: {},
    Text: {
        fontSize: r_t(20),
        fontWeight: 500,
        color: "#000000",
        fontFamily: "Roboto",
        letterSpacing: r_t(0.25)
    }
})