//DisplayItem.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useShop } from '../context/ShopContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_CONTAINER_WIDTH = SCREEN_WIDTH * 0.9;
const IMAGE_HORIZONTAL_PADDING = 20;
const IMAGE_WIDTH_IN_FLATLIST = IMAGE_CONTAINER_WIDTH - (2 * IMAGE_HORIZONTAL_PADDING);

interface DisplayItemProps {
  item: any;
  onClose: () => void;
}

const DisplayItem: React.FC<DisplayItemProps> = ({ item, onClose }) => {
  const { dispatch } = useShop();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wishlistClicked, setWishlistClicked] = useState(false);
  const [cartClicked, setCartClicked] = useState(false);
  const images = [item.photo1, item.photo2, item.photo3].filter(Boolean);
  const flatListRef = useRef<Animated.FlatList<any>>(null);
  const scrollX = useSharedValue(0);

  // Modal animation values
  const modalOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.9);

  useEffect(() => {
    modalOpacity.value = withTiming(1, { duration: 300 });
    modalScale.value = withTiming(1, { duration: 300 });
  }, []);

  const animatedModalContentStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    }
  });

  // Auto-scroll logic
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newIndex = (prev + 1) % images.length;
        flatListRef.current?.scrollToIndex({
          index: newIndex,
          animated: true
        });
        return newIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Viewability config
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index);
    }
  }).current;

  // Pagination dot component
  const PaginationDot = ({ index }: { index: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * IMAGE_CONTAINER_WIDTH,
        index * IMAGE_CONTAINER_WIDTH,
        (index + 1) * IMAGE_CONTAINER_WIDTH,
      ];

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.3, 1, 0.3],
        Extrapolate.CLAMP
      );

      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1.2, 0.8],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        transform: [{ scale }],
        backgroundColor: '#555'
      };
    });

    return <Animated.View style={[styles.dot, animatedStyle]} />;
  };

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...item, quantity: 1 } });
    setCartClicked(true);
    setTimeout(() => setCartClicked(false), 2000);
  };

  const handleAddToWishlist = () => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
    setWishlistClicked(true);
    setTimeout(() => setWishlistClicked(false), 2000);
  };

  return (
    <Modal visible={true} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.content, animatedModalContentStyle]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
              <Icon name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.itemNameHeader} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            <TouchableOpacity onPress={handleAddToWishlist} style={styles.iconButton}>
              <Icon 
                name={wishlistClicked ? "favorite" : "favorite-border"} 
                size={28} 
                color={wishlistClicked ? '#e91e63' : '#555'} 
              />
            </TouchableOpacity>
          </View>

          <Animated.FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item: imgSource }) => (
              <View style={styles.slideItemContainer}>
                <Image source={imgSource} style={styles.slideImage} resizeMode="contain" />
              </View>
            )}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
              minimumViewTime: 300
            }}
            onViewableItemsChanged={onViewableItemsChanged}
            getItemLayout={(_, index) => ({
              length: IMAGE_CONTAINER_WIDTH,
              offset: IMAGE_CONTAINER_WIDTH * index,
              index
            })}
            style={{ width: IMAGE_CONTAINER_WIDTH }}
          />

          {images.length > 1 && (
            <View style={styles.pagination}>
              {images.map((_, index) => (
                <PaginationDot key={index} index={index} />
              ))}
            </View>
          )}

          <View style={styles.itemDetails}>
            <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
            <TouchableOpacity
              style={[styles.addToCartBtn, cartClicked && styles.cartAnimate]}
              onPress={handleAddToCart}
            >
              <Icon name="add-shopping-cart" size={20} color="white" style={{ marginRight: 10 }} />
              <Text style={styles.btnText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemNameHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  iconButton: {
    padding: 5,
  },
  slideItemContainer: {
    width: IMAGE_CONTAINER_WIDTH,
    height: SCREEN_HEIGHT * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: IMAGE_HORIZONTAL_PADDING,
  },
  slideImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  itemDetails: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  itemPrice: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#27ae60',
    marginVertical: 15,
  },
  addToCartBtn: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 200,
  },
  cartAnimate: {
    backgroundColor: '#2ecc71',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DisplayItem;
