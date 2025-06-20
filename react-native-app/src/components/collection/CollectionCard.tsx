
// react-native-app/src/components/collection/CollectionCard.tsx
// Placeholder for a Collection Card component
import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../styles/theme';
import type { Collection } from '../../types/entities';

interface CollectionCardProps {
  collection: Collection;
  onPress?: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
      <ImageBackground
        source={{ uri: collection.coverImageUrl || collection.logoImageUrl || 'https://placehold.co/400x200.png' }}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: theme.borderRadius.lg }}
      >
        <View style={styles.overlay}>
          <Text style={styles.name}>{collection.name}</Text>
          <Text style={styles.creator}>By {collection.creator?.username || 'Unknown'}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    margin: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: theme.spacing.sm,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
  },
  name: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  creator: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.lightGray,
  },
});

export default CollectionCard;

    