import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Canvas, Path, Skia, vec } from "@shopify/react-native-skia";
import React from "react";
import { r_t } from "@/utils/responsive";


export default function Timer() {
    const strokeWidth = 4.5;
    const size = 90;
    const radius = 25;
    const center = vec(size / 2, size / 2);

    const [angle, setAngle] = useState<number>(360);
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startTimer = () => {
        const totalDuration = 30000;
        const start = Date.now();

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(totalDuration - elapsed, 0);
            const angleProgress = (remaining / totalDuration) * 360;
            const secondsLeft = Math.ceil(remaining / 1000);
            setAngle(angleProgress);
            setTimeLeft(secondsLeft);

            if (remaining === 0) {
                clearInterval(intervalRef.current!);
                setTimeout(() => {
                    setAngle(360);
                    setTimeLeft(30);
                    startTimer();
                }, 0);
            }
        }, 1000 / 60);
    };

    useEffect(() => {
        startTimer();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const arcPath = Skia.Path.Make();

    arcPath.addArc(
        {
            x: center.x - radius,
            y: center.y - radius,
            width: radius * 2,
            height: radius * 2,
        },
        -90,
        angle
    );

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Canvas style={{ width: size, height: size }}>
                <Path
                    path={Skia.Path.Make().addOval({
                        x: center.x - radius,
                        y: center.y - radius,
                        width: radius * 2,
                        height: radius * 2,
                    })}
                    style="stroke"
                    strokeWidth={strokeWidth}
                    color="#2E1919"
                />
                <Path
                    path={arcPath}
                    style="stroke"
                    strokeWidth={strokeWidth}
                    color="#ffffff"
                />
            </Canvas>
            <View style={styles.timerTextContainer}>
                <Text style={styles.timerText}>{timeLeft}</Text>
            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
    },
    timerTextContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    timerText: {
        fontSize: r_t(20),
        fontFamily: "Quattrocento Sans",
        color: "white",
    },
});