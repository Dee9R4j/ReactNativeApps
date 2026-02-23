// Orders.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useShop } from "../context/ShopContext";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "../types/navigation";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { state, dispatch } = useShop();
  const insets = useSafeAreaInsets();

  const handleDeleteOrder = (orderId: number) => {
    dispatch({ type: "REMOVE_ORDER", payload: orderId });
  };

  return (
    <View style={[styles.container, { 
      paddingTop: insets.top + 20,
      paddingBottom: insets.bottom,
      paddingHorizontal: 16 
    }]}>
      <Text style={styles.header}>Order History</Text>
      <ScrollView>
        {state.orders.length === 0 ? (
          <Text style={styles.emptyMessage}>No orders found.</Text>
        ) : (
          state.orders.map((order: any, index: number) => (
            <View key={order.id || index} style={styles.orderItem}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderTitle}>Order #{index + 1}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteOrder(order.id)}>
                  <Icon name="delete" size={20} color="#d32f2f" />
                </TouchableOpacity>
              </View>
              <View style={styles.customerInfo}>
                <Text>
                  <Text style={styles.bold}>Name:</Text> {order.name}
                </Text>
                <Text>
                  <Text style={styles.bold}>Email:</Text> {order.email}
                </Text>
                <Text>
                  <Text style={styles.bold}>Address:</Text> {order.address}
                </Text>
              </View>
              <Text style={styles.itemsHeading}>Items Purchased:</Text>
              {order.items.map((item: any, i: number) => (
                <View key={i} style={styles.orderProduct}>
                  <Image source={item.photo1} style={styles.orderImage} />
                  <View>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productMeta}>
                      Qty: {item.quantity} | ₹{item.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxWidth: 800,
    alignSelf: "center",
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#666",
    padding: 40,
    fontSize: 16,
  },
  orderItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  orderTitle: {
    color: "#2c3e50",
    fontSize: 18,
    fontWeight: "bold",
  },
  orderDate: {
    color: "#7f8c8d",
    fontSize: 14,
  },
  customerInfo: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  itemsHeading: {
    color: "#2c3e50",
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#ecf0f1",
    paddingBottom: 10,
  },
  orderProduct: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  orderImage: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 6,
  },
  productName: {
    fontWeight: "500",
    color: "#2c3e50",
    marginBottom: 5,
  },
  productMeta: {
    color: "#7f8c8d",
    fontSize: 14,
  },
});

export default OrdersScreen;