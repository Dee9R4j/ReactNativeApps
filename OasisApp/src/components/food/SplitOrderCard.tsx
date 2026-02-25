import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {Dimensions, Image, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import Animated, {useAnimatedStyle, useSharedValue, withTiming,} from "react-native-reanimated";
import {Order, OrderItem} from "@utils/food-types";
import SplitPattern from "@assets/images/food/button-pattern.svg";
import {useSplitStore} from "@/state/base/SplitStore";
import VegIcon from "@assets/images/food/menucard-veg-icon.svg";
import NonVegIcon from "@assets/images/food/menucard-nonveg-icon.svg";

const SCREEN_WIDTH = Dimensions.get("window").width;
const widthScale = SCREEN_WIDTH / 430;
const horizontalPadding = 25 * widthScale;

const ANIMATION_DURATION = 300;
const CARD_WIDTH = SCREEN_WIDTH - horizontalPadding * 2;
const LOGO_SIZE = 40;
const MAX_VISIBLE_LOGOS = 3;

type SplitOrderCardProps = {
    currencySymbol?: string;
    selectedOrders?: Order[];
};

const PLACEHOLDER_COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
];

const getPlaceholderColor = (vendorName: string) => {
    let hash = 0;
    for (let i = 0; i < vendorName.length; i++) {
        hash = vendorName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return PLACEHOLDER_COLORS[Math.abs(hash) % PLACEHOLDER_COLORS.length];
};

const OrderItemRow = React.memo(
    ({item, currencySymbol}: { item: OrderItem; currencySymbol: string }) => (
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
                    {currencySymbol}
                    {item.unit_price.toFixed(0)}
                </Text>
                <Text style={styles.itemQuantity}>×{item.quantity}</Text>
            </View>
        </View>
    )
);

const SplitOrderCard: React.FC<SplitOrderCardProps> = ({
                                                           currencySymbol = "₹",
                                                           selectedOrders: selectedOrdersFromProp,
                                                       }) => {
    const selectedOrdersFromStore = useSplitStore(
        (state) => state.selectedOrders
    ) as Order[];

    const expansion = useSharedValue(0);
    const dropdownHeight = useSharedValue(0);

    const selectedOrders = selectedOrdersFromProp ?? selectedOrdersFromStore;
    const totalAmount = selectedOrders.reduce(
        (sum, order) => sum + order.price,
        0
    );

    const visibleOrders = selectedOrders.slice(0, MAX_VISIBLE_LOGOS);
    const remainingCount = selectedOrders.length - MAX_VISIBLE_LOGOS;
    const hasItems = selectedOrders.some(
        (order) => order.items && order.items.length > 0
    );

    const animatedIconStyle = useAnimatedStyle(() => {
        const rotate = expansion.value * 180;
        return {
            transform: [{rotate: `${rotate}deg`}],
        };
    });

    const handleToggle = () => {
        if (!hasItems) return;
        expansion.value = withTiming(expansion.value === 0 ? 1 : 0, {
            duration: ANIMATION_DURATION,
        });
    };

    const animatedContainerStyle = useAnimatedStyle(() => {
        const height = expansion.value * dropdownHeight.value;
        return {
            height,
        };
    });

    const onLayout = (event: LayoutChangeEvent) => {
        const {height} = event.nativeEvent.layout;
        if (height !== dropdownHeight.value) {
            dropdownHeight.value = height;
        }
    };

    const getVendorTotal = (order: Order) => {
        return order.items.reduce(
            (sum, item) => sum + item.unit_price * item.quantity,
            0
        );
    };

    if (selectedOrders.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No orders selected</Text>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={styles.headerContainer}
                onPress={handleToggle}
                activeOpacity={0.85}
                disabled={!hasItems}
            >
                <View style={StyleSheet.absoluteFill}>
                    <SplitPattern
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidYMid slice"
                    />
                </View>

                <View style={styles.logoContainer}>
                    {visibleOrders.map((order) => (
                        <View
                            key={order.id}
                            style={[
                                styles.logoWrapper,
                                order.vendor_image_background_color && {
                                    backgroundColor: order.vendor_image_background_color,
                                },
                            ]}
                        >
                            {order.vendor_image ? (
                                <Image
                                    source={{uri: order.vendor_image}}
                                    style={styles.logoImage}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View
                                    style={[
                                        styles.logoImage,
                                        styles.placeholderBox,
                                        {
                                            backgroundColor: getPlaceholderColor(order.vendor_name),
                                        },
                                    ]}
                                >
                                    <Text style={styles.placeholderText}>
                                        {order.vendor_name.substring(0, 2).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                    {remainingCount > 0 && (
                        <Text style={styles.plusCountText}>+{remainingCount}</Text>
                    )}
                </View>

                <View style={styles.rightSection}>
                    <Text style={styles.priceText}>
                        {`${currencySymbol}${totalAmount.toFixed(0)}`}
                    </Text>
                    {hasItems && (
                        <Animated.View style={animatedIconStyle}>
                            <Ionicons name="chevron-down-outline" size={26} color="white"/>
                        </Animated.View>
                    )}
                </View>
            </TouchableOpacity>

            <Animated.View style={[styles.dropdownContainer, animatedContainerStyle]}>
                <View style={styles.dropdownContentWrapper} onLayout={onLayout}>
                    <View style={styles.separator}/>
                    <View style={styles.itemsContainer}>
                        {selectedOrders.map((order, orderIndex) => (
                            <View key={order.id}>
                                <View style={styles.vendorHeader}>
                                    <View style={StyleSheet.absoluteFill}>
                                        <SplitPattern
                                            width="100%"
                                            height="100%"
                                            preserveAspectRatio="xMidYMid slice"
                                        />
                                    </View>

                                    <View style={styles.vendorHeaderLeft}>
                                        <View
                                            style={[
                                                styles.dropdownLogoWrapper,
                                                order.vendor_image_background_color && {
                                                    backgroundColor: order.vendor_image_background_color,
                                                },
                                            ]}
                                        >
                                            {order.vendor_image ? (
                                                <Image
                                                    source={{uri: order.vendor_image}}
                                                    style={styles.dropdownLogoImage}
                                                    resizeMode="contain"
                                                />
                                            ) : (
                                                <View
                                                    style={[
                                                        styles.dropdownLogoImage,
                                                        styles.placeholderBox,
                                                        {
                                                            backgroundColor: getPlaceholderColor(
                                                                order.vendor_name
                                                            ),
                                                        },
                                                    ]}
                                                >
                                                    <Text style={styles.dropdownPlaceholderText}>
                                                        {order.vendor_name.substring(0, 2).toUpperCase()}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        <Text style={styles.vendorName} numberOfLines={1}>
                                            {order.vendor_name}
                                        </Text>
                                    </View>

                                    <Text style={styles.vendorTotalText}>
                                        {`${currencySymbol}${getVendorTotal(order).toFixed(0)}`}
                                    </Text>
                                </View>

                                <View style={styles.vendorNameSeparator}/>

                                {order.items.map((item) => (
                                    <OrderItemRow
                                        key={`${order.id}-${item.id}`}
                                        item={item}
                                        currencySymbol={currencySymbol}
                                    />
                                ))}

                                {orderIndex < selectedOrders.length - 1 && (
                                    <View style={styles.orderSeparator}/>
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: CARD_WIDTH,
        borderWidth: 2,
        borderColor: "#ffffff",
        overflow: "hidden",
        backgroundColor: "#1a1a1a",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 18,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 18 * widthScale,
        paddingHorizontal: horizontalPadding,
        backgroundColor: "transparent",
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoWrapper: {
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        overflow: "hidden",
        marginRight: 8,
        backgroundColor: "#333",
    },
    logoImage: {width: "100%", height: "100%"},
    placeholderBox: {justifyContent: "center", alignItems: "center"},
    placeholderText: {color: "#FFFFFF", fontWeight: "bold", fontSize: 16},
    plusCountText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 4,
    },
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    priceText: {
        color: "#FFFFFF",
        fontSize: 20 * widthScale,
        fontFamily: "Quattrocento Sans Bold",
    },
    dropdownContainer: {width: "100%", overflow: "hidden"},
    dropdownContentWrapper: {position: "absolute", width: "100%"},
    separator: {height: 1, backgroundColor: "#ffffff"},
    itemsContainer: {marginBottom: 4},
    vendorHeader: {
        paddingVertical: 12,
        paddingHorizontal: horizontalPadding,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        overflow: "hidden",
    },
    vendorHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 8,
    },
    vendorName: {
        color: "#FFFFFF",
        fontSize: 14,
        fontFamily: "Proza Libre",
        zIndex: 1,
    },
    vendorTotalText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontFamily: "Quattrocento Sans Bold",
        zIndex: 1,
    },
    dropdownLogoWrapper: {
        width: 36,
        height: 36,
        overflow: "hidden",
        marginRight: 12,
        backgroundColor: "transparent",
    },
    dropdownLogoImage: {width: "100%", height: "100%"},
    dropdownPlaceholderText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 14,
    },
    vendorNameSeparator: {
        height: 2,
        backgroundColor: "#989898",
        width: "90%",
        alignSelf: "center",
    },
    orderSeparator: {height: 2, backgroundColor: "#676767"},
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: horizontalPadding,
    },
    itemLeft: {flexDirection: "row", alignItems: "center", flex: 1},
    vegIconWrapper: {marginRight: 8},
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
    emptyContainer: {
        width: CARD_WIDTH,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        marginVertical: 8,
    },
    emptyText: {color: "#666", fontSize: 16, fontFamily: "Roboto"},
});

export default React.memo(SplitOrderCard, (prev, next) => {
    const prevOrders = prev.selectedOrders || [];
    const nextOrders = next.selectedOrders || [];

    if (prevOrders.length !== nextOrders.length) return false;
    if (prev.currencySymbol !== next.currencySymbol) return false;

    for (let i = 0; i < prevOrders.length; i++) {
        if (
            prevOrders[i].id !== nextOrders[i].id ||
            prevOrders[i].vendor_image !== nextOrders[i].vendor_image ||
            prevOrders[i].vendor_image_background_color !==
            nextOrders[i].vendor_image_background_color ||
            prevOrders[i].price !== nextOrders[i].price ||
            prevOrders[i].items?.length !== nextOrders[i].items?.length
        ) {
            return false;
        }
    }

    return true;
});
