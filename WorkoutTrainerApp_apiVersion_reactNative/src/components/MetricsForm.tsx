import { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useWorkout } from '../context/WorkoutContext';

export default function MetricsForm() {
  const { userMetrics, updateUserMetrics } = useWorkout();
  const [showForm, setShowForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    const checkMetrics = async () => {
      if (!userMetrics?.weight) {
        setShowForm(true);
      }
    };
    checkMetrics();
  }, [userMetrics]);

  const handleSave = () => {
    if (!weight || !height || !age) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    updateUserMetrics({
      weight: Number(weight),
      height: Number(height),
      age: Number(age)
    });
    setShowForm(false);
  };

  if (!showForm) return null;

  return (
    <Modal 
      visible={showForm} 
      transparent 
      animationType="fade"
      onRequestClose={() => setShowForm(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-card p-6 rounded-lg w-11/12 max-w-sm">
          <Text className="text-2xl font-bold text-text mb-4">Welcome! Let's Get Started</Text>
          
          <View className="space-y-4">
            <View>
              <Text className="text-gray-600 mb-1">Weight (kg)</Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                className="bg-inputBg border border-inputBorder p-3 rounded-lg"
                keyboardType="numeric"
                placeholder="Enter weight"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View>
              <Text className="text-gray-600 mb-1">Height (cm)</Text>
              <TextInput
                value={height}
                onChangeText={setHeight}
                className="bg-inputBg border border-inputBorder p-3 rounded-lg"
                keyboardType="numeric"
                placeholder="Enter height"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View>
              <Text className="text-gray-600 mb-1">Age</Text>
              <TextInput
                value={age}
                onChangeText={setAge}
                className="bg-inputBg border border-inputBorder p-3 rounded-lg"
                keyboardType="numeric"
                placeholder="Enter age"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <TouchableOpacity
              onPress={handleSave}
              className="bg-primary py-3 rounded-lg"
              activeOpacity={0.7}
            >
              <Text className="text-white text-center font-semibold">Save Metrics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}