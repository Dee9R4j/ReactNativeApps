import React from "react";
import {StyleSheet, View, Text} from "react-native";
import ClockSVG from "@/../assets/images/shows/clock.svg";
import {r_h, r_t, r_w} from "@/utils/responsive";
import LocationSVG from "@/../assets/images/shows/location.svg";

interface proptypes {
    date: number,
    type: "prof show" | "n2o"
}

export function DateVenueCard(props: proptypes) {
    return (
        <View>
            <View style={{
                flexDirection: "row",
                paddingHorizontal: r_w(40),
                width: "100%",
                alignItems: "center",
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <View style={{
                        width: r_w(32),
                        height: r_h(32),
                        marginRight: r_w(21),
                    }}>
                        <ClockSVG width={r_h(32)} height={r_w(32)}/>
                    </View>
                    <View style={{
                        alignItems: "center",
                        marginRight: r_w(32)
                    }}>
                        <View style={{
                            flexDirection: "row",
                            gap: r_w(6)
                        }}>
                            <View style={{
                                flexDirection: "row",
                            }}>
                                <Text style={[styles.DCText1, {
                                    fontSize: r_t(20),
                                    fontWeight: 400
                                }]}>
                                    {props.date}
                                </Text>
                                <Text style={[styles.DCText1, {
                                    fontSize: r_t(10),
                                    fontWeight: 700,
                                }]}>TH</Text>
                            </View>
                            <View>
                                <Text style={[styles.DCText2, {fontSize: r_t(20), fontWeight: 400}]}>
                                    NOV
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.DCText2, {fontSize: r_t(20), fontWeight: 400}]}>
                            7PM
                        </Text>
                    </View>
                </View>
                <View style={{
                    width: r_w(3),
                    height: r_h(76),
                    backgroundColor: "#fff",
                    marginRight: r_w(30),
                }}/>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <View style={{
                        width: r_w(32),
                        height: r_h(32),
                        marginRight: r_w(18)
                    }}>
                        <LocationSVG width={r_h(32)} height={r_w(32)}/>
                    </View>
                    <View style={{
                        justifyContent: "flex-start"
                    }}>
                        <Text style={[styles.DCText1, {
                            fontSize: r_t(20),
                            color: "#fff"
                        }]}>{props.type === "n2o" ? "MAIN" : "SOUTH"}</Text>
                        <Text
                            style={[styles.DCText2, {
                                fontSize: r_t(20),
                                color: "#ff0000"
                            }]}
                        >
                            {props.type === "n2o" ? "AUDI" : "PARK"}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    DCText1: {
        color: "#ff0000",
        fontFamily: "Quattrocento Sans",
    },
    DCText2: {
        color: "#fff",
        fontFamily: "Quattrocento Sans",
        fontWeight: 400,
    },

})