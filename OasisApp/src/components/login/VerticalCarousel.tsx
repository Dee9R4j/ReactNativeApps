import React, {useEffect, useMemo, useRef} from "react"
import {Animated, Easing, Image, ImageSourcePropType, StyleSheet, View} from "react-native"
import {r_h} from "@utils/responsive"
interface CarouselProps {
    width: number
    height: number
    imageHeight?: number
    direction: "up" | "down"
    duration: number
    images: any[]
}

export function VerticalCarousel(props: CarouselProps) {
    const {width, height, imageHeight, direction, duration, images} = props

    const progress = useRef(new Animated.Value(0)).current
    const itemMargin = r_h(4)

    const imageCount = images.length
    // Each item should use the provided `height` prop so the total translation matches the rendered size.
    const itemHeight = imageHeight ?? height
    const itemStride = itemHeight + itemMargin * 2
    const totalHeight = itemStride * imageCount // include vertical margins to avoid a visible jump
    const repeatsToCoverContainer = useMemo(() => {
        if (imageCount === 0) {
            return 0
        }
        const stride = itemStride > 0 ? itemStride : 1
        // Ensure the rendered stack is always taller than the viewport so seams stay hidden.
        return Math.max(2, Math.ceil(height / stride) + 1)
    }, [height, imageCount, itemStride])
    const duplicatedData = useMemo(() => {
        if (imageCount === 0 || repeatsToCoverContainer === 0) {
            return []
        }
        const result: typeof images = []
        for (let i = 0; i < repeatsToCoverContainer; i += 1) {
            result.push(...images)
        }
        return result
    }, [images, imageCount, repeatsToCoverContainer])
    const safeDuration = Math.max(16, duration)
    const totalDuration = safeDuration * imageCount

    // Keep a normalized progress value looping from 0 to 1 so we can map it to the desired translation.
    useEffect(() => {
        if (imageCount === 0) {
            return
        }

        progress.stopAnimation()
        progress.setValue(0)

        // Loop the normalized progress from 0->1. Because we duplicate the items and
        // ensure `totalHeight` equals the real rendered height of the first set,
        // resetting before iteration won't produce a visible gap.
        const animation = Animated.loop(
            Animated.timing(progress, {
                toValue: 1,
                duration: totalDuration,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            {resetBeforeIteration: true, iterations: -1},
        )

        animation.start()
        return () => {
            animation.stop()
        }
    }, [progress, totalDuration, direction, imageCount])

    const translateY = progress.interpolate({
        inputRange: [0, 1],
        outputRange: direction === "up" ? [0, -totalHeight] : [-totalHeight, 0],
    })

    if (!width || !height || imageCount === 0) {
        return null
    }

    return (
        <View style={[styles.container, {width, height}]}>
            <Animated.View style={[styles.stack, {transform: [{translateY}]}]}>
                {duplicatedData.map((source, index) => (
                    <Image
                        key={`vertical-carousel-${index}`}
                        source={source}
                        // Use the dedicated image height so totalHeight matches rendered items.
                        style={{width, height: itemHeight, marginVertical: itemMargin}}
                        resizeMode="cover"
                    />
                ))}
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
    },
    stack: {
        flexDirection: "column",
    },
})