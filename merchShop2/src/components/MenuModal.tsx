//MenuModal.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

interface MenuModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ isVisible, onClose }) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(300);
  const backdropOpacity = useSharedValue(0);

  // Animation effects
  useEffect(() => {
    if (isVisible) {
      translateY.value = withTiming(0, { duration: 300 });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(300, { duration: 300 });
      backdropOpacity.value = withTiming(0, { duration: 250 });
    }
  }, [isVisible]);

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isVisible) {
          onClose();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [isVisible]);

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route);
  };

  if (!isVisible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />
      
      {/* Clickable backdrop */}
      <TouchableOpacity 
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      />

      <Animated.View style={[
        styles.modalContainer,
        animatedModalStyle,
        { bottom: insets.bottom + 60 } // Adjust 60 to match your tab bar height
      ]}>
        <View style={styles.menuItemsContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleNavigation('/orders')}
          >
            <Icon name="assignment" size={24} color="#333" />
            <Text style={styles.menuItemText}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleNavigation('/wishlist')}
          >
            <Icon name="favorite-border" size={24} color="#e91e63" />
            <Text style={styles.menuItemText}>Wishlist</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleNavigation('/about')}
          >
            <Icon name="info-outline" size={24} color="#333" />
            <Text style={styles.menuItemText}>About Us</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleNavigation('/contact')}
          >
            <Icon name="email" size={24} color="#333" />
            <Text style={styles.menuItemText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 16,
  },
  menuItemsContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 20,
  },
});

export default MenuModal;