import React, {useMemo} from "react"
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native"
import {r_h, r_t, r_w} from "@utils/responsive";
import {useFastStore} from "@/state/fast/fast";
import MinusBuy from "@assets/images/merch/minus-buy.svg"
import {PlusBuy} from "@assets/images/merch";
import {BuyButton} from "@components/shows/BuyButton";

interface proptypes {
    price_of_one: number,
    onBuy: () => void,
    loadingBuy: boolean,
    scanned: number,
    bought: number,
    scanned_bought_loading: boolean,
    loadingPrices: boolean,
}

export function BuyN2OTicketsBox(props: proptypes) {

    const numberOfTickets = useFastStore(state => state.N2OTickets)
    const addTicketToCart = useFastStore(state => state.AddN2OTickets)
    const removeTicketFromCart = useFastStore(state => state.RemoveN2OTickets)

    const totalCost = useMemo(() => numberOfTickets * props.price_of_one, [numberOfTickets, props.price_of_one])


    return (
        <View style={styles.top_box}>
            <View style={styles.scanned_bought_box}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: r_w(2)
                }}>
                    <Text style={styles.scanned_text}>
                        SCANNED:
                    </Text>
                    {
                        props.scanned_bought_loading ?
                            <ActivityIndicator size="small" color="#fff" style={{marginLeft: r_w(10)}}/> :
                            <Text style={[styles.scanned_text, {marginLeft: r_w(10)}]}>
                                {props.scanned}
                            </Text>
                    }
                </View>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: r_w(2)
                }}>
                    <Text style={styles.scanned_text}>
                        BOUGHT:
                    </Text>
                    {
                        props.scanned_bought_loading ?
                            <ActivityIndicator size="small" color="#fff" style={{marginLeft: r_w(10)}}/> :
                            <Text style={[styles.scanned_text, {marginLeft: r_w(10)}]}>
                                {props.bought}
                            </Text>
                    }
                </View>
            </View>
            <View style={styles.box}>
                <View style={styles.price_control_box}>
                    <View>
                        <Text style={styles.total_text}>
                            TOTAL
                        </Text>
                        {
                            props.loadingPrices ?
                                (<View style={{height: r_h(30)}}>
                                <ActivityIndicator size="small" color="#fff"/>
                            </View>) : (
                                <Text style={styles.cost_text}>{'\u20b9'}{totalCost}</Text>
                                )
                        }
                    </View>
                    <View style={styles.control_box}>
                        <TouchableOpacity onPress={() => removeTicketFromCart()} disabled={numberOfTickets <= 0}>
                            <MinusBuy style={styles.control_button}/>
                        </TouchableOpacity>
                        <View style={{flex: 1, justifyContent: "center", alignItems: 'center'}}>
                            <Text style={styles.total_quantity_text}>
                                {numberOfTickets}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => addTicketToCart()} disabled={numberOfTickets >= 20}>
                            <PlusBuy style={styles.control_button}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{
                    width: "100%",
                    alignItems: "center"
                }}>
                    <BuyButton onPress={props.onBuy} disabled={props.loadingBuy}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    top_box: {
        paddingHorizontal: r_w(25),
        height: r_h(165),
        width: "100%",
    },
    scanned_bought_box: {
        height: r_h(22),
        marginBottom: r_h(12),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    scanned_text: {
        fontFamily: "Quattrocento Sans",
        fontSize: r_t(20),
        fontWeight: 400,
        color: "#fff",
        letterSpacing: -1 * r_h(0.55),
    },
    box: {
        width: "100%",
        paddingHorizontal: r_w(10),
        height: r_h(130)
    },
    price_control_box: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    cost_text: {
        fontFamily: "Quattrocento Sans",
        fontSize: r_t(30),
        fontWeight: 400,
        color: "#fff",
        letterSpacing: -1 * r_h(0.55),
    },
    total_text: {
        fontFamily: "The Last Shuriken",
        fontSize: r_h(16),
        fontWeight: 400,
        color: "#fff",
        letterSpacing: -1 * r_h(0.32),
    },
    control_box: {
        width: r_w(132),
        height: r_h(43),
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    control_button: {
        height: r_h(35),
        width: r_w(35),
    },
    total_quantity_text: {
        fontFamily: "Quattrocento Sans",
        fontSize: r_t(36),
        fontWeight: 400,
        color: "#fff",

    }
})