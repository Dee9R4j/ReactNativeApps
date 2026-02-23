
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Exercise } from '../types/global';
import { useWorkout } from '../context/WorkoutContext';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
}

export default function ExerciseCard({ exercise, onPress }: ExerciseCardProps) {
  const { toggleFavorite, favoriteExercises } = useWorkout();
  const isFavorite = favoriteExercises.some(e => e.id === exercise.id);

  return (
    <View className="bg-card p-4 rounded-lg mb-4 shadow-sm mx-1">
      <View className="flex-row items-center">
        {/* Image Container */}
        <View className="w-16 h-16 rounded-lg mr-4 overflow-hidden">
          <Image 
            source={exercise.photo}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity 
              onPress={onPress}
              className="flex-1 pr-2"
              activeOpacity={0.7}
            >
              <Text className="text-lg font-bold text-text">{exercise.name}</Text>
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-600 capitalize">{exercise.muscle}</Text>
                <Text className="text-gray-500 capitalize">
                  {exercise.difficulty}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleFavorite(exercise)}
              className="p-2"
              activeOpacity={0.7}
            >
              <FontAwesome 
                name={isFavorite ? "heart" : "heart-o"} 
                size={24} 
                color={isFavorite ? "#ef4444" : "#64748B"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}