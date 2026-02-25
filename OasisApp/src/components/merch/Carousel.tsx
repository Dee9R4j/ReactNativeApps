import React from "react"
import {StyleSheet, TouchableOpacity, View} from "react-native"
import Animated, {
    interpolate,
    runOnJS,
    SharedValue,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue
} from "react-native-reanimated";
import {Image} from "expo-image"
import {Ionicons} from "@expo/vector-icons";
import {IMerchAPI} from "@/models/merch";
import { BackMerch, ForwardMerch } from "@assets/images/merch";

const AnimatedImage = Animated.createAnimatedComponent(Image)

interface CarouselProps {
    data: IMerchAPI[],
    width: number,
    height: number,
    currentIndex: number,
    setCurrentIndex: (index: number) => void,
}

export const Carousel = (props: CarouselProps) => {

    const scrollX = useSharedValue(0)

    const flatlistRef = useAnimatedRef<Animated.FlatList<IMerchAPI>>();

    const onScroll = (event: any) => {
        scrollX.value = event.nativeEvent.contentOffset.x / props.width
    }

    const text_opacity = useDerivedValue(() => {
        return Math.abs(0.5 - (scrollX.value % 1)) * 2
    })

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: text_opacity.value,
    }))

    useAnimatedReaction(
        () => {
            'worklet'
            return Math.round(scrollX.value)
        }
        ,
        (currentValue, previousValue) => {
            'worklet'
            if (currentValue !== previousValue) {
                runOnJS(props.setCurrentIndex)(currentValue)
            }
        },
        [scrollX]
    )

    const onNext = () => {
        if (props.currentIndex < props.data.length - 1) {
            flatlistRef.current?.scrollToIndex({
                index: props.currentIndex + 1,
                animated: true,
            });
        }
    }

    const onPrev = () => {
        // Scroll to previous
        if (props.currentIndex > 0) {
            flatlistRef.current?.scrollToIndex({
                index: props.currentIndex - 1,
                animated: true,
            });
        }
    }

    return (
        <View style={{
            alignItems: "center",
            width: "100%"
        }}>
            <View style={{
                width: props.width,
                height: props.height,
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: 16
            }}>
                <Animated.FlatList
                    ref={flatlistRef}
                    data={props.data}
                    renderItem={({
                                     item,
                                     index
                                 }) => (
                        <Photo
                            url={item.image_url}
                            blurhash={item.blur_hash}
                            index={index}
                            width={props.width}
                            height={props.height}
                            scrollX={scrollX}
                        />)}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    onScroll={onScroll}
                    scrollEventThrottle={1000 / 16}
                    style={{
                        width: props.width,
                        height: props.height
                    }}
                />
            </View>
            <View style={styles.container}>
                <TouchableOpacity onPress={onPrev}>
                    <BackMerch height={40} width={40} />
                </TouchableOpacity>
                <Animated.Text
                    style={[animatedTextStyle, styles.text]}
                >
                    {props.data[props.currentIndex]?.name} : ${props.data[props.currentIndex]?.price}
                </Animated.Text>
                <TouchableOpacity onPress={onNext}>
                    <ForwardMerch height={40} width={40} />
                </TouchableOpacity>


            </View>
        </View>
    )
}

interface ImageProps {
    url: string,
    blurhash: string,
    index: number,
    scrollX: SharedValue<number>,
    width: number,
    height: number,
}

const Photo = (props: ImageProps) => {

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: interpolate(props.scrollX.value, [props.index - 1, props.index, props.index + 1], [1.4, 1, 1.4])
            },
            {
                rotate: interpolate(props.scrollX.value, [props.index - 1, props.index, props.index + 1], [-15, 0, 15]) + 'deg'
            }
        ]
    }))

    return (
        <View
            style={{
                width: props.width,
                height: props.height,
                borderRadius: 16,
                overflow: "hidden",
            }}
        >
            <AnimatedImage
                source={{uri: props.url}}
                style={[animatedStyle, {
                    flex: 1,
                }]}
                contentFit="cover"
                placeholder={props.blurhash}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        padding: 16,
    },
    text: {
        fontSize: 15,
        color: "white",
        fontFamily: 'The Last Shuriken',
    },
    priceTag: {
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    }
})