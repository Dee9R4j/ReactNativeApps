import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Card: React.FC<{ item: any; onClick: () => void }> = ({ item, onClick }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onClick}>
      <View style={styles.imageContainer}>
        <Image 
          source={item.photo1} 
          style={styles.cardImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardPrice}>₹{item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    margin: 5,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    padding: 10,
    alignItems: 'center',
  },
  cardName: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
    color: '#333',
  },
  cardPrice: {
    fontWeight: 'bold',
    color: 'green',
    fontSize: 18,
  },
});

export default Card;