import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useWorkout } from '../context/WorkoutContext';

export default function WorkoutTimer() {
  const {
    activeWorkout,
    activeDuration,
    caloriesBurned,
    isTimerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    completeWorkout,
    userMetrics
  } = useWorkout();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!activeWorkout) return null;

  return (
    <View className="bg-primary p-4 rounded-b-lg shadow-lg">
      <View className="flex-col items-center mb-4">
        <Text className="text-white text-lg font-semibold text-center">
          {activeWorkout.name}
        </Text>
        <View className="border-2 border-white p-2 rounded-lg mt-2">
          <Text className="text-white text-4xl font-bold">
            {formatTime(activeDuration)}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row space-x-4">
          <TouchableOpacity
            onPress={isTimerRunning ? pauseTimer : startTimer}
            className="bg-white/20 p-3 rounded-full"
            activeOpacity={0.7}
          >
            <FontAwesome
              name={isTimerRunning ? "pause" : "play"}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={resetTimer}
            className="bg-white/20 p-3 rounded-full"
            activeOpacity={0.7}
          >
            <FontAwesome name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="items-end">
          <Text className="text-white text-sm">
            Calories: {caloriesBurned}
          </Text>
          {!userMetrics?.weight && (
            <Text className="text-yellow-300 text-xs mt-1">
              Weight not set - estimates may be inaccurate
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={completeWorkout}
        className="bg-red-500 py-2 px-4 rounded-full flex-row items-center self-center"
        activeOpacity={0.7}
      >
        <FontAwesome name="check" size={16} color="white" />
        <Text className="text-white font-semibold ml-2">Finish Workout</Text>
      </TouchableOpacity>
    </View>
  );
}