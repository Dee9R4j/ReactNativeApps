import { Exercise, Difficulty } from '../types/global';
import Constants from 'expo-constants';

const API_URL = 'https://api.api-ninjas.com/v1/exercises';
const API_KEY = Constants.expoConfig?.extra?.apiKey;

const localVideos = [
  require("../../assets/videos/vid1.mp4"),
  require("../../assets/videos/vid2.mp4"),
  require("../../assets/videos/vid3.mp4"),
  require("../../assets/videos/vid4.mp4"),
  require("../../assets/videos/vid5.mp4"),
  require("../../assets/videos/vid6.mp4"),
  require("../../assets/videos/vid7.mp4"),
  require("../../assets/videos/vid8.mp4"),
  require("../../assets/videos/vid9.mp4"),
  require("../../assets/videos/vid10.mp4"),
];

const localPhotos = [
  require('../../assets/photos/ph1.jpg'),
  require("../../assets/photos/ph2.jpg"),
  require("../../assets/photos/ph3.jpg"),
  require("../../assets/photos/ph4.jpg"),
  require("../../assets/photos/ph5.jpg"),
  require("../../assets/photos/ph6.jpg"),
  require("../../assets/photos/ph7.jpg"),
  require("../../assets/photos/ph8.jpg"),
  require("../../assets/photos/ph9.jpg"),
  require("../../assets/photos/ph10.jpg"),
];

export const fetchExercises = async (): Promise<Exercise[]> => {
  try {
    if (!API_KEY) {
      throw new Error('API key missing - please configure environment variables');
    }

    const response = await fetch(API_URL, {
      headers: { 
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Error ${response.status}: ${errorBody}`);
      throw new Error('Failed to fetch exercises');
    }
    
    const data = await response.json();
    
    return data.map((ex: any, index: number) => {
      const assetIndex = index % Math.min(localVideos.length, localPhotos.length);
      
      return {
        id: `${ex.name}-${Date.now()}-${index}`,
        name: ex.name,
        type: ex.type,
        muscle: ex.muscle,
        equipment: ex.equipment || 'bodyweight',
        difficulty: (ex.difficulty?.toLowerCase() as Difficulty) || 'beginner',
        video: localVideos[assetIndex],
        photo: localPhotos[assetIndex],
        met: calculateMET(ex.difficulty),
        instructions: ex.instructions || 'No instructions available'
      };
    });
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw new Error('Failed to load exercises. Please check your internet connection.');
  }
};

const calculateMET = (difficulty: string): number => {
  const metMap: Record<Difficulty, number> = {
    beginner: 3.5,
    intermediate: 5.0,
    advanced: 7.0
  };
  return metMap[difficulty.toLowerCase() as Difficulty] || 4.0;
};