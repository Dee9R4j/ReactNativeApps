import { View, FlatList, Text, TouchableOpacity, RefreshControl } from "react-native";
import { useWorkout } from "../context/WorkoutContext";
import { RootStackScreenProps } from "../types/navigationTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import ExerciseCard from "../components/ExerciseCard";
import WorkoutTimer from "../components/WorkoutTimer";
import { useCallback, useState } from "react";

type Props = RootStackScreenProps<"Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  const { allExercises, userMetrics, dailyCalories, refreshExercises } = useWorkout();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError('');
      await refreshExercises();
       if (allExercises.length === 0) {
       setError('No exercises available - try again later');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <FlatList
        data={allExercises}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View className="p-4">
            <WorkoutTimer />

            <View className="bg-card p-4 rounded-lg mb-4 border-2 border-dashed border-gray-200 min-h-[140px]">
              <Text className="text-lg font-semibold text-gray-600">
                Today's Summary
              </Text>
              {error ? (
                <View className="flex-1 items-center justify-center mt-2">
                  <Text className="text-red-500 text-sm mb-2">{error}</Text>
                  <TouchableOpacity
                    onPress={handleRefresh}
                    className="bg-primary px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white">Try Again</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="flex-1 items-center justify-center mt-2">
                  <Text className="text-4xl font-bold text-primary">
                    {dailyCalories}
                  </Text>
                  <Text className="text-gray-500 mt-1">
                    calories burned today
                  </Text>
                  {!userMetrics?.weight && (
                    <Text className="text-red-500 text-sm mt-2 text-center">
                      Set your weight in Profile for accurate calculations
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-4">
            <ExerciseCard
              exercise={item}
              onPress={() =>
                navigation.navigate("ExerciseDetail", {
                  exercise: item,
                })
              }
            />
          </View>
        )}
        ListFooterComponent={<View className="pb-20" />}
        ListEmptyComponent={
          <View className="flex-1 justify-center p-4">
            <Text className="text-center text-gray-500">
              {error || 'No exercises found'}
            </Text>
          </View>
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor={'#3B82F6'}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}