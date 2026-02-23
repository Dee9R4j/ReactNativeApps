import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchExercises } from '../utils/api';
import { Exercise, Workout, WorkoutHistory, UserMetrics, TrackedSet, Difficulty } from '../types/global';

interface WorkoutContextType {
  workouts: Workout[];
  favoriteExercises: Exercise[];
  allExercises: Exercise[];
  isDarkMode: boolean;
  activeWorkout: Workout | null;
  activeDuration: number;
  isTimerRunning: boolean;
  workoutHistory: WorkoutHistory[];
  trackedSets: TrackedSet[];
  userMetrics: UserMetrics;
  caloriesBurned: number;
  dailyCalories: number;
  hasCompletedSetup: boolean;
  addExercise: (exercise: Exercise, workoutId: string) => Promise<void>;
  createWorkout: (name: string) => Promise<void>;
  startWorkout: (workout: Workout) => void;
  toggleFavorite: (exercise: Exercise) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  completeWorkout: () => Promise<void>;
  updateUserMetrics: (metrics: UserMetrics) => Promise<void>;
  trackSet: (set: TrackedSet) => Promise<void>;
  markSetupComplete: () => Promise<void>;
  deleteWorkoutHistory: (id: string) => Promise<void>;
  refreshExercises: () => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType>({} as WorkoutContextType);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [favoriteExercises, setFavoriteExercises] = useState<Exercise[]>([]);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [activeDuration, setActiveDuration] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);
  const [trackedSets, setTrackedSets] = useState<TrackedSet[]>([]);
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({});
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadInitialData = async () => {
    try {
      const [
        workoutsData,
        favoritesData,
        historyData,
        setsData,
        metricsData,
        darkModeData,
        setupData
      ] = await Promise.all([
        AsyncStorage.getItem('workouts'),
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('workoutHistory'),
        AsyncStorage.getItem('trackedSets'),
        AsyncStorage.getItem('userMetrics'),
        AsyncStorage.getItem('darkMode'),
        AsyncStorage.getItem('hasCompletedSetup')
      ]);

      try {
        const apiExercises = await fetchExercises();
        console.log('API Exercises loaded:', apiExercises.length);
        setAllExercises(apiExercises);
      } catch (apiError) {
        console.error('API fetch failed:', apiError);

        const localExercises = await AsyncStorage.getItem('allExercises');
        if (localExercises) {
          console.log('Using local exercises');
          setAllExercises(JSON.parse(localExercises));
        }
      }

      if (workoutsData) setWorkouts(JSON.parse(workoutsData));
      if (favoritesData) setFavoriteExercises(JSON.parse(favoritesData));
      if (historyData) setWorkoutHistory(JSON.parse(historyData));
      if (setsData) setTrackedSets(JSON.parse(setsData));
      if (metricsData) setUserMetrics(JSON.parse(metricsData));
      if (darkModeData) setIsDarkMode(JSON.parse(darkModeData));
      if (setupData) setHasCompletedSetup(JSON.parse(setupData));
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const saveData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  const refreshExercises = async () => {
    try {
      const exercises = await fetchExercises();
      setAllExercises(exercises);
      await saveData('allExercises', exercises);
      return Promise.resolve();
    } catch (error) {
      console.error('Error refreshing exercises:', error);
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && activeWorkout) {
      interval = setInterval(() => {
        setActiveDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeWorkout]);

  useEffect(() => {
    const calculateCalories = () => {
      if (!activeWorkout || !userMetrics.weight) {
        setCaloriesBurned(0);
        return;
      }

      const totalMET = activeWorkout.exercises.reduce((sum, ex) => sum + ex.met, 0);
      const averageMET = totalMET / activeWorkout.exercises.length;
      const hours = activeDuration / 3600;
      const calories = averageMET * userMetrics.weight * hours;
      setCaloriesBurned(Math.round(calories));
    };

    calculateCalories();
  }, [activeDuration, activeWorkout, userMetrics.weight]);

  useEffect(() => {
    const calculateDailyCalories = () => {
      const today = new Date().toISOString().split('T')[0];
      const todaysCalories = workoutHistory.reduce((sum, workout) => {
        const workoutDate = workout.date.split('T')[0];
        return workoutDate === today ? sum + workout.calories : sum;
      }, 0);
      setDailyCalories(todaysCalories);
    };

    calculateDailyCalories();
  }, [workoutHistory]);

  useEffect(() => {
    const checkDateChange = () => {
      const today = new Date().toISOString().split('T')[0];
      AsyncStorage.getItem('lastCalorieReset').then((lastDate) => {
        if (lastDate !== today) {
          setDailyCalories(0);
          AsyncStorage.setItem('lastCalorieReset', today);
        }
      });
    };

    const interval = setInterval(checkDateChange, 60000);
    return () => clearInterval(interval);
  }, []);

  const startWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
    setActiveDuration(0);
    setIsTimerRunning(true);
  };

  const completeWorkout = async () => {
    if (!activeWorkout) return;

    const newHistory: WorkoutHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: activeDuration,
      calories: caloriesBurned,
      workout: activeWorkout
    };

    const updatedHistory = [...workoutHistory, newHistory];
    setWorkoutHistory(updatedHistory);
    await saveData('workoutHistory', updatedHistory);

    setActiveWorkout(null);
    setIsTimerRunning(false);
    setActiveDuration(0);
  };

  const deleteWorkoutHistory = async (id: string) => {
    const updatedHistory = workoutHistory.filter(workout => workout.id !== id);
    setWorkoutHistory(updatedHistory);
    await saveData('workoutHistory', updatedHistory);
  };

  const trackSet = async (set: TrackedSet) => {
    const newSet = { ...set, date: new Date().toISOString() };
    const updatedSets = [...trackedSets, newSet];
    setTrackedSets(updatedSets);
    await saveData('trackedSets', updatedSets);
  };

  const toggleFavorite = async (exercise: Exercise) => {
    const newFavorites = favoriteExercises.some(e => e.id === exercise.id)
      ? favoriteExercises.filter(e => e.id !== exercise.id)
      : [...favoriteExercises, exercise];
    
    setFavoriteExercises(newFavorites);
    await saveData('favorites', newFavorites);
  };

  const createWorkout = async (name: string) => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      name,
      exercises: []
    };
    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    await saveData('workouts', updatedWorkouts);
  };

  const addExercise = async (exercise: Exercise, workoutId: string) => {
    const updatedWorkouts = workouts.map(workout => 
      workout.id === workoutId 
        ? { ...workout, exercises: [...workout.exercises, exercise] }
        : workout
    );
    setWorkouts(updatedWorkouts);
    await saveData('workouts', updatedWorkouts);
  };

  const updateUserMetrics = async (metrics: UserMetrics) => {
    const newMetrics = { ...userMetrics, ...metrics };
    setUserMetrics(newMetrics);
    await saveData('userMetrics', newMetrics);
  };

  const markSetupComplete = async () => {
    setHasCompletedSetup(true);
    await saveData('hasCompletedSetup', true);
  };

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await saveData('darkMode', newMode);
  };

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => setActiveDuration(0);

  if (isLoading) {
    return null;
  }

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        favoriteExercises,
        allExercises,
        isDarkMode,
        activeWorkout,
        activeDuration,
        isTimerRunning,
        workoutHistory,
        trackedSets,
        userMetrics,
        caloriesBurned,
        dailyCalories,
        hasCompletedSetup,
        addExercise,
        createWorkout,
        startWorkout,
        toggleFavorite,
        toggleDarkMode,
        startTimer,
        pauseTimer,
        resetTimer,
        completeWorkout,
        updateUserMetrics,
        trackSet,
        markSetupComplete,
        deleteWorkoutHistory,
        refreshExercises
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);