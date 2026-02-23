import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useWorkout } from '../context/WorkoutContext';
import { Exercise } from '@/utils/ExerciseData';

export default function ExerciseTracker({ exercise }: { exercise: Exercise }) {
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);
  const { trackSet } = useWorkout();

  const handleTrack = () => {
    trackSet({
      exerciseId: exercise.id,
      sets,
      reps,
      weight,
      date: new Date().toISOString()
    });
    // Reset after tracking
    setSets(0);
    setReps(0);
    setWeight(0);
  };

  return (
    <View className="bg-card p-4 rounded-lg mb-4">
      <Text className="text-lg font-bold text-text mb-4">
        Track Your Performance
      </Text>

      <View className="flex-row justify-between mb-4">
        <Counter label="Sets" value={sets} onChange={setSets} />
        <Counter label="Reps" value={reps} onChange={setReps} />
        <Counter label="Kg" value={weight} onChange={setWeight} />
      </View>

      <TouchableOpacity
        onPress={handleTrack}
        className="bg-primary py-2 rounded"
      >
        <Text className="text-white text-center font-semibold">Log Set</Text>
      </TouchableOpacity>
    </View>
  );
}

function Counter({ label, value, onChange }: { 
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <View className="items-center">
      <Text className="text-gray-600 mb-1">{label}</Text>
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => onChange(Math.max(0, value - 1))}>
          <FontAwesome name="minus-circle" size={24} color="#64748B" />
        </TouchableOpacity>
        <Text className="mx-2 text-lg font-bold">{value}</Text>
        <TouchableOpacity onPress={() => onChange(value + 1)}>
          <FontAwesome name="plus-circle" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>
    </View>
  );
}