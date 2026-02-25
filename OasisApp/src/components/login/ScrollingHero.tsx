import React from "react";
import {View, LayoutChangeEvent, StyleSheet} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import {r_h} from "@utils/responsive";
import {Image} from "expo-image";
import {Easing} from "react-native-reanimated";
import Svg, {Defs, LinearGradient as SvgLinearGradient, Stop, Rect} from "react-native-svg";
import {ScrollingHeroVertical} from "@components/login/ScrollingHeroVertical";

const HEIGHT = 326
const FADE_HEIGHT = 80

export function ScrollingHero() {
    const panes = [
        {
            images: 2,
            imageURL: [
                require("@/../assets/images/login/1.png"),
                require("@/../assets/images/login/2.png"),
            ]
        },
        {
            images: 3,
            imageURL: [
                require("@/../assets/images/login/3.png"),
                require("@/../assets/images/login/4.png"),
                require("@/../assets/images/login/5.png"),
            ]
        },
        {
            images: 2,
            imageURL: [
                require("@assets/images/login/7.png"),
                require("@assets/images/login/6.png"),
            ]
        },
        {
            images: 3,
            imageURL: [
                require("@assets/images/login/8.png"),
                require("@assets/images/login/9.png"),
                // makeshift image
                // because i hate designers
                // why is adb so retarded
                require("@assets/images/login/5.png"),
            ]
        },
        {
            images: 2,
            imageURL: [
                require("@/../assets/images/login/1.png"),
                require("@/../assets/images/login/2.png"),
            ]
        },
        {
            images: 3,
            imageURL: [
                require("@/../assets/images/login/3.png"),
                require("@/../assets/images/login/4.png"),
                require("@/../assets/images/login/5.png"),
            ]
        },
        {
            images: 2,
            imageURL: [
                require("@assets/images/login/7.png"),
                require("@assets/images/login/6.png"),
            ]
        },
        {
            images: 3,
            imageURL: [
                require("@assets/images/login/8.png"),
                require("@assets/images/login/9.png"),
                // makeshift image
                // because i hate designers
                // why is adb so retarded
                require("@assets/images/login/5.png"),
            ]
        },
        {
            images: 2,
            imageURL: [
                require("@/../assets/images/login/1.png"),
                require("@/../assets/images/login/2.png"),
            ]
        },
    ]

    const slides2 = [
        [panes[0], panes[1], panes[2]],
        [panes[3], panes[4], panes[5]],
        [panes[6], panes[7], panes[8]],
        [panes[0], panes[1], panes[2]],
        [panes[3], panes[4], panes[5]],
        [panes[6], panes[7], panes[8]],
        [panes[0], panes[1], panes[2]],
    ]

    const [measuredWidth, setMeasuredWidth] = React.useState(0)
    const onLayout = React.useCallback((e: LayoutChangeEvent) => {
        const w = Math.floor(e.nativeEvent.layout.width)
        if (w) setMeasuredWidth(prev => (w !== prev ? w : prev))
    }, [setMeasuredWidth])

    // Ensure three panes exactly fill the width; prevents flexbox shrinking/overlap
    const paneWidth = measuredWidth > 0 ? Math.floor(measuredWidth / 3) : 0

    // Precompute vertical sizes with spacing subtracted so content fits exactly without overlap
    const TOTAL_H = r_h(HEIGHT)
    const SPACING = r_h(8)
    const TWO_IMG_H = (TOTAL_H - SPACING) / 2
    const THREE_SMALL_H = (TOTAL_H - 2 * SPACING) * 0.25
    const THREE_LARGE_H = (TOTAL_H - 2 * SPACING) * 0.5

    return (
        <View style={{width: '100%', height: TOTAL_H, position: 'relative'}} onLayout={onLayout}>
            {/*{measuredWidth > 0 && (*/}
            {/*    // @ts-ignore*/}
            {/*    <Carousel*/}
            {/*        data={slides2}*/}
            {/*        // Full width container (fits within parent padding); each slide renders three panes side by side*/}
            {/*        width={measuredWidth}*/}
            {/*        height={TOTAL_H}*/}
            {/*        loop={true}*/}
            {/*        autoPlay={true}*/}
            {/*        // Non-stop smooth movement between windows*/}
            {/*        autoPlayInterval={0}*/}
            {/*        scrollAnimationDuration={1400}*/}
            {/*        withAnimation={{*/}
            {/*            type: 'timing',*/}
            {/*            config: {duration: 10000, easing: Easing.linear}*/}
            {/*        }}*/}
            {/*        renderItem={({item}) => {*/}
            {/*            const [left, middle, right] = item*/}
            {/*            return (*/}
            {/*                <View style={[styles.Row, {width: measuredWidth}]}>*/}
            {/*                    <View style={[styles.Pane, {width: paneWidth}]}>*/}
            {/*                        {left.images === 3 ? (*/}
            {/*                            <>*/}
            {/*                                <Image cachePolicy={"memory-disk"} source={left.imageURL[0]}*/}
            {/*                                       contentFit="cover"*/}
            {/*                                       style={[styles.ImageBase, {*/}
            {/*                                           width: paneWidth,*/}
            {/*                                           height: THREE_SMALL_H,*/}
            {/*                                           marginBottom: SPACING*/}
            {/*                                       }]}/>*/}
            {/*                                <Image cachePolicy={"memory-disk"} source={left.imageURL[1]}*/}
            {/*                                       contentFit="cover"*/}
            {/*                                       style={[styles.ImageBase, {*/}
            {/*                                           width: paneWidth,*/}
            {/*                                           height: THREE_LARGE_H,*/}
            {/*                                           marginBottom: SPACING*/}
            {/*                                       }]}/>*/}
            {/*                                <Image cachePolicy={"memory-disk"} source={left.imageURL[2]}*/}
            {/*                                       contentFit="cover"*/}
            {/*                                       style={[styles.ImageBase, {*/}
            {/*                                           width: paneWidth,*/}
            {/*                                           height: THREE_SMALL_H*/}
            {/*                                       }]}/>*/}
            {/*                            </>*/}
            {/*                        ) : (*/}
            {/*                            <>*/}
            {/*                                <Image source={left.imageURL[0]} cachePolicy={"memory-disk"}*/}
            {/*                                       contentFit="cover"*/}
            {/*                                       style={[styles.ImageBase, {*/}
            {/*                                           width: paneWidth,*/}
            {/*                                           height: TWO_IMG_H,*/}
            {/*                                           marginBottom: SPACING*/}
            {/*                                       }]}/>*/}
            {/*                                <Image source={left.imageURL[1]} contentFit="cover"*/}
            {/*                                       cachePolicy={"memory-disk"}*/}
            {/*                                       style={[styles.ImageBase, {width: paneWidth, height: TWO_IMG_H}]}/>*/}
            {/*                            </>*/}
            {/*                        )}*/}
            {/*                    </View>*/}

            {/*                    <View style={[styles.Pane, {width: paneWidth}]}>*/}
            {/*                        {middle.images === 3 ? (*/}
            {/*                            <>*/}
            {/*                                <Image cachePolicy={"memory-disk"} source={middle.imageURL[0]}*/}
            {/*                                       contentFit="cover"*/}
            {/*                                       style={[styles.ImageBase, {*/}
            {/*                                           width: paneWidth,*/}
            {/*                                           height: THREE_SMALL_H,*/}
            {/*                                           marginBottom: SPACING*/}
            {/*                                       }]}/>*/}
            {/*                                <Image source={middle.imageURL[1]} contentFit="cover"*/}
            {/*                                       cachePolicy={"memory-disk"}*/}
            {/*                                       style={[styles.ImageBase, {*/}
            {/*                                           width: paneWidth,*/}
            {/*                                           height: THREE_LARGE_H,*/}
            {/*                                           marginBottom: SPACING*/}
            {/*                                       }]}/>*/}
            {/*                                <Image source={middle.imageURL[2]} contentFit="cover"*/}
            {/*                                       cachePolicy={"memory-disk"}*/}
            {/*                                       style={[styles.ImageBase, {*/}
            {/*                                           width: paneWidth,*/}
            {/*                                           height: THREE_SMALL_H*/}
            {/*                                       }]}/>*/}
            {/*                            </>*/}
            {/*                        ) : (*/}
            {/*                            <>*/}
            {/*                                <Image source={middle.imageURL[0]} cachePolicy={"memory-disk"}*/}
            {/*                                       contentFit="cover"*/}
            {/*                                       style={[styles.ImageBase, {*/}
            {/*                                           width: paneWidth,*/}
            {/*                                           height: TWO_IMG_H,*/}
            {/*                                           marginBottom: SPACING*/}
            {/*                                       }]}/>*/}
            {/*                                <Image source={middle.imageURL[1]} contentFit="cover"*/}
            {/*                                       cachePolicy={"memory-disk"}*/}
            {/*                                       style={[styles.ImageBase, {width: paneWidth, height: TWO_IMG_H}]}/>*/}
            {/*                            </>*/}
            {/*                        )}*/}
            {/*                    </View>*/}

            {/*                    <View style={[styles.Pane, {width: paneWidth}]}>*/}
            {/*                        {right.images === 3 ? (*/}
            {/*                            <>*/}
            {/*                                <Image source={right.imageURL[0]} contentFit="cover"*/}
            {/*                                       cachePolicy={"memory-disk"}*/}
            {/*                                       style={[styles.ImageBase, {*/}
            {/*                                           width: paneWidth,*/}
            {/*                                           height: THREE_SMALL_H,*/}
            {/*                                           marginBottom: SPACING*/}
            {/*                                       }]}/>*/}
            {/*                                <Image source={right.imageURL[1]} contentFit="cover"*/}
            {/*                                       cachePolicy={"memory-disk"}*/}
            {/*                                       style={[styles.ImageBase, {*/}
            {/*                                           width: paneWidth,*/}
            {/*                                           height: THREE_LARGE_H,*/}
            {/*                                           marginBottom: SPACING*/}
            {/*                                       }]}/>*/}
            {/*                                <Image source={right.imageURL[2]} contentFit="cover"*/}
            {/*                                       cachePolicy={"memory-disk"}*/}
            {/*                                       style={[styles.ImageBase, {*/}
            {/*                                           width: paneWidth,*/}
            {/*                                           height: THREE_SMALL_H*/}
            {/*                                       }]}/>*/}
            {/*                            </>*/}
            {/*                        ) : (*/}
            {/*                            <>*/}
            {/*                                <Image source={right.imageURL[0]} contentFit="cover"*/}
            {/*                                       cachePolicy={"memory-disk"}*/}
            {/*                                       style={[styles.ImageBase, {*/}
            {/*                                           width: paneWidth,*/}
            {/*                                           height: TWO_IMG_H,*/}
            {/*                                           marginBottom: SPACING*/}
            {/*                                       }]}/>*/}
            {/*                                <Image source={right.imageURL[1]} contentFit="cover"*/}
            {/*                                       cachePolicy={"memory-disk"}*/}
            {/*                                       style={[styles.ImageBase, {width: paneWidth, height: TWO_IMG_H}]}/>*/}
            {/*                            </>*/}
            {/*                        )}*/}
            {/*                    </View>*/}
            {/*                </View>*/}
            {/*            )*/}
            {/*        }}*/}
            {/*        vertical={true}*/}
            {/*        fixedDirection={"positive"}*/}
            {/*    />*/}
            {/*)}*/}

            <ScrollingHeroVertical/>

            {/* Bottom fade overlay */}
            <Svg
                pointerEvents="none"
                width="100%"
                height={r_h(FADE_HEIGHT)}
                style={{position: 'absolute', bottom: 0}}
            >
                <Defs>
                    <SvgLinearGradient id="scrollingHeroFade" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#000" stopOpacity={0}/>
                        <Stop offset="1" stopColor="#000" stopOpacity={1}/>
                    </SvgLinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#scrollingHeroFade)"/>
            </Svg>
        </View>
    )
}

const styles = StyleSheet.create({
    Row: {
        flexDirection: 'row' as const,
        height: r_h(HEIGHT),
    },
    Pane: {
        height: r_h(HEIGHT),
        // Use explicit margins on images; avoid 'gap' to keep height accounting exact
        gap: 0,
        marginHorizontal: 0,
        // Prevent shrinking so width stays exactly paneWidth
        flexShrink: 0 as const,
        // Clip any overflow from rounding errors
        overflow: 'hidden' as const,
    },
    ImageBase: {
        // height is set inline per image; width provided inline for type-safety
        display: 'flex' as const,
        marginHorizontal: 6,
    },
})