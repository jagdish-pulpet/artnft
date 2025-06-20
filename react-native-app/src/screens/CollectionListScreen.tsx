// react-native-app/src/screens/CollectionListScreen.tsx
// Placeholder for Collection List Screen
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import CollectionCard from '../components/collection/CollectionCard';
// import type { Collection } from '../types/entities';

const CollectionListScreen = () => {
  // Fetch collections
  const mockCollections = [
    // { id: 'c1', name: 'Mobile Collection 1', creator: { username: 'RN Creator'}, coverImageUrl: 'https://placehold.co/400x200.png?text=RNC1' },
  ];

  return (
    <View>
      <Text>Explore Collections</Text>
      {/* <FlatList
        data={mockCollections as any}
        renderItem={({ item }) => <CollectionCard collection={item} onPress={() => console.log('Collection pressed', item.id)} />}
        keyExtractor={(item) => item.id}
      /> */}
    </View>
  );
};
export default CollectionListScreen;
