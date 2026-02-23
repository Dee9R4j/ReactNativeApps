// CardContainer.tsx
import React, { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Card from './Card';
import DisplayItem from './DisplayItem';
import itemsList from '../items';

const CardContainer: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <>
      <FlatList
        data={itemsList}
        renderItem={({ item }) => (
          <Card item={item} onClick={() => setSelectedItem(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.cardContainer}
      />
      {selectedItem && (
        <DisplayItem item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 10,
    paddingBottom: 80,
  },
});

export default CardContainer;

