// Carousel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Dimensions, StyleSheet, Platform, FlatList } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth;
const SLIDER_HEIGHT = Platform.OS === 'ios' ? 300 : 280;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// Animated Slide Component
const AnimatedSlide = ({ index, scrollX, imgSource }: {
  index: number;
  scrollX: Animated.SharedValue<number>;
  imgSource: any;
}) => {
  const inputRange = [
    (index - 1) * screenWidth,
    index * screenWidth,
    (index + 1) * screenWidth,
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{
      scale: interpolate(
        scrollX.value,
        inputRange,
        [0.9, 1, 0.9],
        Extrapolate.CLAMP
      )
    }],
    opacity: interpolate(
      scrollX.value,
      inputRange,
      [0.7, 1, 0.7],
      Extrapolate.CLAMP
    )
  }));

  return (
    <Animated.View style={[styles.slide, animatedStyle]}>
      <Image source={imgSource} style={styles.slideImage} />
    </Animated.View>
  );
};

// Animated Dot Component
const AnimatedDot = ({ index, currentIndex }: {
  index: number;
  currentIndex: number;
}) => {
  const animatedDotStyle = useAnimatedStyle(() => ({
    width: interpolate(
      currentIndex,
      [index - 1, index, index + 1],
      [8, 16, 8],
      Extrapolate.CLAMP
    ),
    opacity: interpolate(
      currentIndex,
      [index - 1, index, index + 1],
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    ),
    backgroundColor: '#333'
  }));

  return <Animated.View style={[styles.dot, animatedDotStyle]} />;
};

const Carousel: React.FC = () => {
  const slides = [
    require('../../assets/images/10.1.jpg'),
    require('../../assets/images/9.3.jpg'),
    require('../../assets/images/5.1.jpg'),
    require('../../assets/images/6.2.jpg'),
    require('../../assets/images/1.1.jpg'),
    require('../../assets/images/4.1.jpg'),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const newIndex = (prev + 1) % slides.length;
        flatListRef.current?.scrollToIndex({
          index: newIndex,
          animated: true
        });
        return newIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.carouselContainer}>
      <AnimatedFlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <AnimatedSlide index={index} scrollX={scrollX} imgSource={item} />
        )}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
          minimumViewTime: 300
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index
        })}
      />

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <AnimatedDot key={index} index={index} currentIndex={currentIndex} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: SLIDER_HEIGHT + 40,
    backgroundColor: '#f5f4ee',
  },
  slide: {
    width: screenWidth,
    height: SLIDER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: '92%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 15,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    width: '100%',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default Carousel;
