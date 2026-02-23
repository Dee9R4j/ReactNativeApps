import { View, FlatList, Text } from 'react-native';
import { useWorkout } from '../context/WorkoutContext';
import { RootStackScreenProps } from '../types/navigationTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExerciseCard from '../components/ExerciseCard';
import WorkoutTimer from '../components/WorkoutTimer';
import { useCallback, useState } from 'react';

type Props = RootStackScreenProps<'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const { allExercises, userMetrics, dailyCalories } = useWorkout();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background">
      <FlatList
        data={allExercises}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View className="p-4">
            <WorkoutTimer />

            <View className="bg-card p-4 rounded-lg mb-4 border-2 border-dashed border-gray-200 min-h-[140px]">
              <Text className="text-lg font-semibold text-gray-600">Today's Summary</Text>
              <View className="flex-1 items-center justify-center mt-2">
                <Text className="text-4xl font-bold text-primary">
                  {dailyCalories}
                </Text>
                <Text className="text-gray-500 mt-1">calories burned today</Text>
                {!userMetrics?.weight && (
                  <Text className="text-red-500 text-sm mt-2 text-center">
                    Set your weight in Profile for accurate calculations
                  </Text>
                )}
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-4">
            <ExerciseCard 
              exercise={item} 
              onPress={() => navigation.navigate('ExerciseDetail', { 
                exerciseName: item.name 
              })}
            />
          </View>
        )}
        ListFooterComponent={<View className="pb-20" />}
        ListEmptyComponent={
          <View className="flex-1 justify-center p-4">
            <Text className="text-center text-gray-500">
              No exercises found
            </Text>
          </View>
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20
        }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
}