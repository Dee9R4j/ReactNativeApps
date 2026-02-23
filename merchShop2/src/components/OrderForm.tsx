// OrderForm.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useShop } from '../context/ShopContext'; // Adjust path
import { useRouter } from 'expo-router'; // Use expo-router
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface OrderFormProps {
  onClose: () => void;
  cartItems: any[];
}

const OrderForm: React.FC<OrderFormProps> = ({ onClose, cartItems }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { dispatch } = useShop();
  const router = useRouter(); // Use expo-router

  // Animation for modal content
  const formOpacity = useSharedValue(0);
  const formScale = useSharedValue(0.95);

  React.useEffect(() => {
    formOpacity.value = withTiming(1, { duration: 300 });
    formScale.value = withTiming(1, { duration: 300 });
  }, []);

  const animatedFormStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ scale: formScale.value }],
    };
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.address.trim()) {
      setError('All fields are required');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      // await fetch('https://jsonplaceholder.typicode.com/posts', { // Keep for actual use
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ...formData,
      //     items: cartItems,
      //     total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      //     date: new Date().toISOString(),
      //   }),
      // });

      dispatch({
        type: 'ADD_ORDER',
        payload: {
          ...formData,
          items: cartItems,
          date: new Date().toISOString(),
          id: Date.now(), // Simple ID generation
          total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        },
      });
      dispatch({ type: 'CLEAR_CART' });
      setShowSuccess(true);
    } catch (err) {
      console.error("Order submission error:", err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose(); // Close this modal
    router.push('/orders'); // Navigate to orders screen using expo-router
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        {showSuccess ? (
          <Animated.View style={[styles.successModal, animatedFormStyle]}>
            <Icon name="check-circle" size={60} color="#4CAF50" style={{marginBottom: 15}}/>
            <Text style={styles.successTitle}>Order Placed!</Text>
            <Text style={styles.successMessage}>Your items are on their way.</Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleSuccessClose}
            >
              <Text style={styles.buttonText}>View My Orders</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View style={[styles.content, animatedFormStyle]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                <Icon name="close" size={28} color="#555" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Checkout Details</Text>
            </View>

            <ScrollView 
                contentContainerStyle={styles.formContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="error-outline" size={22} color="#D32F2F" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#aaa"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#aaa"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Shipping Address</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Enter complete shipping address"
                  placeholderTextColor="#aaa"
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  multiline
                  numberOfLines={3} // Adjusted
                />
              </View>

              <TouchableOpacity 
                style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Confirm & Place Order</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%', // Ensure it fits on screen
    borderRadius: 15,
    padding: 20, // Consistent padding
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center title
    marginBottom: 20,
    position: 'relative', // For absolute positioning of close icon
  },
  closeIcon: {
    position: 'absolute',
    left: 0, // Position close icon to the left
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    paddingBottom: 20, // Space for scroll
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    marginBottom: 8,
    color: '#555', // Darker label
    fontWeight: '500',
    fontSize: 14,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9', // Slight background for input
  },
  textarea: {
    minHeight: 80, // Min height for address
    textAlignVertical: 'top',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE', // Softer red
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: '#D32F2F', // Darker red text
    marginLeft: 10,
    fontSize: 14,
  },
  submitButton: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#3498db',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10, // Adjusted margin
  },
  submitButtonDisabled: {
    backgroundColor: '#a9d6f5', // Lighter color when disabled
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  successModal: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: '85%',
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  successTitle: {
    color: '#4CAF50',
    fontSize: 22, // Slightly smaller
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
  },
  successButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25, // Pill shape
  },
});

export default OrderForm;