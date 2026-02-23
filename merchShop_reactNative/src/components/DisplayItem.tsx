import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, FlatList, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useShop } from '../context/ShopContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DisplayItem: React.FC<{ item: any; onClose: () => void }> = ({ item, onClose }) => {
  const { dispatch } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [wishlistClicked, setWishlistClicked] = useState(false);
  const [cartClicked, setCartClicked] = useState(false);
  const images = [item.photo1, item.photo2, item.photo3].filter(Boolean);
  const flatListRef = useRef<FlatList>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...item, quantity: 1 } });
    setCartClicked(true);
    setTimeout(() => setCartClicked(false), 3000);
  };

  const handleAddToWishlist = () => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
    setWishlistClicked(true);
    setTimeout(() => setWishlistClicked(false), 3000);
  };

  // Auto-scroll handling with reset on interaction
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide, images.length]);

  // Scroll to current slide
  useEffect(() => {
    if (flatListRef.current && images.length) {
      flatListRef.current.scrollToIndex({
        index: currentSlide,
        animated: true,
      });
    }
  }, [currentSlide, images.length]);

  const handleScrollBegin = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleScrollEnd = () => {
    timeoutRef.current = setTimeout(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 5000);
  };

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="arrow-back" size={35} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddToWishlist}>
              <Icon name="favorite" size={35} color={wishlistClicked ? 'red' : 'black'} />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={item} style={styles.slideImage} />
            )}
            onMomentumScrollEnd={(e) => {
              const contentOffset = e.nativeEvent.contentOffset.x;
              const index = Math.round(contentOffset / (SCREEN_WIDTH * 0.9 - 40));
              setCurrentSlide(index);
            }}
            onScrollBeginDrag={handleScrollBegin}
            onScrollEndDrag={handleScrollEnd}
          />

          <View style={styles.carouselDots}>
            {images.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentSlide(index)}
              >
                <View style={[
                  styles.dot,
                  currentSlide === index && styles.dotActive,
                ]} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
            <TouchableOpacity
              style={[styles.addToCartBtn, cartClicked && styles.cartAnimate]}
              onPress={handleAddToCart}
            >
              <Text style={styles.btnText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: 600,
    borderRadius: 15,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  slideImage: {
    width: SCREEN_WIDTH * 0.9 - 40,
    height: 300,
    borderRadius: 10,
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#333',
  },
  itemDetails: {
    alignItems: 'center',
    padding: 15,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 24,
    color: '#2ecc71',
    marginVertical: 10,
  },
  addToCartBtn: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  cartAnimate: {
    backgroundColor: '#2ecc71',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DisplayItem;