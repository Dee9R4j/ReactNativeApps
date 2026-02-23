// Home.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Carousel from './Carousel';
import CardContainer from './CardContainer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.outerContainer}>
      <FlatList
        data={[]} 
        renderItem={null}
        ListHeaderComponent={
          <>
            <Carousel />
            <CardContainer />
          </>
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ 
          paddingTop: insets.top + 60, // Header height
          paddingBottom: insets.bottom + 60, // Tab bar height
        }}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#f5f4ee', // Background for the whole screen
    },
    flatList: {
        flex: 1,
    }
});

export default HomeScreen;