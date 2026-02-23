import { View, FlatList, Text } from 'react-native';
import { useWorkout } from '../context/WorkoutContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExerciseCard from '../components/ExerciseCard';
import { RootStackScreenProps } from '../types/navigationTypes';

type Props = RootStackScreenProps<'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { favoriteExercises } = useWorkout();

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background">
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-text mb-4">Favorite Exercises</Text>
        <FlatList
          data={favoriteExercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              onPress={() => navigation.navigate('ExerciseDetail', { 
                exerciseName: item.name 
              })}
            />
          )}
          contentContainerStyle={{
            paddingBottom: 80,
            flexGrow: 1
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-gray-500 text-center">
                Tap the heart icon on exercises{'\n'}to add them to favorites
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}