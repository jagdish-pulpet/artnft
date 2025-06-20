
// react-native-app/src/screens/CreateCollectionScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, Image as RNImage, ActivityIndicator } from 'react-native';
import AppInput from '../components/common/Input';
import AppButton from '../components/common/Button';
import { theme } from '../styles/theme';
import type { AppScreenProps } from '../navigation/types';
import apiClient, { ApiError } from '../api/apiService';
import { useAuth } from '../store/authContext';
import * as ImagePicker from 'expo-image-picker';
import { AlertCircle, ImagePlus } from 'lucide-react-native';
import { uploadImageFile } from '../services/imageUploadService';
import { useToast } from '../hooks/useToast';

type CreateCollectionScreenProps = AppScreenProps<'CreateCollectionModal'>;

interface CreateCollectionFormState {
  name: string;
  description: string;
  category: string;
  logoImageUri: string | null;
  coverImageUri: string | null;
}

const CreateCollectionScreen = ({ navigation }: CreateCollectionScreenProps) => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [formState, setFormState] = useState<CreateCollectionFormState>({
    name: '',
    description: '',
    category: '',
    logoImageUri: null,
    coverImageUri: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);


  const pickImage = async (setImageUriAction: (uri: string | null) => void, fieldName: 'logoImageUri' | 'coverImageUri') => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: fieldName === 'logoImageUri' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUriAction(result.assets[0].uri);
      setFormError(null);
    }
  };

  const handleChange = (name: keyof CreateCollectionFormState, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formState.name) {
      setFormError('Collection name is required.');
      return;
    }
    if (!token) {
      setFormError('Authentication required. Please log in.');
      showToast({ type: 'error', text1: 'Authentication Required', text2: 'Please sign in to create a collection.' });
      navigation.navigate('AuthNavigator', { screen: 'SignIn' });
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    let logoImageUrl: string | undefined = undefined;
    let coverImageUrl: string | undefined = undefined;

    try {
      if (formState.logoImageUri) {
        setIsUploadingLogo(true);
        logoImageUrl = await uploadImageFile(formState.logoImageUri, token);
        setIsUploadingLogo(false);
        if (!logoImageUrl) throw new Error("Logo image upload failed.");
      }

      if (formState.coverImageUri) {
        setIsUploadingCover(true);
        coverImageUrl = await uploadImageFile(formState.coverImageUri, token);
        setIsUploadingCover(false);
        if (!coverImageUrl) throw new Error("Cover image upload failed.");
      }

      const payload = {
        name: formState.name,
        description: formState.description || undefined,
        category: formState.category || undefined,
        logoImageUrl: logoImageUrl,
        coverImageUrl: coverImageUrl,
      };

      const response = await apiClient.post<{ data: { id: string, slug?: string, name: string } }>('/collections', payload);
      
      showToast({ type: 'success', text1: 'Collection Created!', text2: `Collection "${response.data.data.name}" created successfully.` });
      setFormState({ name: '', description: '', category: '', logoImageUri: null, coverImageUri: null }); 
      
      if (response.data.data.slug || response.data.data.id) {
        navigation.replace('CollectionDetail', { collectionId: response.data.data.slug || response.data.data.id });
      } else {
        navigation.goBack();
      }

    } catch (error: any) {
      setIsUploadingLogo(false);
      setIsUploadingCover(false);
      const message = error instanceof ApiError ? error.data?.message || error.message : error.message || 'Failed to create collection.';
      setFormError(message);
      showToast({ type: 'error', text1: 'Creation Failed', text2: message });
      console.error("Create collection error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Create New Collection</Text>
      {formError && (
        <View style={styles.messageBannerError}>
          <AlertCircle size={18} color={theme.colors.destructiveForeground} style={{marginRight: theme.spacing.sm}}/>
          <Text style={styles.messageTextError}>{formError}</Text>
        </View>
      )}
      
      <AppInput label="Collection Name *" value={formState.name} onChangeText={(val) => handleChange('name', val)} placeholder="e.g., My Awesome Art" disabled={isSubmitting}/>
      <AppInput label="Description" value={formState.description} onChangeText={(val) => handleChange('description', val)} placeholder="Tell us about your collection..." multiline numberOfLines={4} disabled={isSubmitting}/>
      <AppInput label="Category" value={formState.category} onChangeText={(val) => handleChange('category', val)} placeholder="e.g., Art, Gaming, Photography" disabled={isSubmitting}/>

      <View style={styles.imagePickerContainer}>
        <Text style={styles.label}>Logo Image</Text>
        <AppButton title={formState.logoImageUri ? "Change Logo" : "Select Logo"} onPress={() => pickImage(uri => setFormState(p => ({...p, logoImageUri: uri})), 'logoImageUri')} variant="outline" disabled={isSubmitting} style={styles.imagePickerButton} leftIcon={<ImagePlus size={16} color={theme.colors.primary}/>}/>
        {isUploadingLogo && <View style={styles.uploadingContainer}><ActivityIndicator color={theme.colors.primary} style={{marginRight: 5}}/><Text style={styles.uploadingText}>Uploading logo...</Text></View>}
        {formState.logoImageUri && (
          <View style={styles.imagePreviewContainer}>
            <RNImage source={{ uri: formState.logoImageUri }} style={[styles.imagePreview, styles.logoPreview]} />
            <Text style={styles.imageUriText} numberOfLines={1}>Selected: {formState.logoImageUri.split('/').pop()}</Text>
          </View>
        )}
      </View>

      <View style={styles.imagePickerContainer}>
        <Text style={styles.label}>Cover Image</Text>
        <AppButton title={formState.coverImageUri ? "Change Cover" : "Select Cover"} onPress={() => pickImage(uri => setFormState(p => ({...p, coverImageUri: uri})), 'coverImageUri')} variant="outline" disabled={isSubmitting} style={styles.imagePickerButton} leftIcon={<ImagePlus size={16} color={theme.colors.primary}/>}/>
        {isUploadingCover && <View style={styles.uploadingContainer}><ActivityIndicator color={theme.colors.primary} style={{marginRight: 5}}/><Text style={styles.uploadingText}>Uploading cover...</Text></View>}
        {formState.coverImageUri && (
          <View style={styles.imagePreviewContainer}>
            <RNImage source={{ uri: formState.coverImageUri }} style={[styles.imagePreview, styles.coverPreview]} />
            <Text style={styles.imageUriText} numberOfLines={1}>Selected: {formState.coverImageUri.split('/').pop()}</Text>
          </View>
        )}
      </View>

      <AppButton title="Create Collection" onPress={handleSubmit} isLoading={isSubmitting} disabled={isSubmitting || !formState.name} style={styles.submitButton}/>
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
  imagePickerContainer: {
    marginBottom: theme.spacing.md,
  },
  imagePickerButton: {
    borderColor: theme.colors.accent,
    marginBottom: theme.spacing.sm,
  },
  label: { 
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.muted,
    marginBottom: theme.spacing.xs,
  },
  logoPreview: {
    width: 100,
    height: 100,
  },
  coverPreview: {
    width: '100%',
    height: 120, 
  },
  imageUriText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    fontStyle: 'italic',
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  uploadingText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
  }
});

export default CreateCollectionScreen;
