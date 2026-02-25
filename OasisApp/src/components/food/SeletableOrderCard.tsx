import {Image, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {Ionicons} from "@expo/vector-icons";
import {OrderItem, OrderWithSplitStatus} from "@utils/food-types";
import Animated, {useAnimatedStyle, useSharedValue, withTiming,} from 'react-native-reanimated';
import VegIcon from "@assets/images/food/menucard-veg-icon.svg";
import NonVegIcon from "@assets/images/food/menucard-nonveg-icon.svg";
import SplitPattern from "@assets/images/food/button-pattern.svg";
import { Order } from "@/utils/food-types";


export type SelectableOrderCardProps = {
    order: Order;
    isSelected: boolean;
    onSelect: () => void;
};


const OrderItemRow = React.memo(
    ({item}: { item: OrderItem; }) => (
        <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
                <View style={styles.vegIconWrapper}>
                    {item.is_veg ? (
                        <VegIcon width={14} height={14}/>
                    ) : (
                        <NonVegIcon width={14} height={14}/>
                    )}
                </View>
                <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                </Text>
            </View>
            <View style={styles.itemRight}>
                <Text style={styles.itemPrice}>
                    ₹
                    {item.unit_price.toFixed(0)}
                </Text>
                <Text style={styles.itemQuantity}>×{item.quantity}</Text>
            </View>
        </View>
    )
);


const CheckIcon: React.FC = () => (
    <View style={styles.checkIcon}/>
);

const ANIMATION_DURATION = 250;


export default function SelectableOrderCard({
                                                isSelected,
                                                onSelect,
                                                order
                                            }: SelectableOrderCardProps) {
    const hasItems = order.items.length > 0;

    const expansion = useSharedValue(0);
    const dropdownHeight = useSharedValue(0);

    const animatedIconStyle = useAnimatedStyle(() => {
        const rotate = expansion.value * 180;
        return {
            transform: [{rotate: `${rotate}deg`}],
        };
    });

    const animatedContainerStyle = useAnimatedStyle(() => {
        const height = expansion.value * dropdownHeight.value;
        return {
            height,
            overflow: "hidden",
        };
    });

    const toggleExpansion = () => {
        if (!hasItems) return;
        expansion.value = withTiming(expansion.value === 0 ? 1 : 0, {
            duration: ANIMATION_DURATION,
        });
    };

    const onLayout = (event: LayoutChangeEvent) => {
        const {height} = event.nativeEvent.layout;
        if (height !== dropdownHeight.value) {
            dropdownHeight.value = height;
        }
    };

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <TouchableOpacity onPress={onSelect} style={styles.container}>
            <View
                style={[
                    styles.selectionIndicator,
                    isSelected && styles.selectionIndicatorSelected,
                ]}
            >
                {isSelected && <CheckIcon/>}
            </View>

            <View style={styles.card}>
                <TouchableOpacity onPress={toggleExpansion} style={styles.header}>
                    <View style={StyleSheet.absoluteFill}>
                        <SplitPattern
                            width="100%"
                            height="100%"
                            preserveAspectRatio="xMidYMid slice"
                        />
                    </View>
                    <View
                        style={[
                            styles.logoContainer,
                            {backgroundColor: order.vendor_image_background_color},
                        ]}
                    >
                        {order.vendor_image ? (
                            <Image
                                source={{uri: order.vendor_image}}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        ) : (
                            <Text style={styles.initialsText}>
                                {getInitials(order.vendor_name)}
                            </Text>
                        )}
                    </View>

                    <View style={styles.headerTextContainer}>
                        <Text style={styles.brandName} numberOfLines={1}>
                            {order.vendor_name}
                        </Text>
                        <Text style={styles.orderId}>Order #{order.id}</Text>
                        <Text style={styles.totalPrice}>₹{order.price.toFixed(0)}</Text>
                    </View>

                    <View style={styles.arrowContainer}>
                        {hasItems && (
                            <Animated.View style={animatedIconStyle}>
                                <Ionicons name="chevron-down" size={20} color="#fff"/>
                            </Animated.View>
                        )}
                    </View>
                </TouchableOpacity>

                {hasItems && (
                    <Animated.View style={animatedContainerStyle}>
                        <View style={styles.itemListContainer} onLayout={onLayout}>
                            {order.items.map((item) => (
                                <OrderItemRow key={item.id} item={item}/>
                            ))}
                        </View>
                    </Animated.View>
                )}
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 8,
    },
    selectionIndicator: {
        width: 28,
        height: 28,
        backgroundColor: "#333",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#fff",
    },
    selectionIndicatorSelected: {
        backgroundColor: "#1EBE5A",
    },
    checkIcon: {
        width: 8,
        height: 14,
        borderBottomWidth: 2.5,
        borderRightWidth: 2.5,
        borderColor: "#FFFFFF",
        transform: [{rotate: "45deg"}],
        marginBottom: 2,
    },
    card: {
        flex: 1,
        marginLeft: 8,
        overflow: "hidden",
        backgroundColor: "#000",
        borderWidth: 1,
        borderColor: "#fff",
    },
    header: {
        flexDirection: "row",
        backgroundColor: "#000000",
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "#fff",
        height: 85
    },
    logoContainer: {
        width: 75,
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderColor: "#fff"
    },
    logo: {
        width: 55,
        height: 55,
    },
    initialsText: {
        fontSize: 24,
        color: "#FFF",
        fontWeight: "bold",
    },
    headerTextContainer: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        justifyContent: "center",
    },
    brandName: {
        color: "#fff",
        fontSize: 15,
        fontFamily: "Proza Libre Bold",
    },
    orderId: {
        color: "#9E9797",
        fontSize: 12,
        marginVertical: 2,
        fontFamily: "Proza Libre"
    },
    totalPrice: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Quattrocento Sans Bold",
    },
    arrowContainer: {
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    itemListContainer: {
        position: "absolute",
        width: "100%",
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: "#000",
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: 8,
    },
    vegIconWrapper: {
        marginRight: 8,
    },
    itemName: {
        color: "#FFF",
        fontFamily: "Proza Libre",
        fontSize: 14,
        flex: 1,
    },
    itemRight: {flexDirection: "row", alignItems: "center"},
    itemPrice: {
        color: "#FFF",
        fontFamily: "Quattrocento Sans",
        fontSize: 14
    },
    itemQuantity: {
        color: "#CACACA",
        fontFamily: "Quattrocento Sans",
        fontSize: 14,
        marginLeft: 12,
    },
    vegIconBorder: {
        borderWidth: 2,
        borderColor: "#1EBE5A",
    },
    nonVegIconBorder: {
        borderWidth: 2,
        borderColor: "#E33030",
    },
});