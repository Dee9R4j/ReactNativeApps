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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useShop } from '../context/ShopContext';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../types/navigation';

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
  const navigation = useNavigation<RootNavigationProp>();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.address) {
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
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: cartItems,
          total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          date: new Date().toISOString(),
        }),
      });

      dispatch({
        type: 'ADD_ORDER',
        payload: {
          ...formData,
          items: cartItems,
          date: new Date().toISOString(),
          id: Date.now(),
          total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        },
      });
      dispatch({ type: 'CLEAR_CART' });
      setShowSuccess(true);
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
    navigation.navigate('Orders');
  };

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        {showSuccess ? (
          <View style={styles.successModal}>
            <Icon name="check-circle" size={48} color="#4CAF50" />
            <Text style={styles.successTitle}>Order Placed Successfully!</Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleSuccessClose}
            >
              <Text style={styles.buttonText}>View Orders</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Icon name="arrow-back" size={35} color="#666" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Checkout Details</Text>
            </View>

            <ScrollView contentContainerStyle={styles.formContainer}>
              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="highlight-off" size={24} color="#ff4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
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
                  placeholderTextColor="#999"
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Confirm & Place Order</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: 600,
    maxHeight: '90%',
    borderRadius: 12,
    padding: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    marginLeft: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    paddingBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: '#444',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff4444',
    marginLeft: 8,
  },
  submitButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#3498db',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  successModal: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
  },
  successTitle: {
    color: '#2ecc71',
    fontSize: 24,
    marginVertical: 10,
  },
  successButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
  },
});

export default OrderForm;