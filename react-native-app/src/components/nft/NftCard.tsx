
// react-native-app/src/components/nft/NftCard.tsx
// Placeholder for an NFT Card component
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../common/Card';
import { theme } from '../../styles/theme';
import type { Nft } from '../../types/entities'; // Assuming you define this

interface NftCardProps {
  nft: Nft; // Use a refined Nft type for mobile if needed
  onPress?: () => void;
}

const NftCard: React.FC<NftCardProps> = ({ nft, onPress }) => {
  return (
    <Card style={styles.cardContainer}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Image source={{ uri: nft.imageUrl || 'https://placehold.co/300x300.png' }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{nft.title}</Text>
          <Text style={styles.creator} numberOfLines={1}>By {nft.creator?.username || 'Unknown'}</Text>
          {nft.price && nft.currency && (
            <Text style={styles.price}>{nft.price} {nft.currency}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: theme.spacing.sm,
    width: '45%', // Example for a two-column grid, adjust as needed
    // If using FlatList numColumns, width might not be needed directly here
  },
  image: {
    width: '100%',
    aspectRatio: 1, // Square image
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  content: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.foreground,
  },
  creator: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.xs,
  },
  price: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.accent,
  },
});

export default NftCard;

    