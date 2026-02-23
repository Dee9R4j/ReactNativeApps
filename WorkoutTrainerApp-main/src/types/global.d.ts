/// <reference types="nativewind/types" />

import { StackParamList } from './navigationTypes';

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.mp4' {
  const value: number;
  export default value;
}

declare module '*.jpg' {
  const value: number;
  export default value;
}

export type Difficulty = 'easy' | 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: number;
  name: string;
  video: number;
  photo: number;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: Difficulty;
  met: number;
  instructions?: string;
  tags?: string[];
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutHistory {
  id: string;
  date: string;
  duration: number;
  calories: number;
  workout: Workout;
}

export interface UserMetrics {
  weight?: number;
  height?: number;
  age?: number;
}

export interface TrackedSet {
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number;
  date: string;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList {}
  }
}

export type NavigationParamList = {
  Dashboard: undefined;
  Profile: undefined;
  History: undefined;
  MainTabs: undefined;
  ExerciseDetail: { 
    exerciseName: string;
  };
};

export type RootStackScreenProps<T extends keyof NavigationParamList> = {
  navigation: NativeStackScreenProps<NavigationParamList, T>['navigation'];
  route: NativeStackScreenProps<NavigationParamList, T>['route'];
};