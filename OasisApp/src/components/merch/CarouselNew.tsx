import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Pressable, StyleSheet, TouchableOpacity, View} from "react-native"
import {Directions, Gesture, GestureDetector, Text} from "react-native-gesture-handler";
import {r_h, r_t, r_w} from "@utils/responsive";
import {Image} from "expo-image";
import * as Haptics from "expo-haptics"
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import RotateSVG from "@/../assets/images/merch/RotateMerch.svg"
import {GradientBox} from "@components/GradientBox";
import GraphicCenter from "@/../assets/images/merch/GraphicCenter.svg"
import GraphicRightPNG from "@/../assets/images/merch/GraphicRight.png";
import GraphicLeftPNG from "@/../assets/images/merch/GraphicLeft.png";
import ForwardMerch from "@assets/images/merch/forward-merch.svg";
import BackwardMerch from "@assets/images/merch/back-merch.svg";

interface proptypes {
    image_data: { image_front: any, image_back: any }[],
    merch_data: { price: number, name: string }[],
    imageIndex: number,
    setImageIndex: (index: number) => void,
}

const AnimatedImage = Animated.createAnimatedComponent(Image)
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

export function MerchCarouselNew(props: proptypes) {

    const index = useSharedValue(props.imageIndex)
    const opacity = useDerivedValue(() => {
        return 0.25 + 1.5 * (0.5 - Math.abs(index.value - props.imageIndex))
    })
    const [rotated, setRotated] = useState<0 | 1>(0)
    const toggleRotated = useCallback(() => {
        setRotated(p => (p === 0 ? 1 : 0))
    }, [])
    const [tooLong, setTooLong] = useState(false)
    const rotatedSV = useSharedValue(0)
    const isRotating = useSharedValue(false)
    const currentRotation = useSharedValue(0)

    const onRotate = () => {
        "worklet"
        if (rotatedSV.value === 0) {
            rotatedSV.value = withTiming(1, {duration: 50})
        } else {
            rotatedSV.value = withTiming(0, {duration: 50})
        }

        if (isRotating.value) {
            return
        }
        isRotating.value = true
        currentRotation.value = withTiming(90, {duration: 400}, finished => {
            if (!finished) {
                isRotating.value = false
                return
            }
            runOnJS(toggleRotated)()
            currentRotation.value = withTiming(0, {duration: 400}, () => {
                isRotating.value = false
            })
        })
    }

    const LeftSwipeLogic = () => {
        // go to next
        "worklet"

        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light)
        if (rotatedSV.value === 1) {
            onRotate()
        }

        const current_idx = props.imageIndex
        if (props.imageIndex < props.image_data.length - 1) {
            index.value = withTiming(current_idx + 0.5, {duration: 450, easing: Easing.linear}, () => {
                runOnJS(props.setImageIndex)(props.imageIndex + 1)
            })
            index.value = withTiming(current_idx + 1, {duration: 450, easing: Easing.linear})
        }
    }

    const LeftSwipe = Gesture.Fling().direction(Directions.LEFT).onEnd(() => {
        LeftSwipeLogic()
    })


    const RightSwipeLogic = () => {
        "worklet"
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light)

        if (rotatedSV.value === 1) {
            onRotate()
        }

        if (props.imageIndex > 0) {
            // runOnJS(rotateOnRotated)()
            const current_idx = props.imageIndex
            index.value = withTiming(current_idx - 0.5, {duration: 450, easing: Easing.linear}, () => {
                runOnJS(props.setImageIndex)(props.imageIndex - 1)
            })
            index.value = withTiming(current_idx - 1, {duration: 450, easing: Easing.linear})
        }
    }

    const RightSwipe = Gesture.Fling().direction(Directions.RIGHT).onEnd(() => {
        // go to previous
        RightSwipeLogic()
    })

    const swipeGesture = Gesture.Exclusive(LeftSwipe, RightSwipe)

    const ImageViewAnimatedStyles = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }))

    const rotator = useAnimatedStyle(() => ({
        transform: [
            {
                rotateY: `-${currentRotation.value}deg`
            }
        ]
    }))

    const price_animated_style = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }))

    const [nameLayout, setNameLayout] = useState({
        fontSize: 24,
        numberOfLines: 1
    })

    useEffect(() => {
        setTooLong(false)
    }, [props.imageIndex]);

    // @ts-ignore
    const handleLayout = (event) => {
        const {width} = event.nativeEvent.layout;
        console.log(width)
        if (width > 220) {
            setNameLayout({
                fontSize: 16,
                numberOfLines: 2
            })
            setTooLong(true)
        }
    }

    return (
        <View style={{
            flex: 1
        }}>
            <View style={{
                alignItems: "center",
                height: r_h(315),
                overflow: "visible"
            }}>
                <BackGroundStack/>
                <GestureDetector gesture={swipeGesture}>
                    <Animated.View style={[{
                        position: "absolute",
                        top: 19,
                        height: r_h(277),
                        width: r_w(322),
                        zIndex: 50,
                    }, rotator]}>
                        <AnimatedImage
                            source={rotated === 0 ? props.image_data[props.imageIndex].image_front : props.image_data[props.imageIndex].image_back}
                            style={[styles.image, ImageViewAnimatedStyles]}
                            contentFit="contain"
                            cachePolicy="memory-disk"
                        />
                    </Animated.View>
                </GestureDetector>
            </View>
            <View
                style={{
                    height: r_h(50),
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <AnimatedTouchableOpacity
                    style={[{
                        height: r_h(45),
                        width: r_w(45),
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: r_h(5),
                        marginLeft: r_w(57)
                    }]} onPress={onRotate}
                >
                    <GradientBox width={r_w(45)} height={r_h(45)} border={r_h(2)}>
                        <Animated.View style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <RotateSVG height={r_h(17.54)} width={r_w(27.69)}/>
                        </Animated.View>
                    </GradientBox>
                </AnimatedTouchableOpacity>
                <View style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    marginTop: r_h(14),
                    marginLeft: r_w(47),
                    width: r_w(100)
                }}>
                    <GradientBox width={r_w(100)} height={r_h(36)} border={r_w(2)}>
                        <Animated.View style={[price_animated_style, {
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "transparent"
                        }]}>
                            <Text style={{
                                fontFamily: "The Last Shuriken",
                                fontSize: r_t(17),
                                color: "#fff"
                            }}>
                                Rs. {props.merch_data[props.imageIndex].price}
                            </Text>
                        </Animated.View>
                    </GradientBox>
                </View>
                <>
                </>
            </View>
            <View style={{
                flexDirection: "row",
                height: r_h(28),
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                paddingHorizontal: r_w(37.25),
                marginTop: r_h(25)
            }}>
                <TouchableOpacity onPress={RightSwipeLogic} style={{
                    flex: 1,
                    opacity: props.imageIndex > 0 ? 1 : 0.5,
                }}>
                    <BackwardMerch height={r_h(23)} width={r_w(36)}/>
                </TouchableOpacity>

                <Animated.View style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: r_w(248),
                }}>
                    <Text
                        onLayout={handleLayout}
                        style={{
                            fontFamily: "The Last Shuriken",
                            fontSize: r_t(14),
                            fontWeight: 400,
                            color: "#ffffff"
                        }}
                    >
                        {props.merch_data[props.imageIndex].name}
                    </Text>

                </Animated.View>
                {
                    props.imageIndex < props.image_data.length && (
                        <TouchableOpacity onPress={LeftSwipeLogic} style={{
                            flex: 1,
                            opacity: props.imageIndex < 3 ? 1 : 0.5,

                        }}>
                            <ForwardMerch height={r_h(23)} width={r_w(36)}/>
                        </TouchableOpacity>
                    )
                }
                {
                    props.imageIndex >= props.image_data.length - 1 && (
                        <View/>
                    )
                }
            </View>
        </View>
    )
}

const NameCard = ({name}: { name: string }) => {
    return (
        <View>
            <Text>

            </Text>
        </View>
    )
}

const BackGroundStack = () => {
    return (
        <View style={bgStyles.box}>
            <View style={{
                marginRight: -1 * r_h(22),
                marginTop: r_h(22),
                height: r_h(218),
                width: r_w(88),
            }}>
                {/*<GraphicLeft height={r_h(292)} width={r_w(80)} filter={"#CC0007"}/>*/}
                <Image source={GraphicLeftPNG}
                       style={{
                           height: r_h(218),
                           width: r_w(88),
                       }}
                />
            </View>
            <View style={{
                zIndex: 10,
            }}>
                <GraphicCenter height={r_h(315)} width={r_w(175)}/>
            </View>
            <View style={{zIndex: 2, marginTop: r_h(76), marginLeft: -1 * r_h(24), height: r_h(290), width: r_w(90)}}>
                <Image source={GraphicRightPNG} style={{
                    height: r_h(290),
                    width: r_w(90)
                }}/>
            </View>
        </View>
    )
}

const bgStyles = StyleSheet.create({
    box: {
        flexDirection: "row",
        height: r_h(315),
        width: r_w(370),
        justifyContent: "center",
    },
})

const styles = StyleSheet.create({
    netbox: {
        height: r_h(368),
        width: r_w(370),
    },
    image: {
        height: r_h(278),
        marginBottom: r_h(70),
        // marginTop: r_h(20)
    }
})