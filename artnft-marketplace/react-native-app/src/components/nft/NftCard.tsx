
// react-native-app/src/components/nft/NftCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Card from '../common/Card'; // Assuming Card handles basic styling
import { theme } from '../../styles/theme';
import type { Nft } from '../../types/entities';
import { Heart } from 'lucide-react-native'; // Example icon

interface NftCardProps {
  nft: Nft;
  onPress?: () => void;
  style?: ViewStyle;
}

const NftCard: React.FC<NftCardProps> = ({ nft, onPress, style }) => {
  const [isFavorited, setIsFavorited] = React.useState(false); // Placeholder

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: API call to toggle favorite
  };

  return (
    <Card style={[styles.cardContainer, style]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: nft.imageUrl || 'https://placehold.co/300x300.png?text=NFT' }} 
            style={styles.image} 
            resizeMode="cover"
          />
          <TouchableOpacity onPress={handleFavorite} style={styles.favoriteButton}>
            <Heart size={18} color={isFavorited ? theme.colors.destructive : theme.colors.white} fill={isFavorited ? theme.colors.destructive : 'none'} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {nft.collectionName && (
            <Text style={styles.collectionName} numberOfLines={1}>{nft.collectionName}</Text>
          )}
          <Text style={styles.title} numberOfLines={1}>{nft.title || 'Untitled NFT'}</Text>
          <Text style={styles.creator} numberOfLines={1}>
            By {nft.creator?.username || 'Unknown Creator'}
          </Text>
          {nft.isListedForSale && nft.price && nft.currency && (
            <Text style={styles.price}>{nft.price} {nft.currency}</Text>
          )}
          {!nft.isListedForSale && (
            <Text style={styles.notForSale}>Not for sale</Text>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: theme.spacing.xs, 
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden', // Ensure image corners are clipped if card has border radius
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 1, 
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  content: {
    padding: theme.spacing.sm,
  },
  collectionName: {
    fontSize: theme.fontSize.xs - 1, // Slightly smaller
    color: theme.colors.mutedForeground,
    marginBottom: 2,
    fontWeight: '500',
  },
  title: {
    fontSize: theme.fontSize.base,
    fontWeight: 'bold',
    color: theme.colors.foreground,
    marginBottom: 2,
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
  notForSale: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.mutedForeground,
    fontStyle: 'italic',
  }
});

export default NftCard;
