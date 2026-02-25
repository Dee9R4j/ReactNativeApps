import React from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomToastProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({
  visible,
  message,
  onClose,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.toast}>
          <Text style={styles.message}>{message}</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  message: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  closeButton: {
    padding: 5,
  },
});

export default CustomToast;
