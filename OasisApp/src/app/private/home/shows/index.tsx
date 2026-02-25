import React, {useEffect, useState} from "react";
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import {getStatusBarHeight} from "@/utils/safeArea";
import Animated, {
    Easing,
    runOnJS,
    SensorType,
    useAnimatedSensor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";
import {Directions, Gesture, GestureDetector} from "react-native-gesture-handler";
import {useBaseStore} from "@/state/base/base";
import {BuyN2OTicketsBox} from "@components/shows/BuyN2O";
import {BuyN2OShowAPI, GetPriceOfTicket, GetShowsPageIndex, GetUserN2OTicketStats} from "@api/shows";
import {SpotifyBox} from "@components/shows/SpotifyBox";
import {DateVenueCard} from "@components/shows/DateCard";
import {Header} from "@components/shows/Header";
import {r_h, r_w} from "@utils/responsive";
import IndieTitleSVG from "@assets/images/shows/indie_nite.svg"
import TitleSVG2 from "@assets/images/shows/hiphop_title.svg"
import TitleSVG3 from "@assets/images/shows/bolly_title.svg"
import TitleSVG4 from "@assets/images/shows/n2o.svg"
import {LinearGradient} from "expo-linear-gradient";
import {SegmentHighlight} from "@components/SegmentHighlight";
import {useAuth} from "@/hooks/useAuthentication";
import {useSnackbar} from "@/utils/contextprovider/SnackbarProvider";
import {useFastStore} from "@/state/fast/fast";
import NameSVG1 from "@assets/images/shows/name1.svg"
import NameSVG2 from "@assets/images/shows/name2.svg"
import NameSVG3 from "@assets/images/shows/name3.svg"
import NameSVG4 from "@assets/images/shows/name4.svg"

import {Image} from "expo-image"

export default function Shows() {
    // crap
    const axios = useBaseStore(state => state.axios);
    // state
    const [data, setData] = useState({price: 799, scanned: 4, bought: 2});
    const [loading, setLoading] = useState({buying: false, scanned_bought: false, price: false});
    const [index, setIndex] = useState(GetShowsPageIndex());
    const indexAnimated = useSharedValue(0);

    const {isAuthenticating, authenticateUser} = useAuth()
    const {showSnackbar} = useSnackbar()

    const rotation = useAnimatedSensor(SensorType.ROTATION, {interval: 16});

    // Animation values
    const fadeAnim = useSharedValue(0);
    const boxScale = useSharedValue(0.9);

    // effects
    useEffect(() => {
        fadeAnim.value = withTiming(1, {duration: 600, easing: Easing.out(Easing.cubic)});
        boxScale.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.back(1.2))});
    }, []);

    const [merchFetchCount, setMerchFetchCount] = useState(0)

    // fetching bought collected statistics from the backend
    useEffect(() => {
        setLoading(p => ({...p, scanned_bought: true}))
        if(axios) {
            GetUserN2OTicketStats(axios).then(
                (res) => {
                    console.log(`SHOWS STATS: ${res.toString()}`)
                    console.log(res)
                    setData(p => ({...p, bought: res.bought, scanned: res.scanned}))
                    setLoading(p => ({...p, scanned_bought: false}))
                }
            ).catch(e => {
                showSnackbar({
                    type: "error",
                    message: "Failed to fetch merch statistics"
                })
            })
        }
    }, [merchFetchCount]);

    // fetch price data
    useEffect(() => {
        setLoading(p => ({...p, price: true}))
        if(axios) {
            GetPriceOfTicket(axios).then(
                (res) => {
                    setData(p => ({...p, price: res}))
                }
            ).catch((e) => {
                showSnackbar({
                    type: "error",
                    message: "Failed to fetch price"
                })
            }).finally(
                () => {
                    setLoading(p => ({...p, price: false}))
                }
            )
        }
    }, [])

    const BuyN2OTickets = () => {
        if (axios) {
            console.log(useFastStore.getState().N2OTickets)
            if (useFastStore.getState().N2OTickets === 0) {
                showSnackbar({
                    type: "error",
                    message: "You have no N2O tickets added."
                })
                return
            }

            authenticateUser().then
            (res => {
                if (res) {
                    BuyN2OShowAPI(axios).then((res) => {
                        setMerchFetchCount(p => p + 1)
                        showSnackbar({
                            type: "success",
                            message: "Tickets bought successfully"
                        })
                    })
                } else {
                    showSnackbar({
                        type: "error",
                        message: "Please authenticate to buy tickets"
                    })
                }
            }).catch(() => {
                showSnackbar({
                    type: "error",
                    message: "Failed to buy tickets"
                })
            })
        }
    }

    const OnRightSwipe = Gesture.Fling().direction(Directions.LEFT).onEnd(() => {
        if (index < 3) {
            const current_index = index
            boxScale.value = withTiming(0.9, {duration: 500});
            indexAnimated.value = withTiming(current_index + 0.5, {duration: 750, easing: Easing.linear}, () => {
                runOnJS(setIndex)(current_index + 1)
            })
            indexAnimated.value = withTiming(current_index + 1, {duration: 750, easing: Easing.linear}, () => {
                boxScale.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.back(1.2))});
            });
        }
    })
    const onLeftSwipe = Gesture.Fling().direction(Directions.RIGHT).onEnd(() => {
        if (index > 0) {
            console.log(index)
            const current_index = index
            boxScale.value = withTiming(0.9, {duration: 500});
            indexAnimated.value = withTiming(current_index - 0.5, {duration: 750, easing: Easing.linear}, () => {
                runOnJS(setIndex)(current_index - 1)
            })
            indexAnimated.value = withTiming(current_index - 1, {duration: 750, easing: Easing.linear}, () => {
                boxScale.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.back(1.2))});
            });
        }
    })

    const Headings = [
        <IndieTitleSVG height={r_h(65)} width={r_w(260)}/>,
        <TitleSVG2 height={r_h(65)} width={r_w(318)}/>,
        <TitleSVG3 height={r_h(65)} width={r_w(259)}/>,
        <TitleSVG4 height={r_h(65)} width={r_w(158)}/>,
    ]

    const image_data = [
        require("@assets/images/shows/ritviz.png"),
        require("@assets/images/shows/divine.png"),
        require("@assets/images/shows/bollynitething3.png"),
        require("@assets/images/shows/comedy.png"),
    ]

    const name_data = [
        <NameSVG1 height={r_h(100)} width={r_w(200)}/>,
    ]

    const compositeGesture = Gesture.Exclusive(OnRightSwipe, onLeftSwipe)

    const opacity = useDerivedValue(() => {
        const curr = index
        return 2 * Math.abs(curr - indexAnimated.value);
    }, []);

    const opacityStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
    }))

    const imageParallaxStyle = useAnimatedStyle(() => ({
        transform: [{
            translateY: Math.abs((indexAnimated.value - index) * 20)
        }]
    }))

    const boxAnimStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
    }))

    // const parallax = useAnimatedStyle(() => {
    //     const {pitch, roll, yaw} = rotation.sensor.value
    //     const factor = 60
    //     return {
    //         transform: [
    //             {translateX: withSpring(-roll * factor, {damping: 200})},
    //             {translateY: withSpring(-pitch * factor, {damping: 200})}
    //         ]
    //     }
    // })

    const img_bg = [
        require("@assets/images/shows/bg1.png"),
        require("@assets/images/shows/bg2.png"),
        require("@assets/images/shows/bg3.png"),
        require("@assets/images/shows/bg4.png"),
    ]

    const artist_title = [
        <NameSVG1 height={r_h(70)} width={r_w(363)}/>,
        <NameSVG2 height={r_h(95)} width={r_w(363)}/>,
        <NameSVG3 height={r_h(96)} width={r_w(363)}/>,
        <NameSVG4 height={r_h(64)} width={r_w(363)}/>,
    ]

    const new_op = useDerivedValue(() => {
        const curr = index
        return 1 - 2 * Math.abs(curr - indexAnimated.value);
    })

    const spotify_playlist_links = [
        "https://open.spotify.com/playlist/2MvGJbhUBTD0LuKNMaC4Kw?si=d8655e52189e4a45",
        "https://open.spotify.com/playlist/2vWKlMVCKWsJOdjveeqyen?si=1da8dad5a4114094",
        "https://open.spotify.com/playlist/3YQ8t3vRLIb9BA5HIA942v?si=1daed9ca27714334"
    ]

    const audio_sources = [
        require("@assets/sounds/ritviz.mp3"),
        require("@assets/sounds/hiphop.mp3"),
        require("@assets/sounds/bolly.mp3"),
    ]


    const bgOpacityStyles = useAnimatedStyle(() => {
        return {
            opacity: new_op.value,
        }
    })

    const image_op = useDerivedValue(() => {
        const curr = index
        return 1 - 0.75 * Math.abs(curr - indexAnimated.value);
    })

    const imageBgOpacity = useAnimatedStyle(
        () => {
            return {
                opacity: image_op.value,
            }
        }
    )

    return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Animated.Image
                        source={img_bg[index]}
                        style={[
                            {
                                position: "absolute",
                                bottom: r_h(-100),
                                left: 0,
                                height: r_h(960),
                                width: r_w(393),
                                backgroundColor: "#000000",
                            }, bgOpacityStyles
                        ]}
                        resizeMode={"cover"}
                    />
                    <View style={{
                        width: "100%",
                        height: r_h(60),
                        marginBottom: r_h(32)
                    }}>
                        <Header headings={Headings} index={index} animatedIndex={indexAnimated}/>
                    </View>
                    <GestureDetector gesture={compositeGesture}>
                        <View style={{flex: 1}}>
                            <DateVenueCard date={index + 8} type={index === 3 ? "n2o" : "prof show"}/>
                            <Animated.View style={[{
                                height: r_h(625),
                                width: r_w(393),
                                bottom: r_h(-90),
                                position: "absolute",
                            }, imageParallaxStyle, imageBgOpacity]}>
                                <Image source={image_data[index]} style={[{
                                    height: r_h(590),
                                    width: r_w(393),
                                }]} resizeMode={"cover"}/>
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.5)', '#000000']}
                                    locations={[0, 0.5, 1]}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: r_h(510),
                                    }}
                                />
                            </Animated.View>
                            {
                                index !== 3 && (
                                    <Animated.View style={[{
                                        position: "absolute",
                                        bottom: r_h(41),
                                        alignItems: "center",
                                    }, boxAnimStyle]}>
                                        {
                                            artist_title[index]
                                        }
                                        <SpotifyBox spotify_link={spotify_playlist_links} audio_sources={audio_sources} index={index}/>
                                    </Animated.View>
                                )
                            }
                            {
                                index === 3 && (
                                    <Animated.View style={[{
                                        position: "absolute",
                                        bottom: r_h(41),
                                        alignItems: "center",
                                        gap: r_h(16)
                                    }, boxAnimStyle]}>
                                        {
                                            artist_title[index]
                                        }
                                        <BuyN2OTicketsBox
                                            price_of_one={data.price}
                                            onBuy={BuyN2OTickets}
                                            loadingBuy={loading.buying}
                                            scanned={data.scanned}
                                            bought={data.bought}
                                            scanned_bought_loading={loading.scanned_bought}
                                            loadingPrices={loading.price}
                                        />
                                    </Animated.View>
                                )
                            }
                            <View
                                style={{
                                    height: r_h(20),
                                    width: "100%",
                                    position: "absolute",
                                    bottom: 0,
                                }}>
                                <SegmentHighlight activeSegment={indexAnimated}/>
                            </View>
                        </View>
                    </GestureDetector>
                </View>
            </SafeAreaView>
        );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: getStatusBarHeight(),
    },
    header: {
        paddingVertical: 16,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#ffffff",
    },
    content: {
        flex: 1,
        backgroundColor: "#000000",
    },
    separator: {
        height: 12,
    },
    emptyText: {
        color: "#aaa",
        textAlign: "center",
        marginTop: 24,
    },
    // Card styles
    card: {
        backgroundColor: "#262626",
        borderRadius: 12,
        padding: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#333",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    cardTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    metaText: {
        color: "#ccc",
        fontSize: 12,
    },
    dot: {
        color: "#555",
        marginHorizontal: 4,
    },
    cardBody: {
        marginTop: 10,
        gap: 8,
    },
    detailRow: {
        gap: 4,
    },
    detailLabel: {
        color: "#aaa",
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    detailValue: {
        color: "#fff",
        fontSize: 14,
        lineHeight: 20,
    },
    buyButton: {
        marginTop: 12,
        backgroundColor: "#22c55e",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    buyButtonPressed: {
        opacity: 0.9,
    },
    buyButtonDisabled: {
        backgroundColor: "#3a3a3a",
    },
    buyButtonText: {
        color: "#0b0b0b",
        fontWeight: "700",
    },
});
