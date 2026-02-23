import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useWorkout } from '../context/WorkoutContext';
import { RootStackScreenProps } from '../types/navigationTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';

type Props = RootStackScreenProps<'History'>;

export default function HistoryScreen({ navigation }: Props) {
  const { workoutHistory, deleteWorkoutHistory, dailyCalories } = useWorkout();

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      onPress={() => deleteWorkoutHistory(id)}
      className="bg-red-500 justify-center px-6"
      activeOpacity={0.7}
    >
      <Text className="text-white font-semibold">Delete</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background">
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-text mb-4">
          Daily Total: {dailyCalories} kcal
        </Text>

        <FlatList
          data={workoutHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => renderRightActions(item.id)}
              overshootRight={false}
            >
              <View className="bg-card p-4 rounded-lg mb-2">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="font-semibold text-lg">{item.workout.name}</Text>
                    <Text className="text-gray-600 text-sm">
                      {new Date(item.date).toLocaleDateString()}
                      {' '}
                      {new Date(item.date).toLocaleTimeString()}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-primary font-semibold">
                      {Math.floor(item.duration / 60)}m {item.duration % 60}s
                    </Text>
                    <Text className="text-primary font-semibold">
                      {item.calories} kcal
                    </Text>
                  </View>
                </View>
              </View>
            </Swipeable>
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-gray-500 text-center">
                No workouts completed yet
              </Text>
            </View>
          }
          contentContainerStyle={{
            paddingBottom: 80,
            flexGrow: 1
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}