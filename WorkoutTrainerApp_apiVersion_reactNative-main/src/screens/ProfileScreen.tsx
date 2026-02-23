import { View, FlatList, Text } from 'react-native';
import { useWorkout } from '../context/WorkoutContext';
import { RootStackScreenProps } from '../types/navigationTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExerciseCard from '../components/ExerciseCard';

export default function ProfileScreen({ navigation }: RootStackScreenProps<'Profile'>) {
  const { favoriteExercises } = useWorkout();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-text mb-4">Favorites</Text>
        <FlatList
          data={favoriteExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              onPress={() => navigation.navigate('ExerciseDetail', { 
                exercise: item 
              })}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-gray-500 text-center">
                No favorite exercises yet
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}