// CardContainer.tsx
import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import Card from './Card';
import itemsList, { Product } from '../items'; // Assuming Product type is exported from items.ts

const CardContainer: React.FC = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Featured Products</Text>
        <FlatList
        data={itemsList}
        renderItem={({ item }: { item: Product }) => ( // Add type for item
            <Card item={item} /> 
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.cardListContainer}
        // Remove scrollEnabled if this FlatList is inside another scrollable (like HomeScreen's FlatList)
        // to avoid nested scrolling issues. However, since HomeScreen's FlatList uses ListHeaderComponent,
        // this CardContainer's FlatList should manage its own scrolling if it has many items.
        // For this design, itemsList is likely short enough not to need its own scroll.
        // If itemsList is long, consider making CardContainer not use FlatList, and render items directly
        // or make HomeScreen's FlatList render these items.
        // For now, assuming itemsList is not excessively long for this context.
        // scrollEnabled={false} // Uncomment if nested scroll issues arise and this list is short
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10, // Overall padding for the container
    // backgroundColor: '#f5f4ee', // Match HomeScreen background if needed
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
    marginLeft: 5, // Align with card margins
  },
  cardListContainer: {
    paddingBottom: 20, // Padding at the bottom of the list
  },
});

export default CardContainer;