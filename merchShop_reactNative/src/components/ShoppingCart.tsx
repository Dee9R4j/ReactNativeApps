// ShoppingCart.tsx
import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useShop } from '../context/ShopContext';
import OrderForm from './OrderForm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ShoppingCartScreen: React.FC = () => {
  const { state, dispatch } = useShop();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const insets = useSafeAreaInsets();

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({
      type: 'UPDATE_CART_QUANTITY',
      payload: { id, quantity: Math.max(1, quantity) },
    });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const subtotal = state.cart.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const shipping = state.cart.length > 0 ? 60 : 0;
  const total = subtotal + tax + shipping;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {showOrderForm && (
        <OrderForm onClose={() => setShowOrderForm(false)} cartItems={state.cart} />
      )}
      <View style={styles.header}>
        <Text style={styles.headerText}>Shopping Cart</Text>
      </View>
      <ScrollView>
        {state.cart.map((item: any) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={item.photo1} style={styles.cartItemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
              <TextInput
                value={item.quantity.toString()}
                onChangeText={(text) => updateQuantity(item.id, parseInt(text) || 1)}
                keyboardType="numeric"
                style={styles.quantityInput}
              />
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.totalcal}>
        <View style={styles.cartTotals}>
          <Text>Subtotal: ₹{subtotal.toFixed(2)}</Text>
          <Text>Tax (18%): ₹{tax.toFixed(2)}</Text>
          <Text>Shipping: ₹{shipping.toFixed(2)}</Text>
          <Text style={styles.cartTotal}>Total: ₹{total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => setShowOrderForm(true)}
          disabled={state.cart.length === 0}
        >
          <Text style={styles.btnText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  quantityInput: {
    width: 50,
    textAlign: 'center',
    marginRight: 20,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  totalcal: {
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 3,
    borderTopColor: 'black',
  },
  cartTotals: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  cartTotal: {
    fontSize: 20,
  },
  checkoutButton: {
    backgroundColor: 'green',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ShoppingCartScreen;