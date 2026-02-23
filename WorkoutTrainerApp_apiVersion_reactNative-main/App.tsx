import 'react-native-url-polyfill/auto'; 
import 'react-native-gesture-handler'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View } from 'react-native';
import { WorkoutProvider } from './src/context/WorkoutContext';
import AppNavigator from './src/navigation/AppNavigator';
import MetricsForm from './src/components/MetricsForm';
import NetworkProvider from '@/components/NetworkProvider';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SafeAreaProvider>
          <WorkoutProvider>
            <StatusBar 
              translucent
              backgroundColor="transparent"
              barStyle="light-content"
            />
            <NetworkProvider>
              <NavigationContainer>
                <AppNavigator />
                <MetricsForm />
              </NavigationContainer>
            </NetworkProvider>
          </WorkoutProvider>
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);