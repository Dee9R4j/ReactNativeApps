import React, {useCallback, useEffect, useState} from "react"
import {ActivityIndicator, Linking, StyleSheet, TouchableOpacity, View} from "react-native"
import SpotifySVG from "@/../assets/images/shows/spotify.svg"
import PlaySVG from "@/../assets/images/shows/play.svg"
import {r_h, r_w} from "@utils/responsive";
import * as Sentry from '@sentry/react-native';
import {Audio} from 'expo-av';
import {SoundObject} from "expo-av/src/Audio/Sound";

interface proptypes {
    spotify_link: string[];
    audio_sources: any[];
    index: number;
}

export function SpotifyBox(props: proptypes) {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [soundLoading, setSoundLoading] = useState(false);

    // Set audio mode when component mounts
    useEffect(() => {
        const setAudioMode = async () => {
            try {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                });
            } catch (error: any) {
                console.error("Error setting audio mode:", error);
            }
        };
        setAudioMode();
    }, []);

    // Cleanup sound when component unmounts or index changes
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    // Reset playing state when index changes
    useEffect(() => {
        if (sound) {
            sound.unloadAsync();
            setSound(null);
        }
        setIsPlaying(false);
    }, [props.index]);

    const togglePlayPause = async () => {
        try {
            if (sound) {
                // Sound already loaded, toggle play/pause
                const status = await sound.getStatusAsync();
                if (status.isLoaded) {
                    if (isPlaying) {
                        await sound.pauseAsync();
                        setIsPlaying(false);
                        console.log("Audio paused");
                    } else {
                        await sound.playAsync();
                        setIsPlaying(true);
                        console.log("Audio resumed");
                    }
                }
            } else {
                // Load and play the audio
                const audioSource = props.audio_sources[props.index];
                console.log("Attempting to play audio at index:", props.index);
                console.log("Audio source:", audioSource);

                if (!audioSource) {
                    console.error("No audio source found at index:", props.index);
                    return;
                }

                console.log("Loading audio...");
                setSoundLoading(true);
                const {sound: newSound} = await Audio.Sound.createAsync(
                    audioSource,
                    {shouldPlay: true},
                    (status) => {
                        // Update playing state when audio finishes
                        if (status.isLoaded && status.didJustFinish) {
                            setIsPlaying(false);
                            console.log("Audio finished playing");
                        }
                    }
                );
                setSoundLoading(false);
                setSound(newSound);
                setIsPlaying(true);
                console.log("Audio loaded and playing");
            }
        } catch (error: any) {
            console.error("Error playing audio:", error);
            Sentry.captureException(error);
            setIsPlaying(false);
        }
    };

    const openSpotifyLink = async () => {
        const link = props.spotify_link[props.index];
        if (link) {
            try {
                const canOpen = await Linking.canOpenURL(link);
                if (canOpen) {
                    await Linking.openURL(link);
                } else {
                    console.warn("Cannot open Spotify link:", link);
                }
            } catch (error: any) {
                console.error("Error opening Spotify link:", error);
                Sentry.captureException(error);
            }
        }
    };

    return (
        <View style={styles.box}>
            <View style={styles.touch_net_box}>
                <TouchableOpacity style={styles.touch_boxes} onPress={openSpotifyLink}>
                    <SpotifySVG height={r_h(44)} width={r_w(44)}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touch_boxes} onPress={togglePlayPause} disabled={soundLoading}>
                    {soundLoading ? (<ActivityIndicator size="small" color="#fff" style={{
                        height: r_h(44),
                        width: r_w(44)
                    }}/>) : (
                        <PlaySVG height={r_h(44)} width={r_w(44)}/>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    box: {
        width: r_w(393),
        paddingHorizontal: r_w(25),
        flexDirection: "row",
        justifyContent: "center",
        height: r_h(100),
        alignItems: "center",
    },
    spectral: {
        height: r_h(46),
        width: r_w(141)
    },
    touch_boxes: {},
    touch_net_box: {
        gap: r_w(16),
        alignItems: "center",
        flexDirection: "row",
    }
})