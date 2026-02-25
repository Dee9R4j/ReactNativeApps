import React from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  StatusBar,
} from 'react-native';
import {
  useQuery,
} from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios'; // Using Axios as requested
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { useSecureStore } from '@/state/secure/secure';

type GalleryPayload = {
  urls: string[];
};

const API_URL = 'https://bits-oasis.org/2025/main/app/gallery/';

const { width } = Dimensions.get('screen');
const spacing = 18;
const imageWidth = width * 0.7; // 70% of screen width
const imageHeight = imageWidth * 1.76; // Maintain aspect ratio
const fullImageWidth = imageWidth + spacing; // Full item width + gap

// Create animated version of FlatList
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<string>);

import { MOCK_GALLERY_IMAGES, simulateNetworkDelay } from '@/api/dummyData';

const fetchWallpapers = async (): Promise<GalleryPayload> => {
  try {
    await simulateNetworkDelay(400, 1000);
    const urls = MOCK_GALLERY_IMAGES.map(img => img.url);

    console.log("Mock Gallery response data:", urls);
    return { urls };
  } catch (error: any) {
    throw new Error('An unknown error occurred while fetching the mock gallery.');
  }
};

type BackdropProps = {
  imageUrl: string;
  index: number;
  scrollX: Animated.SharedValue<number>;
};

const BackdropPhoto = ({ imageUrl, index, scrollX }: BackdropProps) => {
  const animatedOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [0, 1, 0]
    );
    return { opacity };
  });

  return (
    <Animated.Image
      source={{ uri: imageUrl }}
      style={[StyleSheet.absoluteFillObject, styles.backdropImage, animatedOpacity]}
      blurRadius={50}
      onError={(e) => {
        console.log(`Failed to load backdrop: ${imageUrl}`, e.nativeEvent.error);
      }}
    />
  );
};

type PhotoProps = {
  item: string; 
  index: number;
  scrollX: Animated.SharedValue<number>;
};

const PhotoComponent = ({ item, index, scrollX }: PhotoProps) => {
  const animatedStyles = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];
    const scale = interpolate(scrollX.value, inputRange, [1.6, 1, 1.6]);
    const rotate = interpolate(scrollX.value, inputRange, [15, 0, -15]);

    return {
      transform: [{ scale: scale }, { rotate: `${rotate}deg` }],
    };
  });

  return (
    <View style={styles.itemContainer}>
      <Animated.Image
        source={{ uri: item }}
        style={[styles.itemImage, animatedStyles]}
        onError={(e) => {
          console.warn(`Failed to load image: ${item}`, e.nativeEvent.error);
        }}
      />
    </View>
  );
};

export default function OasisGallery() {
  // Query type is updated to GalleryPayload
  const { data, isLoading, isError, error } = useQuery<GalleryPayload, Error>({
    queryKey: ['wallpapers'],
    queryFn: fetchWallpapers,
  });

  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x / fullImageWidth;
  });

  // Loading State
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Error State
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  // Success State
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      

      {data?.urls.map((imageUrl, index) => (
        <BackdropPhoto
          key={imageUrl}
          imageUrl={imageUrl}
          index={index}
          scrollX={scrollX}
        />
      ))}

      <AnimatedFlatList
        data={data?.urls}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <PhotoComponent item={item} index={index} scrollX={scrollX} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={fullImageWidth}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

     <Image source={require('@assets/images/photog_white_logo.png')} style={styles.photogLogo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  headerContainer: {
    position: 'absolute',
    left: 20,
    zIndex: 100,
    padding: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: 'white',
    fontSize: 26,
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  listContent: {
    gap: spacing,
    paddingHorizontal: (width - imageWidth) / 2,
    alignItems: 'center',
  },
  itemContainer: {
    width: imageWidth,
    height: imageHeight,
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
 photogLogo: {
    position: 'absolute',
    bottom: 40,
    zIndex: 10, // This is correct, keeps it on top

    // --- ADD THESE LINES ---
    width: 200, // Or the actual width you want
    height: 100, // Or the actual height you want
    resizeMode: 'contain', // Best for logos
    alignSelf: 'center', // This will center it horizontally
  },
});