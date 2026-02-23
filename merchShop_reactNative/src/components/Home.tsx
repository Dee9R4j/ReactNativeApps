// Home.tsx
import React from 'react';
import { View, FlatList } from 'react-native';
import Navbar from './Navbar';
import Carousel from './Carousel';
import CardContainer from './CardContainer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ 
      flex: 1,
    }}>
      <Navbar />
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
        ListHeaderComponentStyle={{ flex: 1 }}
      />
    </View>
  );
};

export default HomeScreen;