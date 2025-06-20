
// react-native-app/src/screens/ProfileScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AppButton from '../components/common/Button';
import { theme } from '../styles/theme';
import type { AppScreenProps } from '../navigation/types';
import type { User, Nft, Collection } from '../types/entities';
import apiClient from '../api/apiService';
// import { useAuth } from '../hooks/useAuth'; // For fetching own profile or editing
import NftList from '../components/nft/NftList'; // Assuming NftList can handle loading/error states
// import CollectionList from '../components/collection/CollectionList'; // You'd create this

// type ProfileScreenProps = AppScreenProps<'Profile'>;

const ProfileScreen = (/*{ route, navigation }: ProfileScreenProps*/) => {
  // const { userId: routeUserId } = route.params || {};
  // const { user: authUser, logout } = useAuth();
  // const isOwnProfile = !routeUserId || routeUserId === authUser?.id;
  // const profileUserId = isOwnProfile ? authUser?.id : routeUserId;

  const profileUserId = 'mock-user-id'; // Placeholder for testing
  const isOwnProfile = true; // Placeholder

  const [profileData, setProfileData] = useState<User | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Add states for NFTs created, NFTs owned, Collections, Activity, Offers tabs
  // const [createdNfts, setCreatedNfts] = useState<Nft[]>([]);

  const fetchProfileData = useCallback(async () => {
    if (!profileUserId) {
      setIsLoadingProfile(false);
      setProfileError("User ID not available.");
      return;
    }
    setIsLoadingProfile(true);
    setProfileError(null);
    try {
      const response = await apiClient.get<{ data: User }>(`/users/${profileUserId}`); // Endpoint for public profile
      setProfileData(response.data);
    } catch (err) {
      setProfileError('Failed to load profile.');
      console.error(err);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [profileUserId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (isLoadingProfile) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  }

  if (profileError || !profileData) {
    return <View style={styles.centered}><Text style={styles.errorText}>{profileError || 'Profile not found.'}</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: profileData.coverUrl || 'https://placehold.co/400x150.png' }} 
          style={styles.coverImage}
        />
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: profileData.avatarUrl || 'https://placehold.co/100x100.png' }} 
            style={styles.avatar}
          />
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.username}>{profileData.username}</Text>
        {profileData.walletAddress && (
          <Text style={styles.walletAddress}>
            {profileData.walletAddress.substring(0, 6)}...{profileData.walletAddress.slice(-4)}
          </Text>
        )}
        {profileData.bio && <Text style={styles.bio}>{profileData.bio}</Text>}
        
        {isOwnProfile && (
          <AppButton 
            title="Edit Profile" 
            onPress={() => console.log('Navigate to Edit Profile')} /* navigation.navigate('EditProfile') */
            variant="outline" 
            style={styles.editButton} 
          />
        )}
      </View>

      {/* Placeholder for Tabs: Created, Owned, Collections, Activity, Offers */}
      <View style={styles.tabsPlaceholder}>
        <Text style={styles.tabText}>Tabs (Created, Owned, etc.) Placeholder</Text>
        {/* Example: <NftList nfts={createdNfts} onNftPress={() => {}} /> */}
      </View>

      {isOwnProfile && (
         <View style={{paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.lg}}>
          <AppButton title="Log Out" onPress={() => console.log('Logout')} variant="destructive" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  header: {
    marginBottom: 60, // Space for avatar overlap
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -50, // Half of avatar height to make it overlap
    left: '50%',
    marginLeft: -50, // Half of avatar width
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.card,
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm, // Small padding because avatar overlaps
  },
  username: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  walletAddress: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.sm,
  },
  bio: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  editButton: {
    marginTop: theme.spacing.sm,
    borderColor: theme.colors.primary, // Example styling
  },
  tabsPlaceholder: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  tabText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.mutedForeground,
  }
});

export default ProfileScreen;

    