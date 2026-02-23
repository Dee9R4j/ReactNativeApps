// Carousel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const Carousel: React.FC = () => {
  const slides = [
    require('../../assets/images/10.1.jpg'),
    require('../../assets/images/9.3.jpg'),
    require('../../assets/images/5.1.jpg'),
    require('../../assets/images/6.2.jpg'),
    require('../../assets/images/1.1.jpg'),
    require('../../assets/images/4.1.jpg'),
  ];
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoScrollEnabled) {
        const nextIndex = (currentSlide + 1) % slides.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true
        });
        setCurrentSlide(nextIndex);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide, autoScrollEnabled]);

  // Handle manual scroll
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    if (newIndex !== currentSlide) {
      setCurrentSlide(newIndex);
      setAutoScrollEnabled(true); // Reset auto-scroll after manual interaction
    }
  };

  // Dot navigation
  const goToSlide = (index: number) => {
    setAutoScrollEnabled(false);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true
    });
    setCurrentSlide(index);
    setTimeout(() => setAutoScrollEnabled(true), 5000); // Resume auto-scroll after 5s
  };

  return (
    <View style={styles.carousel}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <Image source={item} style={styles.slide} />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={() => setAutoScrollEnabled(true)}
      />
      
      <View style={styles.carouselDots}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index)}
          >
            <View
              style={[
                styles.dot,
                currentSlide === index && styles.dotActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Keep previous styles

const styles = StyleSheet.create({
  carousel: {
    width: '100%',
    backgroundColor: '#f5f4ee',
  },
  slide: {
    width,
    height: 300,
    resizeMode: 'cover',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    margin: 5,
  },
  dotActive: {
    backgroundColor: 'black',
  },
});

export default Carousel;