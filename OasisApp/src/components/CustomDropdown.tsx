import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    useWindowDimensions,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import LocationSVG from '@assets/images/map/LocationSVG.svg'
import Navigate from '@assets/images/map/Navigate.svg'


const ITEM_HEIGHT = 50;
const DROPDOWN_MAX_HEIGHT = 250;
const BORDER_WIDTH = 1.88;


interface CustomDropdownProps<T, K> {
    data: T[];
    value: K | null;
    onChange: (item: T) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    placeholder?: string;
    labelField: keyof T;
    valueField: keyof T;
    mode?: 'source' | 'destination';
    dropdownPosition?: 'top' | 'bottom';
    style?: StyleProp<ViewStyle>;
    selectedTextStyle?: StyleProp<TextStyle>;
    placeholderStyle?: StyleProp<TextStyle>;
    itemTextStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    isFocused?: boolean;
}

interface Layout {
    x: number;
    y: number;
    width: number;
    height: number;
}

const animationConfig = {
    duration: 300,
    easing: Easing.out(Easing.poly(5)),
};


const CustomDropdown = <T extends Record<string, any>, K extends string | number>({
                                                                                      data,
                                                                                      value,
                                                                                      onChange,
                                                                                      onFocus,
                                                                                      onBlur,
                                                                                      placeholder = 'Select item',
                                                                                      labelField,
                                                                                      valueField,
                                                                                      mode = 'destination',
                                                                                      dropdownPosition = 'bottom',
                                                                                      style,
                                                                                      selectedTextStyle,
                                                                                      placeholderStyle,
                                                                                      itemTextStyle,
                                                                                      containerStyle,
                                                                                      isFocused,
                                                                                  }: CustomDropdownProps<T, K>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [layout, setLayout] = useState<Layout | null>(null);
    const {height: windowHeight} = useWindowDimensions();
    const triggerRef = useRef<View>(null);
    const animation = useSharedValue(0);

    const IconComponent = mode === 'source' ? Navigate : LocationSVG;

    const selectedItem = data.find(item => item[valueField] === value);
    const selectedIndex = data.findIndex(item => item[valueField] === value);

    useEffect(() => {
        animation.value = withTiming(isOpen ? 1 : 0, animationConfig);
        if (isOpen) {
            onFocus?.();
        } else {
            onBlur?.();
        }
    }, [isOpen, animation, onFocus, onBlur]);

    const handleToggle = () => {
        triggerRef.current?.measureInWindow((x, y, width, height) => {
            setLayout({x, y, width, height});
        });
        setIsOpen(prev => !prev);
    };

    const handleItemPress = useCallback((item: T) => {
        onChange(item);
        setIsOpen(false);
    }, [onChange]);

    const handleClose = () => {
        setIsOpen(false);
    };

    const animatedContainerStyle = useAnimatedStyle(() => {
        const height = interpolate(
            animation.value,
            [0, 1],
            [0, Math.min(DROPDOWN_MAX_HEIGHT, data.length * ITEM_HEIGHT)]
        );

        const opacity = animation.value;

        const translateY = interpolate(
            animation.value,
            [0, 1],
            [dropdownPosition === 'top' ? 15 : -15, 0]
        );

        return {
            height,
            opacity,
            transform: [{translateY}],
        };
    });

    const animatedIconStyle = useAnimatedStyle(() => {
        const rotate = interpolate(animation.value, [0, 1], [0, 180]);
        return {transform: [{rotate: `${rotate}deg`}]};
    });

    const getDropdownPositionStyle = (): ViewStyle => {
        if (!layout) return {};
        const baseStyle: ViewStyle = {
            position: 'absolute',
            left: layout.x,
            width: layout.width,
            overflow: 'hidden',
        };
        if (dropdownPosition === 'top') {
            return {...baseStyle, bottom: windowHeight - layout.y};
        }
        return {...baseStyle, top: layout.y + layout.height};
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <Pressable onPress={handleToggle}>
                <View ref={triggerRef}>
                    <LinearGradient
                        colors={['#FFFFFF', '#474747', '#E9E9E9']}
                        start={{x: 0, y: 1}}
                        end={{x: 1, y: 0}}
                        locations={[0, 0.9, 1]}
                        style={styles.gradientWrapper}
                    >
                        <View style={[
                            styles.dropdown,
                            style,
                            isFocused && {backgroundColor: '#434343'}
                        ]}>
                            <View style={styles.leftContent}>
                                <IconComponent width={20} height={20} style={styles.icon} fill="#888"/>
                                <Text style={value ? selectedTextStyle : placeholderStyle} numberOfLines={1}>
                                    {selectedItem ? String(selectedItem[labelField]) : placeholder}
                                </Text>
                            </View>
                            <Animated.View style={animatedIconStyle}>
                                <Ionicons name="chevron-down" size={24} color="#fff"/>
                            </Animated.View>
                        </View>
                    </LinearGradient>
                </View>
            </Pressable>

            {layout && (
                <Modal visible={isOpen} transparent onRequestClose={handleClose}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsOpen(false)}>
                        <Animated.View style={[getDropdownPositionStyle(), animatedContainerStyle]}>
                            <LinearGradient
                                colors={['#FFFFFF', '#474747', '#E9E9E9']}
                                start={{x: 0, y: 1}}
                                end={{x: 1, y: 0}}
                                locations={[0, 0.5, 1]}
                                style={styles.gradientListWrapper}
                            >
                                <FlatList
                                    data={data}
                                    keyExtractor={(item) => String(item[valueField])}
                                    renderItem={({item}) => (
                                        <Pressable style={styles.item} onPress={() => handleItemPress(item)}>
                                            <IconComponent width={18} height={18} style={styles.icon} fill="#fff"/>
                                            <Text
                                                style={[styles.itemText, itemTextStyle]}>{String(item[labelField])}</Text>
                                        </Pressable>
                                    )}
                                    initialScrollIndex={selectedIndex > -1 ? selectedIndex : 0}
                                    getItemLayout={(_, index) => ({
                                        length: ITEM_HEIGHT,
                                        offset: ITEM_HEIGHT * index,
                                        index,
                                    })}
                                />
                            </LinearGradient>
                        </Animated.View>
                    </Pressable>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10
    },
    gradientWrapper: {
        padding: BORDER_WIDTH,
        shadowColor: '#fff',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 6,
    },
    dropdown: {
        height: 55,
        paddingHorizontal: 12,
        backgroundColor: "#000000",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: 8,
    },
    gradientListWrapper: {
        padding: BORDER_WIDTH,
        flex: 1,
    },
    item: {
        height: ITEM_HEIGHT,
        backgroundColor: '#000000',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: BORDER_WIDTH,
        borderBottomColor: '#ffffff',
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        fontFamily: 'LastShuriken',
    },
});

export default CustomDropdown;