//app/product/[id].tsx
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DisplayItemComponent from '../../src/components/DisplayItem';
import itemsList from '../../src/items'; // Ensure this path is correct
import { Text, View } from 'react-native'; // For error case

export default function ProductDisplayScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // Ensure id is treated as string
  
  // Find item, making sure to compare id as string if item.id is number
  const item = itemsList.find(p => p.id.toString() === id);

  if (!item) {
    // Handle item not found, maybe redirect or show an error
    console.error("Product not found for ID:", id);
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Product not found!</Text>
            <Text onPress={() => router.back()} style={{color: 'blue', marginTop: 10}}>Go Back</Text>
        </View>
    );
  }

  return <DisplayItemComponent item={item} onClose={() => router.back()} />;
}