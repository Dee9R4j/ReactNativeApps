//Card.tsx
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const Card: React.FC<{ item: any }> = ({ item }) => {
  const router = useRouter();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    router.push(`/product/${item.id}`);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedTouchableOpacity 
        style={[styles.card, animatedStyle]} 
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9} // To allow reanimated animation to be more visible
    >
      <View style={styles.imageContainer}>
        <Image 
          source={item.photo1} 
          style={styles.cardImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
        <Text style={styles.cardPrice}>₹{item.price.toFixed(2)}</Text>
      </View>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%', // For 2 columns, adjust with margin
    backgroundColor: '#fff',
    borderRadius: 12, // Softer radius
    overflow: 'hidden', // Important for borderRadius on Image
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Softer shadow
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.15, // Platform specific shadow
    shadowRadius: 6, // Softer shadow
    elevation: 4, // Android shadow
    margin: '1%', // Margin for spacing between cards
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // Makes image container square
    overflow: 'hidden', // Ensures image respects border radius
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    padding: 12,
    alignItems: 'flex-start', // Align text to the left
  },
  cardName: {
    fontWeight: '600', // Bolder
    fontSize: 15,
    marginBottom: 4,
    color: '#333',
  },
  cardPrice: {
    fontWeight: 'bold',
    color: '#27ae60', // Slightly different green
    fontSize: 16,
  },
});

export default Card;