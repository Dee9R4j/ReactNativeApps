import React, {useEffect} from "react"
import {Canvas, LinearGradient, rect, Rect, vec} from "@shopify/react-native-skia";
import {useDerivedValue, useSharedValue, withRepeat, withTiming} from "react-native-reanimated";

interface proptypes {
    height: number,
    width: number,
}

export const GradientLoading = (props: proptypes) => {
    const motion = useSharedValue<number>(0)
    const myRect = rect(0, 0, props.width, props.height);

    useEffect(() => {
        motion.value = withRepeat(withTiming(1, {duration: 300}), -1, false)
        return () => {
            motion.value = 0
        }
    }, [motion]);

    const starting_vec = useDerivedValue(() => {
        return vec(
            motion.value * 0.5 * props.height,
            motion.value * 0.5 * props.width
        );
    })

    const end_vec = useDerivedValue(() => {
        return vec(
            0.5 * props.height * (1 + motion.value),
            0.5 * props.width * (1 + motion.value)
        );
    })

    return (
        <Canvas style={{width: props.width, height: props.height}}>
            <Rect
                width={props.width}
                height={props.height}
                rect={myRect}
            >
                <LinearGradient
                    start={starting_vec}
                    end={end_vec}
                    colors={['#b2b2b2', '#4f4f4f']}
                />
            </Rect>
        </Canvas>
    )
}
