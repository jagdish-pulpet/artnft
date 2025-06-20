
// react-native-app/src/screens/EditProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Platform, Image as RNImage, ActivityIndicator } from 'react-native';
import AppInput from '../components/common/Input';
import AppButton from '../components/common/Button';
import { theme } from '../styles/theme';
import type { AppScreenProps } from '../navigation/types';
import type { User } from '../types/entities';
import apiClient, { ApiError } from '../api/apiService';
import { useAuth } from '../store/authContext';
import * as ImagePicker from 'expo-image-picker';
import LoadingIndicator from '../components/common/LoadingIndicator';
import { AlertCircle, ImagePlus, Save } from 'lucide-react-native';
import { uploadImageFile } from '../services/imageUploadService';
import { useToast } from '../hooks/useToast';

type EditProfileScreenProps = AppScreenProps<'EditProfile'>;

interface EditProfileFormState {
  username: string;
  email: string;
  bio: string;
  avatarUri: string | null; 
  coverUri: string | null; 
  socialLinks: {
    twitter: string;
    instagram: string;
    website: string;
    discord: string;
  };
}

const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const { user, token, refreshAuthUser, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const [formState, setFormState] = useState<EditProfileFormState>({
    username: '',
    email: '',
    bio: '',
    avatarUri: null,
    coverUri: null,
    socialLinks: { twitter: '', instagram: '', website: '', discord: '' },
  });
  const [initialAvatarUrl, setInitialAvatarUrl] = useState<string | null>(null);
  const [initialCoverUrl, setInitialCoverUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  useEffect(() => {
    if (user) {
      setFormState({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        avatarUri: null, 
        coverUri: null,
        socialLinks: {
          twitter: user.socialLinks?.twitter || '',
          instagram: user.socialLinks?.instagram || '',
          website: user.socialLinks?.website || '',
          discord: user.socialLinks?.discord || '',
        },
      });
      setInitialAvatarUrl(user.avatarUrl || null);
      setInitialCoverUrl(user.coverUrl || null);
    }
  }, [user]);

  const pickImage = async (
    setImageUriAction: (uri: string | null) => void,
    fieldName: 'avatarUri' | 'coverUri'
  ) => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions.');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: fieldName === 'avatarUri' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUriAction(result.assets[0].uri);
      setFormError(null);
    }
  };

  const handleChange = (name: keyof Omit<EditProfileFormState, 'socialLinks'>, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  const handleSocialLinkChange = (socialName: keyof EditProfileFormState['socialLinks'], value: string) => {
    setFormState(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [socialName]: value }
    }));
  };


  const handleSubmit = async () => {
    if (!token || !user) {
      setFormError('Authentication required.');
      return;
    }
    if (!formState.username) {
        setFormError('Username is required.');
        return;
    }

    setIsSubmitting(true);
    setFormError(null);
    let uploadedAvatarUrl: string | undefined = initialAvatarUrl || undefined;
    let uploadedCoverUrl: string | undefined = initialCoverUrl || undefined;

    try {
      if (formState.avatarUri) {
        setIsUploadingAvatar(true);
        uploadedAvatarUrl = await uploadImageFile(formState.avatarUri, token);
        setIsUploadingAvatar(false);
        if (!uploadedAvatarUrl) throw new Error("Avatar image upload failed.");
      }

      if (formState.coverUri) {
        setIsUploadingCover(true);
        uploadedCoverUrl = await uploadImageFile(formState.coverUri, token);
        setIsUploadingCover(false);
        if (!uploadedCoverUrl) throw new Error("Cover image upload failed.");
      }

      const payload: Partial<User> = {
        username: formState.username,
        email: formState.email === user.email ? undefined : formState.email || undefined, 
        bio: formState.bio || undefined,
        avatarUrl: uploadedAvatarUrl,
        coverUrl: uploadedCoverUrl,
        socialLinks: {
          twitter: formState.socialLinks.twitter || undefined,
          instagram: formState.socialLinks.instagram || undefined,
          website: formState.socialLinks.website || undefined,
          discord: formState.socialLinks.discord || undefined,
        }
      };
      if (payload.socialLinks) {
        payload.socialLinks = Object.fromEntries(
            Object.entries(payload.socialLinks).filter(([_, v]) => v !== undefined)
        ) as typeof payload.socialLinks;
         if (Object.keys(payload.socialLinks).length === 0) {
            payload.socialLinks = undefined;
        }
      }

      await apiClient.put('/users/me', payload);
      await refreshAuthUser(); 
      
      showToast({ type: 'success', text1: 'Profile Updated', text2: 'Your profile has been successfully updated.'});
      navigation.goBack();

    } catch (error: any) {
      setIsUploadingAvatar(false);
      setIsUploadingCover(false);
      const message = error instanceof ApiError ? error.data?.message || error.message : error.message || 'Failed to update profile.';
      setFormError(message);
      showToast({ type: 'error', text1: 'Update Failed', text2: message });
      console.error("Update profile error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || (!user && !isAuthLoading)) {
    return <LoadingIndicator fullScreen color={theme.colors.primary} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Edit Your Profile</Text>
      {formError && (
        <View style={styles.messageBannerError}>
          <AlertCircle size={18} color={theme.colors.destructiveForeground} style={{marginRight: theme.spacing.sm}}/>
          <Text style={styles.messageTextError}>{formError}</Text>
        </View>
      )}

      <View style={styles.imageSection}>
        <View style={styles.imagePickerItem}>
            <Text style={styles.label}>Avatar Image</Text>
            <RNImage source={{ uri: formState.avatarUri || initialAvatarUrl || 'https://placehold.co/100x100.png' }} style={styles.avatarPreview} />
            <AppButton title="Change Avatar" onPress={() => pickImage(uri => setFormState(p=>({...p, avatarUri: uri})), 'avatarUri')} variant="outline" disabled={isSubmitting || isUploadingAvatar} style={styles.imagePickerButton} leftIcon={<ImagePlus size={16} color={theme.colors.primary}/>}/>
            {isUploadingAvatar && <View style={styles.uploadingContainer}><ActivityIndicator color={theme.colors.primary} style={{marginRight: 5}}/><Text style={styles.uploadingText}>Uploading avatar...</Text></View>}
        </View>
        <View style={styles.imagePickerItem}>
            <Text style={styles.label}>Cover Image</Text>
            <RNImage source={{ uri: formState.coverUri || initialCoverUrl || 'https://placehold.co/300x100.png' }} style={styles.coverPreview} />
            <AppButton title="Change Cover" onPress={() => pickImage(uri => setFormState(p=>({...p, coverUri: uri})), 'coverUri')} variant="outline" disabled={isSubmitting || isUploadingCover} style={styles.imagePickerButton} leftIcon={<ImagePlus size={16} color={theme.colors.primary}/>}/>
            {isUploadingCover && <View style={styles.uploadingContainer}><ActivityIndicator color={theme.colors.primary} style={{marginRight: 5}}/><Text style={styles.uploadingText}>Uploading cover...</Text></View>}
        </View>
      </View>
      
      <AppInput label="Username *" value={formState.username} onChangeText={(val) => handleChange('username', val)} placeholder="Your public display name" disabled={isSubmitting} />
      <AppInput label="Email" value={formState.email} onChangeText={(val) => handleChange('email', val)} keyboardType="email-address" placeholder="your.email@example.com" disabled={isSubmitting} />
      <AppInput label="Bio" value={formState.bio} onChangeText={(val) => handleChange('bio', val)} placeholder="Tell us about yourself..." multiline numberOfLines={4} disabled={isSubmitting}/>

      <Text style={[styles.label, styles.subHeader]}>Social Links (Optional)</Text>
      <AppInput label="Website URL" value={formState.socialLinks.website} onChangeText={(val) => handleSocialLinkChange('website', val)} placeholder="https://yoursite.com" keyboardType="url" disabled={isSubmitting}/>
      <AppInput label="Twitter URL" value={formState.socialLinks.twitter} onChangeText={(val) => handleSocialLinkChange('twitter', val)} placeholder="https://twitter.com/yourhandle" keyboardType="url" disabled={isSubmitting}/>
      <AppInput label="Instagram URL" value={formState.socialLinks.instagram} onChangeText={(val) => handleSocialLinkChange('instagram', val)} placeholder="https://instagram.com/yourhandle" keyboardType="url" disabled={isSubmitting}/>
      <AppInput label="Discord Server URL" value={formState.socialLinks.discord} onChangeText={(val) => handleSocialLinkChange('discord', val)} placeholder="https://discord.gg/yourserver" keyboardType="url" disabled={isSubmitting}/>

      <AppButton title="Save Changes" onPress={handleSubmit} isLoading={isSubmitting} disabled={isSubmitting} style={styles.submitButton} leftIcon={<Save size={18} color={theme.colors.primaryForeground}/>}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  messageBannerError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.destructive,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  messageTextError: {
    color: theme.colors.destructiveForeground,
    fontSize: theme.fontSize.sm,
    flexShrink: 1,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  imageSection: {
    flexDirection: 'column',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  imagePickerItem: {
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.card,
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50, 
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.muted,
  },
  coverPreview: {
    width: '100%',
    height: 100, 
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.muted,
  },
  imagePickerButton: {
    borderColor: theme.colors.accent,
    width: '80%',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  uploadingText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.xs,
  },
  subHeader: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  submitButton: {
    marginTop: theme.spacing.xl,
  }
});

export default EditProfileScreen;
