import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useWorkout } from '../context/WorkoutContext';
import { RootStackScreenProps } from '../types/navigationTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import { Difficulty } from '../types/global'; // Import Difficulty type

export default function ExerciseDetailScreen({ route, navigation }: RootStackScreenProps<'ExerciseDetail'>) {
  const { exerciseName } = route.params;
  const { 
    allExercises, 
    activeWorkout, 
    startWorkout, 
    caloriesBurned,
    isTimerRunning,
    startTimer,
    pauseTimer,
    favoriteExercises,
    toggleFavorite
  } = useWorkout();
  
  const exercise = allExercises.find(ex => ex.name === exerciseName);

  if (!exercise) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-text text-lg">Exercise not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isFavorite = favoriteExercises.some(e => e.id === exercise.id);

  const difficultyColors: Record<Difficulty, string> = {
    easy: 'text-green-500',
    beginner: 'text-green-500',
    intermediate: 'text-yellow-500',
    advanced: 'text-red-500',
  };

  const info = [
    { label: 'Muscle', value: exercise.muscle },
    { label: 'Type', value: exercise.type },
    { label: 'Difficulty', value: exercise.difficulty, color: difficultyColors[exercise.difficulty] },
    { label: 'Equipment', value: exercise.equipment },
  ];

  const handleStartWorkout = () => {
    if (exercise) {
      startWorkout({
        id: `quick-${Date.now()}`,
        name: `${exercise.name} Workout`,
        exercises: [exercise]
      });
      navigation.navigate('MainTabs');
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="bg-card p-6 rounded-lg shadow-sm">
            <View className="mb-4 rounded-lg overflow-hidden aspect-video">
              <Video
                source={exercise.video}
                style={{ width: '100%', height: '100%' }}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                isMuted
                useNativeControls={false}
              />
            </View>

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-text">{exercise.name}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(exercise)}>
                <FontAwesome 
                  name={isFavorite ? "heart" : "heart-o"} 
                  size={24} 
                  color={isFavorite ? "#ef4444" : "#64748B"} 
                />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              {info.map((item, index) => (
                <Text key={index} className="text-base text-gray-600 mb-1">
                  <Text className="font-semibold text-primary">{item.label}: </Text>
                  <Text className={`capitalize ${item.color || ''}`}>{item.value}</Text>
                </Text>
              ))}
            </View>

            {exercise.instructions && (
              <View className="mt-4 bg-gray-100 p-4 rounded-lg">
                <Text className="text-lg font-bold text-text mb-2">Instructions</Text>
                <Text className="text-base text-gray-600 leading-6">{exercise.instructions}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={activeWorkout ? () => navigation.navigate('MainTabs') : handleStartWorkout}
              className="bg-primary py-3 rounded-lg mt-6 w-full"
              activeOpacity={0.7}
            >
              <Text className="text-white text-center font-bold text-lg">
                {activeWorkout ? 'Return to Workout' : 'Start Workout'}
              </Text>
            </TouchableOpacity>

            {activeWorkout && (
              <View className="mt-4 flex-row justify-center space-x-4">
                <TouchableOpacity
                  onPress={isTimerRunning ? pauseTimer : startTimer}
                  className="bg-secondary py-2 px-4 rounded-lg"
                >
                  <Text className="text-white font-semibold">
                    {isTimerRunning ? 'Pause' : 'Resume'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}