// ShoppingCart.tsx
import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useShop } from '../context/ShopContext'; // Adjust path
import OrderForm from './OrderForm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated'; // For item animations

const AnimatedView = Animated.createAnimatedComponent(View);

const ShoppingCartScreen: React.FC = () => {
  const { state, dispatch } = useShop();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const insets = useSafeAreaInsets();

  const updateQuantity = (id: number, quantityText: string) => {
    const quantity = parseInt(quantityText);
    if (isNaN(quantity) || quantity < 1) {
      // Optionally show an alert or handle invalid input
      // For simplicity, we'll just ensure it's at least 1 or remove if empty
      dispatch({
        type: 'UPDATE_CART_QUANTITY',
        payload: { id, quantity: 1 }, // Default to 1 if input is bad
      });
      return;
    }
    dispatch({
      type: 'UPDATE_CART_QUANTITY',
      payload: { id, quantity: Math.max(1, quantity) },
    });
  };

  const removeItem = (id: number, name: string) => {
    Alert.alert(
        "Remove Item",
        `Are you sure you want to remove ${name} from your cart?`,
        [
            {text: "Cancel", style: "cancel"},
            {text: "Remove", style: "destructive", onPress: () => dispatch({ type: 'REMOVE_FROM_CART', payload: id })}
        ]
    )
  };

  const subtotal = state.cart.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const taxRate = 0.18; // 18%
  const tax = subtotal * taxRate;
  const shipping = state.cart.length > 0 ? 60 : 0; // Example shipping cost
  const total = subtotal + tax + shipping;

  return (
    <View style={[styles.outerContainer, { 
        paddingTop: insets.top + 70, // Header height (60) + buffer (10)
        // paddingBottom: insets.bottom // Bottom is handled by totals container
    }]}>
      {showOrderForm && (
        <OrderForm onClose={() => setShowOrderForm(false)} cartItems={state.cart} />
      )}
      {/* Header text is now part of Tabs Navigator options */}
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Shopping Cart</Text>
      </View> */}
      
      {state.cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
            <Icon name="remove-shopping-cart" size={100} color="#ccc" />
            <Text style={styles.emptyCartText}>Your Cart is Empty</Text>
            <Text style={styles.emptyCartSubText}>Looks like you haven't added anything yet!</Text>
        </View>
      ) : (
        <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={{paddingBottom: 20}} // Space for last item
            showsVerticalScrollIndicator={false}
        >
          {state.cart.map((item: any) => (
            <AnimatedView 
                key={item.id} 
                style={styles.cartItem}
                entering={FadeIn.duration(300)}
                layout={Layout.springify()} // Animate layout changes (e.g., when item is removed)
                exiting={FadeOut.duration(200)}
            >
              <Image source={item.photo1} style={styles.cartItemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, (item.quantity - 1).toString())} style={styles.quantityButton} disabled={item.quantity <=1}>
                        <Icon name="remove-circle-outline" size={22} color={item.quantity <=1 ? "#ccc" : "#555"} />
                    </TouchableOpacity>
                    <TextInput
                        value={item.quantity.toString()}
                        onChangeText={(text) => updateQuantity(item.id, text)}
                        keyboardType="number-pad" // Better for numbers
                        style={styles.quantityInput}
                        maxLength={2} // Limit quantity digits
                    />
                    <TouchableOpacity onPress={() => updateQuantity(item.id, (item.quantity + 1).toString())} style={styles.quantityButton}>
                        <Icon name="add-circle-outline" size={22} color="#555" />
                    </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id, item.name)} style={styles.deleteIcon}>
                <Icon name="delete-outline" size={24} color="#e74c3c" />
              </TouchableOpacity>
            </AnimatedView>
          ))}
        </ScrollView>
      )}

      {state.cart.length > 0 && (
        <View style={[styles.totalCalContainer, {paddingBottom: insets.bottom + 10}]}>
          <View style={styles.cartTotals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({ (taxRate * 100).toFixed(0) }%):</Text>
              <Text style={styles.totalValue}>₹{tax.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping:</Text>
              <Text style={styles.totalValue}>₹{shipping.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={[styles.totalLabel, styles.grandTotalLabel]}>Total:</Text>
              <Text style={[styles.totalValue, styles.grandTotalValue]}>₹{total.toFixed(2)}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.checkoutButton, state.cart.length === 0 && styles.checkoutButtonDisabled]}
            onPress={() => setShowOrderForm(true)}
            disabled={state.cart.length === 0}
          >
            <Text style={styles.btnText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f5f4ee', // Consistent background
    paddingHorizontal: 15, // Horizontal padding for the screen content
  },
  // header: { // Removed, handled by Tabs navigator
  //   marginBottom: 15,
  // },
  // headerText: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   color: '#333',
  // },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50, // Offset from bottom
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#777',
    marginTop: 20,
  },
  emptyCartSubText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
  },
  scrollView: {
    flex: 1, // Allows scroll view to take available space
    // backgroundColor: 'pink', // For debugging layout
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff', // White background for items
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  cartItemImage: {
    width: 70, // Slightly smaller
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600', // Bolder
    color: '#444',
    marginBottom: 4,
  },
  itemPrice: {
    fontWeight: 'bold',
    color: '#27ae60', // Consistent green
    fontSize: 15,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 5, // Easier to tap
  },
  quantityInput: {
    width: 40, // Narrower
    textAlign: 'center',
    height: 30, // Shorter
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginHorizontal: 8,
    paddingVertical: 0, // Remove default padding
    fontSize: 15,
    color: '#333',
  },
  deleteIcon: {
    padding: 8, // Make touchable area larger
  },
  totalCalContainer: {
    paddingTop: 15,
    backgroundColor: '#ffffff', // White background for totals
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginHorizontal: -15, // Extend to screen edges
    paddingHorizontal: 15, // Inner padding
  },
  cartTotals: {
    marginBottom: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 15,
    color: '#555',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    marginTop: 5,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  checkoutButton: {
    backgroundColor: '#27ae60', // Green color
    paddingVertical: 14, // Slightly taller
    alignItems: 'center',
    borderRadius: 8,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#a8d8b8', // Lighter green when disabled
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShoppingCartScreen;