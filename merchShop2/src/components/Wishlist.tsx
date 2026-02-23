// Wishlist.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useShop } from '../context/ShopContext'; // Adjust path
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

const WishlistScreen: React.FC = () => {
  const { state, dispatch } = useShop();
  const insets = useSafeAreaInsets();

  const moveToCart = (item: any) => {
    dispatch({ type: 'MOVE_TO_CART', payload: item });
    // Optionally show a confirmation
    Alert.alert("Moved to Cart", `${item.name} has been moved to your cart.`);
  };

  const removeFromWishlist = (id: number, name: string) => {
    Alert.alert(
        "Remove from Wishlist",
        `Are you sure you want to remove ${name} from your wishlist?`,
        [
            {text: "Cancel", style: "cancel"},
            {text: "Remove", style: "destructive", onPress: () => dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id })}
        ]
    )
  };

  return (
    <View style={[styles.outerContainer, { 
        // paddingTop: insets.top, // Header handled by modal presentation
        paddingBottom: insets.bottom 
    }]}>
      <ScrollView 
        contentContainerStyle={[styles.container, {paddingTop: 20}]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header text is now part of Stack.Screen options in app/_layout.tsx */}
        {/* <Text style={styles.header}>Wishlist</Text> */}
        {state.wishlist.length === 0 ? (
            <View style={styles.emptyContainer}>
                <Icon name="favorite-border" size={100} color="#ccc" />
                <Text style={styles.emptyMessage}>Your Wishlist is Empty</Text>
                <Text style={styles.emptySubMessage}>Tap the heart on products to save them here.</Text>
            </View>
        ) : (
          state.wishlist.map((item: any) => (
            <AnimatedView 
                key={item.id} 
                style={styles.wishlistItem}
                entering={FadeIn.duration(300)}
                layout={Layout.springify()}
                exiting={FadeOut.duration(200)}
            >
              <Image source={item.photo1} style={styles.wishlistItemImage} />
              <View style={styles.wishlistItemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.wishlistActions}>
                <TouchableOpacity onPress={() => moveToCart(item)} style={styles.actionButton}>
                  <Icon name="add-shopping-cart" size={24} color="#27ae60" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromWishlist(item.id, item.name)} style={styles.actionButton}>
                  <Icon name="delete-outline" size={24} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            </AnimatedView>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f5f4ee',
  },
  container: {
    paddingHorizontal: 15, // Use horizontal padding
    // padding: 20, // Original
  },
//   header: { // Handled by Stack Navigator
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20, // Increased margin
//     color: '#333',
//   },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    minHeight: 300, // Ensure it takes some space
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 18,
    fontWeight: '500',
  },
  emptySubMessage: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 8,
    fontSize: 14,
  },
  wishlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between', // Let info flex
    padding: 12, // Consistent padding
    // borderWidth: 1, // Removed border for cleaner look
    // borderColor: '#ddd', // Softer border
    borderRadius: 12, // More rounded
    marginBottom: 15,
    backgroundColor: '#ffffff', // White background for items
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  wishlistItemImage: {
    width: 70, // Slightly smaller
    height: 70,
    borderRadius: 8, // More rounded
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  wishlistItemInfo: {
    flex: 1, // Allows item name to take available space
    marginRight: 10, // Space before action buttons
  },
  itemName: {
    fontSize: 16, // Slightly smaller
    fontWeight: '600', // Bolder
    color: '#444',
    marginBottom: 3,
  },
  itemPrice: {
    color: '#555',
    fontSize: 15,
    fontWeight: '500',
  },
  wishlistActions: {
    flexDirection: 'row',
    // gap: 15, // Use margin on buttons if gap not supported
  },
  actionButton: {
    padding: 8, // Make touchable area larger
    marginLeft: 8, // Spacing between buttons
  }
});

export default WishlistScreen;