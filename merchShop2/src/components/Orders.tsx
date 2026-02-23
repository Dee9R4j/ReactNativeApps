// Orders.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert, // For delete confirmation
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useShop } from "../context/ShopContext"; // Adjust path
// Removed useNavigation and RootNavigationProp as this screen is now a route
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OrdersScreen: React.FC = () => {
  const { state, dispatch } = useShop();
  const insets = useSafeAreaInsets();

  const handleDeleteOrder = (orderId: number, orderIndex: number) => {
    Alert.alert(
        "Delete Order",
        `Are you sure you want to delete Order #${orderIndex + 1}? This action cannot be undone.`,
        [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Delete", 
                style: "destructive", 
                onPress: () => dispatch({ type: "REMOVE_ORDER", payload: orderId }) 
            }
        ]
    );
  };

  return (
    <View style={[styles.outerContainer, { 
      // paddingTop: insets.top, // Header is now handled by expo-router modal presentation
      paddingBottom: insets.bottom,
    }]}>
      <ScrollView 
        contentContainerStyle={[styles.container, {paddingTop: 20, paddingHorizontal: 16}]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header text is now part of Stack.Screen options in app/_layout.tsx */}
        {/* <Text style={styles.header}>Order History</Text> */} 
        {state.orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="receipt-long" size={80} color="#ccc" />
            <Text style={styles.emptyMessage}>No orders found.</Text>
            <Text style={styles.emptySubMessage}>Your past orders will appear here.</Text>
          </View>
        ) : (
          state.orders.slice().reverse().map((order: any, index: number) => { // .slice().reverse() to show newest first
            const originalIndex = state.orders.length - 1 - index; // For consistent numbering if needed
            return (
            <View key={order.id || originalIndex} style={styles.orderItem}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderTitle}>Order #{originalIndex + 1}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.date).toLocaleDateString("en-IN", { // Consider locale
                      // weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteOrder(order.id, originalIndex)} style={styles.deleteButton}>
                  <Icon name="delete-outline" size={24} color="#d32f2f" />
                </TouchableOpacity>
              </View>

              <View style={styles.customerInfo}>
                <Text style={styles.infoText}><Text style={styles.bold}>Name:</Text> {order.name}</Text>
                <Text style={styles.infoText}><Text style={styles.bold}>Email:</Text> {order.email}</Text>
                <Text style={styles.infoText}><Text style={styles.bold}>Address:</Text> {order.address}</Text>
                <Text style={[styles.infoText, styles.totalAmount]}><Text style={styles.bold}>Total:</Text> ₹{order.total?.toFixed(2) || 'N/A'}</Text>
              </View>

              <Text style={styles.itemsHeading}>Items ({order.items.length}):</Text>
              {order.items.map((item: any, i: number) => (
                <View key={i} style={styles.orderProduct}>
                  <Image source={item.photo1} style={styles.orderImage} />
                  <View style={styles.productDetails}>
                    <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.productMeta}>
                      Qty: {item.quantity}
                    </Text>
                     <Text style={styles.productPrice}>₹{item.price.toFixed(2)} each</Text>
                  </View>
                  <Text style={styles.productLineTotal}>₹{(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </View>
          )})
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f5f4ee', // Background for the entire screen
  },
  container: {
    // padding: 20, // Moved to contentContainerStyle
    // maxWidth: 800, // Not really needed for mobile
    // alignSelf: "center", // Not really needed for mobile
  },
//   header: { // Handled by Stack Navigator
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: '#333',
//   },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80, // More padding
  },
  emptyMessage: {
    textAlign: "center",
    color: "#888", // Softer color
    marginTop: 20,
    fontSize: 18,
    fontWeight: '500',
  },
  emptySubMessage: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 8,
    fontSize: 14,
  },
  orderItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 18, // Slightly more padding
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, // Softer shadow
    shadowRadius: 8,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'flex-start',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  orderTitle: {
    color: "#2c3e50",
    fontSize: 18,
    fontWeight: "bold",
  },
  orderDate: {
    color: "#7f8c8d",
    fontSize: 13, // Smaller date
    marginTop: 3,
  },
  deleteButton: {
    padding: 5, // Easier to tap
  },
  customerInfo: {
    // backgroundColor: "#f8f9fa", // Removed background for cleaner look
    paddingVertical: 10,
    // borderRadius: 8,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  bold: {
    fontWeight: "600", // Slightly less bold
    color: '#333',
  },
  totalAmount: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  itemsHeading: {
    color: "#2c3e50",
    marginBottom: 10, // Reduced margin
    fontWeight: '600',
    fontSize: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ecf0f1",
    // paddingBottom: 8,
  },
  orderProduct: {
    flexDirection: "row",
    alignItems: "center",
    // paddingVertical: 10, // Removed vertical padding, rely on spacing
    // backgroundColor: "#fff", // Already on white card
    // borderRadius: 8,
    marginBottom: 12, // Spacing between items
  },
  orderImage: {
    width: 60, // Slightly smaller
    height: 60,
    marginRight: 12,
    borderRadius: 8, // More rounded
    borderWidth: 1,
    borderColor: '#eee',
  },
  productDetails: {
    flex: 1, // Take available space
  },
  productName: {
    fontWeight: "500",
    color: "#333", // Darker product name
    fontSize: 15,
    marginBottom: 3,
  },
  productMeta: {
    color: "#7f8c8d",
    fontSize: 13,
  },
  productPrice: {
    color: "#555",
    fontSize: 13,
    marginTop: 2,
  },
  productLineTotal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  }
});

export default OrdersScreen;