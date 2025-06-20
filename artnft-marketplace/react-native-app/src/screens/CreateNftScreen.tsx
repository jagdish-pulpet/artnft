
// react-native-app/src/screens/CreateNftScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, Image as RNImage, ActivityIndicator } from 'react-native';
import AppInput from '../components/common/Input';
import AppButton from '../components/common/Button';
import { theme } from '../styles/theme';
import type { AppScreenProps } from '../navigation/types';
import apiClient, { ApiError } from '../api/apiService';
import { useAuth } from '../store/authContext';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import LoadingIndicator from '../components/common/LoadingIndicator';
import type { Collection, Nft } from '../types/entities';
import { AlertCircle, CheckCircle, ImagePlus } from 'lucide-react-native';
import { uploadImageFile } from '../services/imageUploadService';
import { useToast } from '../hooks/useToast';

type CreateNftScreenProps = AppScreenProps<'CreateNftModal'>;

interface CreateNftFormState {
  title: string;
  description: string;
  price: string;
  imageUri: string | null;
  selectedCollectionId: string | undefined;
}

const CreateNftScreen = ({ navigation }: CreateNftScreenProps) => {
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const [formState, setFormState] = useState<CreateNftFormState>({
    title: '',
    description: '',
    price: '',
    imageUri: null,
    selectedCollectionId: undefined,
  });
  
  const [userCollections, setUserCollections] = useState<Collection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  // const [successMessage, setSuccessMessage] = useState<string | null>(null); // Replaced by toast
  const [isUploadingImage, setIsUploadingImage] = useState(false);


  const fetchUserCollections = useCallback(async () => {
    if (!token || !user?.id) return;
    setIsLoadingCollections(true);
    try {
      const response = await apiClient.get<{ data: Collection[] }>(`/collections?creatorId=${user.id}&limit=100`);
      setUserCollections(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch user collections:", error);
      setFormError("Could not load your collections for selection.");
    } finally {
      setIsLoadingCollections(false);
    }
  }, [token, user?.id]);

  useEffect(() => {
    fetchUserCollections();
  }, [fetchUserCollections]);

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormState(prev => ({ ...prev, imageUri: result.assets![0].uri }));
      setFormError(null); 
    }
  };

  const handleChange = (name: keyof CreateNftFormState, value: string | undefined | null) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formState.title || !formState.imageUri) {
      setFormError('Title and Image are required.');
      return;
    }
    if (!token) {
      setFormError('Authentication required. Please log in.');
      showToast({ type: 'error', text1: 'Authentication Required', text2: 'Please sign in to create an NFT.' });
      navigation.navigate('AuthNavigator', { screen: 'SignIn' });
      return;
    }

    setIsSubmitting(true);
    setIsUploadingImage(true);
    setFormError(null);
    // setSuccessMessage(null);

    try {
      const uploadedImageUrl = await uploadImageFile(formState.imageUri, token);
      setIsUploadingImage(false);
      if (!uploadedImageUrl) {
        throw new Error("Image upload failed or was cancelled.");
      }

      const payload: Partial<Nft> & {title: string, imageUrl: string} = {
        title: formState.title,
        description: formState.description || undefined,
        imageUrl: uploadedImageUrl,
        price: formState.price ? parseFloat(formState.price) : undefined,
        currency: formState.price ? 'ETH' : undefined, 
        collectionId: formState.selectedCollectionId || undefined,
        isListedForSale: !!formState.price,
      };

      const response = await apiClient.post<{ data: Nft }>('/nfts', payload);
      
      showToast({ type: 'success', text1: 'NFT Created!', text2: `"${response.data.data.title}" created successfully.` });
      setFormState({ title: '', description: '', price: '', imageUri: null, selectedCollectionId: undefined }); 
      
      // Navigate to NFT detail page
      if (response.data.data.slug || response.data.data.id) {
        navigation.replace('NftDetail', { nftId: response.data.data.slug || response.data.data.id });
      } else {
        navigation.goBack(); // Fallback
      }

    } catch (error: any) {
      setIsUploadingImage(false);
      const message = error instanceof ApiError ? error.data?.message || error.message : error.message || 'Failed to create NFT.';
      setFormError(message);
      showToast({ type: 'error', text1: 'Creation Failed', text2: message });
      console.error("Create NFT error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCollections && !userCollections.length) {
    return <LoadingIndicator fullScreen color={theme.colors.primary} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Create New NFT</Text>
      {formError && (
        <View style={styles.messageBannerError}>
          <AlertCircle size={18} color={theme.colors.destructiveForeground} style={{marginRight: theme.spacing.sm}}/>
          <Text style={styles.messageTextError}>{formError}</Text>
        </View>
      )}
      {/* {successMessage && ( // Replaced by toast
        <View style={styles.messageBannerSuccess}>
           <CheckCircle size={18} color={theme.colors.white} style={{marginRight: theme.spacing.sm}}/>
          <Text style={styles.messageTextSuccess}>{successMessage}</Text>
        </View>
      )} */}
      
      <AppInput label="Title *" value={formState.title} onChangeText={(val) => handleChange('title', val)} placeholder="e.g., My Amazing Artwork" disabled={isSubmitting} />
      <AppInput label="Description" value={formState.description} onChangeText={(val) => handleChange('description', val)} placeholder="Detailed description of your NFT..." multiline numberOfLines={4} disabled={isSubmitting}/>
      
      <View style={styles.imagePickerContainer}>
        <Text style={styles.label}>NFT Image *</Text>
        <AppButton title={formState.imageUri ? "Change Image" : "Select Image"} onPress={pickImage} variant="outline" disabled={isSubmitting} style={styles.imagePickerButton} leftIcon={<ImagePlus size={16} color={theme.colors.primary}/>} />
        {isUploadingImage && <View style={styles.uploadingContainer}><ActivityIndicator color={theme.colors.primary} style={{marginRight: 5}}/><Text style={styles.uploadingText}>Uploading image...</Text></View>}
        {formState.imageUri && (
          <View style={styles.imagePreviewContainer}>
            <RNImage source={{ uri: formState.imageUri }} style={styles.imagePreview} />
            <Text style={styles.imageUriText} numberOfLines={1}>Selected: {formState.imageUri.split('/').pop()}</Text>
          </View>
        )}
      </View>
      
      <AppInput label="Price (ETH, optional)" value={formState.price} onChangeText={(val) => handleChange('price', val)} placeholder="e.g., 0.5" keyboardType="numeric" disabled={isSubmitting}/>

      <Text style={styles.label}>Collection (Optional)</Text>
      {isLoadingCollections ? <ActivityIndicator color={theme.colors.primary} style={{marginVertical: 10}}/> :
        userCollections.length > 0 ? (
        <View style={styles.pickerContainer}>
            <Picker
            selectedValue={formState.selectedCollectionId}
            onValueChange={(itemValue) => handleChange('selectedCollectionId', itemValue as string)}
            style={styles.picker}
            enabled={!isSubmitting}
            itemStyle={Platform.OS === 'ios' ? { color: theme.colors.foreground } : {}}
            dropdownIconColor={theme.colors.mutedForeground}
            >
            <Picker.Item label="-- No Collection --" value="" style={styles.pickerItem} />
            {userCollections.map((collection) => (
                <Picker.Item key={collection.id} label={collection.name} value={collection.id} style={styles.pickerItem} />
            ))}
            </Picker>
        </View>
        ) : (
          <Text style={styles.noCollectionsText}>You haven't created any collections yet. <Text style={styles.linkText} onPress={() => navigation.navigate('CreateCollectionModal')}>Create one now?</Text></Text>
        )
      }

      <AppButton title="Create NFT" onPress={handleSubmit} isLoading={isSubmitting} disabled={isSubmitting || !formState.title || !formState.imageUri} style={styles.submitButton} />
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
  // messageBannerSuccess: { // Removed as toasts are used
  //   // ...
  // },
  // messageTextSuccess: { // Removed
  //   // ...
  // },
  imagePickerContainer: {
    marginBottom: theme.spacing.md,
  },
  imagePickerButton: {
    borderColor: theme.colors.accent,
    marginBottom: theme.spacing.sm,
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  imageUriText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    fontStyle: 'italic',
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  pickerContainer: {
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    height: Platform.OS === 'ios' ? undefined : 50, 
    justifyContent: Platform.OS === 'ios' ? undefined : 'center',
  },
  picker: {
    width: '100%',
    color: theme.colors.foreground,
  },
  pickerItem: { 
    color: theme.colors.foreground,
    backgroundColor: Platform.OS === 'ios' ? theme.colors.background : undefined, 
  },
  noCollectionsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  linkText: {
    color: theme.colors.accent,
    textDecorationLine: 'underline',
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

export default CreateNftScreen;
