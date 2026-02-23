
import { NativeStackScreenProps } from '@react-navigation/native-stack';


export type NavigationParamList = {

  Dashboard: undefined;
  Profile: undefined;
  History: undefined;
  

  MainTabs: undefined;
  ExerciseDetail: { 
    exerciseName: string;
  };
};


export type RootStackScreenProps<T extends keyof NavigationParamList> = 
  NativeStackScreenProps<NavigationParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends NavigationParamList {}
  }
}


export type DashboardScreenProps = RootStackScreenProps<'Dashboard'>;
export type ProfileScreenProps = RootStackScreenProps<'Profile'>;
export type HistoryScreenProps = RootStackScreenProps<'History'>;
export type ExerciseDetailScreenProps = RootStackScreenProps<'ExerciseDetail'>;