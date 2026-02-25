import React from "react";
import { StyleSheet, View, Text } from "react-native";

interface EmptyListComponentProps {
  title: string;
  message: string;
}

const EmptyListComponent = ({ title, message }: EmptyListComponentProps) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>{title}</Text>
    <Text style={styles.emptySubText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  emptySubText: {
    fontSize: 16,
    color: "#a0a0a0",
    marginTop: 8,
    textAlign: "center",
  },
});

export default EmptyListComponent;
