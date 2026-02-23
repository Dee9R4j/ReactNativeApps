// Wishlist.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useShop } from '../context/ShopContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WishlistScreen: React.FC = () => {
  const { state, dispatch } = useShop();
  const insets = useSafeAreaInsets();

  const moveToCart = (item: any) => {
    dispatch({ type: 'MOVE_TO_CART', payload: item });
  };

  const removeFromWishlist = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.header}>Wishlist</Text>
      <ScrollView>
        {state.wishlist.length === 0 ? (
          <Text style={styles.emptyMessage}>Your wishlist is empty.</Text>
        ) : (
          state.wishlist.map((item: any) => (
            <View key={item.id} style={styles.wishlistItem}>
              <Image source={item.photo1} style={styles.wishlistItemImage} />
              <View style={styles.wishlistItemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.wishlistActions}>
                <TouchableOpacity onPress={() => moveToCart(item)}>
                  <Icon name="shopping-cart" size={20} color="green" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromWishlist(item.id)}>
                  <Icon name="delete" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f4ee',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    padding: 40,
    fontSize: 16,
  },
  wishlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  wishlistItemImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  wishlistItemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    color: '#555',
  },
  wishlistActions: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default WishlistScreen;