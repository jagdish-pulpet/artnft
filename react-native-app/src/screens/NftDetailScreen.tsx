
// react-native-app/src/screens/NftDetailScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import type { AppScreenProps } from '../navigation/types';
import type { Nft, NftProperty, Offer } from '../types/entities'; // Make sure Nft type includes properties, owner, creator etc.
import apiClient from '../api/apiService';
import AppButton from '../components/common/Button';
// import { useAuth } from '../hooks/useAuth'; // To check if user is owner for "Make Offer"

// type NftDetailScreenProps = AppScreenProps<'NftDetail'>;

const NftDetailScreen = (/*{ route }: NftDetailScreenProps*/) => {
  // const { nftId } = route.params;
  const nftId = 'nft-101'; // Placeholder for testing, use route.params.nftId
  // const { user: authUser } = useAuth();

  const [nftData, setNftData] = useState<Nft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [offers, setOffers] = useState<Offer[]>([]); // For future offer display

  const fetchNftDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Nft>(`/nfts/${nftId}`); // Adjust if backend wraps in 'data'
      setNftData(response.data);
    } catch (err) {
      setError('Failed to load NFT details.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [nftId]);

  useEffect(() => {
    fetchNftDetails();
  }, [fetchNftDetails]);

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  }

  if (error || !nftData) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error || 'NFT not found.'}</Text></View>;
  }
  
  // const isOwner = authUser?.id === nftData.owner?.id;
  // const canMakeOffer = authUser && nftData.isListedForSale && !isOwner;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image source={{ uri: nftData.imageUrl || 'https://placehold.co/400x400.png' }} style={styles.image} />
      
      <View style={styles.infoContainer}>
        {nftData.collectionName && (
          <Text style={styles.collectionName}>{nftData.collectionName}</Text>
        )}
        <Text style={styles.title}>{nftData.title}</Text>
        
        <View style={styles.ownerCreatorContainer}>
          <View style={styles.avatarName}>
             {/* <Image source={{ uri: nftData.owner?.avatarUrl || 'https://placehold.co/40x40.png' }} style={styles.avatar} /> */}
             <Text style={styles.metaText}>Owned by <Text style={styles.linkText}>{nftData.owner?.username || 'Unknown'}</Text></Text>
          </View>
          <View style={styles.avatarName}>
             {/* <Image source={{ uri: nftData.creator?.avatarUrl || 'https://placehold.co/40x40.png' }} style={styles.avatar} /> */}
             <Text style={styles.metaText}>Created by <Text style={styles.linkText}>{nftData.creator?.username || 'Unknown'}</Text></Text>
          </View>
        </View>

        {nftData.isListedForSale && nftData.price && (
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Current Price</Text>
            <Text style={styles.priceValue}>{nftData.price} {nftData.currency || 'ETH'}</Text>
          </View>
        )}
        
        <View style={styles.actionsContainer}>
            {/* {canMakeOffer && <AppButton title="Make Offer" onPress={() => {}} style={{flex:1}}/>} */}
            {/* Placeholder for actions */}
            <AppButton title="Buy Now (Placeholder)" onPress={() => {}} style={{flex:1}}/>
        </View>

        {nftData.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{nftData.description}</Text>
          </View>
        )}

        {nftData.properties && nftData.properties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Properties</Text>
            <View style={styles.propertiesGrid}>
              {nftData.properties.map((prop, index) => (
                <View key={index} style={styles.propertyChip}>
                  <Text style={styles.propertyTraitType}>{prop.trait_type}</Text>
                  <Text style={styles.propertyValue}>{String(prop.value)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Placeholder for Offers and Activity Feed */}
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Offers (Placeholder)</Text>
         </View>
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity (Placeholder)</Text>
         </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  contentContainer: {
    paddingBottom: theme.spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.destructive,
    textAlign: 'center',
  },
  image: { 
    width: '100%', 
    aspectRatio: 1, // Square image, adjust as needed
    marginBottom: theme.spacing.md 
  },
  infoContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  collectionName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.accent,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  title: { 
    fontSize: theme.fontSize.xxl, 
    fontWeight: 'bold', 
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  ownerCreatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  avatarName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: theme.spacing.xs,
  },
  metaText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  },
  linkText: {
    color: theme.colors.accent,
    fontWeight: '500',
  },
  priceSection: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  priceLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.xs,
  },
  priceValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.foreground,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  descriptionText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    lineHeight: 22,
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  propertyChip: {
    backgroundColor: theme.colors.muted,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
  },
  propertyTraitType: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.accent,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  propertyValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    fontWeight: '500',
  },
});


export default NftDetailScreen;

    