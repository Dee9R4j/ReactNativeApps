import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    // LayoutChangeEvent is no longer needed
} from "react-native";
import { useBaseStore } from "@/state/base/base";
import { parseDateTime } from "@/utils/events/dateSorter";
import {
    BookmarkIcon,
    LocationIcon,
    TimeIcon,
    BookmarkWhite,
    EventsDragon,
    DragonBottom,
    DragonTop,
    JapaneseText,
} from "@assets/images/events";
import Animated, {
    Layout,
    // useSharedValue is no longer needed unless used for something else
    // useAnimatedStyle,
    // withTiming,
} from "react-native-reanimated";
import { r_h, r_w , r_t} from "@/utils/responsive";

export interface EventCardProps {
    id: number;
    title: string;
    organizer: string;
    description: string;
    venue: string;
    live: boolean;
    date: string;
    bookmark: boolean;
}

function EventCard({
    id,
    title,
    organizer,
    description,
    venue,
    date,
    bookmark,
}: EventCardProps) {
    // These are no longer needed for the layout animation
    // const minCardHeight = 165;
    // const cardHeight = useSharedValue(minCardHeight);

    const CLOUD_HEIGHT = 136;
    const dragonHeadHeight = 130;
    const dragonBottomHeight = 75;
    const minCardHeight = 165;

    const dateObject = parseDateTime(date);
    const toggleBookmark = useBaseStore((state) => state.toggleBookmark);
    const [expanded, setExpanded] = useState(false);

    const handleBookmark = () => {
        toggleBookmark(id); // updates Zustand + DB
        console.log("Bookmark toggled for event ID:", id);
    };

    useEffect(() => {
        setExpanded(false);
    }, [id]);

    const handleMap = () => {
        console.log("Map button pressed for event ID:", id);
    };



    return (
        <Animated.View
            style={styles.eventCard}
            // onLayout={onCardLayout} // Removed
            // ✅ ADDED THIS PROP
            layout={Layout.springify().mass(1).damping(80)}
        >
            <View style={styles.dullingOverlay} />

            <View >
                <DragonTop
                    style={{ position: "absolute", top: -25, left: 0 }}
                    height={dragonHeadHeight}
                />
                <DragonBottom
                    style={{ position: "absolute", top: 80, left: 0 }}
                    height={dragonBottomHeight}
                />
                 <JapaneseText
                    style={{ position: "absolute", top: -10, left: 31 }}
                    width={30}
                    height={40}
                />
                <JapaneseText
                    style={{ position: "absolute", top: 15, left: 6 }}
                    width={30}
                    height={40}
                />
                <JapaneseText
                    style={{ position: "absolute", top: 45, left: 35 }}
                    width={15}
                    height={20}
                />

                {/* <EventsDragon
                   style={{ position: "absolute", top: -8, left: -35 }}
                    preserveAspectRatio="xMidYMid meet"
                    height={140}
                /> */}
            </View>

            <View style={styles.textContainer}>
                <View style={styles.header}>
                    <Text style={styles.eventName}>{title}</Text>
                </View>

                <View style={styles.organization}>
                    <Text style={styles.organizerText}>{organizer}</Text>
                </View>

                <Animated.View
                    style={styles.description}
                    // This tells the description block to animate its own height
                    layout={Layout.springify().mass(1).damping(80)}
                >
                    <Pressable onPress={() => setExpanded(!expanded)}>
                        <Text
                            style={styles.descriptionText}
                            numberOfLines={expanded ? undefined : 3}
                        >
                            {description}
                        </Text>

                        {description.length > 100 && (
                            <Text style={styles.readMore}>
                                {expanded ? "Read Less" : "Read More"}
                            </Text>
                        )}
                    </Pressable>
                </Animated.View>

                <View style={styles.footer}>
                    <Pressable style={styles.venue} onPress={handleMap}>
                        <LocationIcon style={{ marginRight: 4, top: 3 }} />
                        <Text style={styles.venueText}>{venue}</Text>
                    </Pressable>
                    <View style={styles.date}>
                        <TimeIcon style={{ marginRight: 4, top: 3 }} />
                        <Text style={styles.dateText}>{dateObject.time12}</Text>
                    </View>
                </View>
            </View>

            <Pressable style={styles.bookmarkButton} onPress={handleBookmark}>
                {bookmark ? (
                    <BookmarkWhite width={24} height={24} />
                ) : (
                    <BookmarkIcon width={24} height={24} />
                )}
            </Pressable>
        </Animated.View>
    );
}


const styles = StyleSheet.create({
    eventCard: {
        overflow: "hidden",
        flexDirection: "row",
        minHeight: 165,
        marginBottom: 1,
        backgroundColor: "rgba(0, 0, 0,1)",
    },
    cloudContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: "hidden",
    },
    eventCloud: {
        position: "absolute",
        left: 0,
        right: 0,
    },
    cloudRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    dullingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 0,
    },
    dragonContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 122,
        height: 180, 
        overflow: "visible", // allows dragon to go outside
    },

    textContainer: {
        marginLeft: 60,
        paddingTop: 15,
        paddingLeft: 16,
        paddingRight: 40,
        justifyContent: "flex-start",
        zIndex: 1,
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    eventName: {
        color: "#ffffff",
        fontSize: r_t(18),
        fontFamily: "Proza Libre",
    },
    organization: {
        marginTop: 4,
    },
    organizerText: {
        color: "#ffffff",
        fontFamily: "Proza Libre",
        opacity: 0.66,
    },
    description: {
        marginTop: 4,
    },
    descriptionText: {
        color: "#E8E7E7",
        fontSize: r_t(14),
        fontFamily: "Quattrocento Sans",
       
    },
    readMore: {
        marginTop: 4,
        color: "#B3B3B3",
        fontWeight: "400",
        
    },
    bookmarkButton: {
        marginTop: 12,
        position: "absolute",
        right: 12,
        top: 7,
        zIndex: 1,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        marginBottom: 12,
        gap: 20,
    },
    venue: {
        flexDirection: "row",
        flexShrink: 1,
    },
    venueText: {
        color: "#ffffff",
        fontFamily: "Quattrocento Sans",
    },
    date: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    dateText: {
        color: "#ffffff",
        fontFamily: "Quattrocento Sans",
    },
});


export default React.memo(EventCard);