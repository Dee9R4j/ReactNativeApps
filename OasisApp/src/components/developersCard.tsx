import React from "react";
import { View, Text, StyleSheet, Pressable, Image, Linking, Alert } from "react-native";

// Import the icon packs
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

// Make sure this path is correct
import { DeveloperCardProps } from "@/utils/developers"; 

export default function DeveloperCard({
    name,
    image, // This prop will now be used
    linkedin,
    github,
    instagram,
    behance, // This prop will now be used
}: DeveloperCardProps) {

    const handlePress = async (url: string | null): Promise<void> => {
        if (!url) {
            Alert.alert('URL not available');
            return;
        }

        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    };

    return (
        <View style={styles.eventCard}>
            
            {/* Image Background */}
            <View style={styles.imageContainer}>
                {/* FIX: Using the 'image' prop here */}
                <Image source={image} style={styles.image} />
            </View>

            {/* Overlay for content */}
            <View style={styles.infoContainer}>
                <View style={styles.nameRow}>
                    <Text style={styles.name}>{name}</Text>
                </View>
                <View style={styles.buttonRow}>
                    {/* Render button only if the URL exists */}
                    {linkedin && (
                        <Pressable style={styles.iconButton} onPress={() => handlePress(linkedin)}>
                            <FontAwesome name="linkedin-square" size={24} color="white" />
                        </Pressable>
                    )}
                    {github && (
                        <Pressable style={styles.iconButton} onPress={() => handlePress(github)}>
                            <AntDesign name="github" size={24} color="white" />
                        </Pressable>
                    )}
                    {instagram && (
                        <Pressable style={styles.iconButton} onPress={() => handlePress(instagram)}>
                            <Entypo name="instagram" size={24} color="white" />
                        </Pressable>
                    )}
                    {/* ADDED: Behance button */}
                    {behance && (
                         <Pressable style={styles.iconButton} onPress={() => handlePress(behance)}>
                            <FontAwesome5 name="behance" size={24} color="white" />
                        </Pressable>
                    )}
                </View >
            </View>
        </View>
    );
}

// Updated Styles
const styles = StyleSheet.create({
    eventCard: {
        height: 145, // Use fixed height or aspectRatio
        marginBottom: 1,
        backgroundColor: '#333', // Fallback color
        overflow: 'hidden',
    },
    imageContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    infoContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay
        zIndex: 1,
        padding: 16,
        justifyContent: 'space-between', // Pushes name to top, buttons to bottom
    },
    nameRow: {
        // Name stays at the top
    },
    name: {
        color: "#ffffff",
        fontSize: 22,
        fontFamily: 'Firlest', // Make sure this font is loaded
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        // This view is at the bottom of infoContainer
    },
    iconButton: {
        marginRight: 15, // Spacing between icons
    },
});