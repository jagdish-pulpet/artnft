
// react-native-app/src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator, { type MainTabParamList } from './MainTabNavigator';
import NftDetailScreen from '../screens/NftDetailScreen';
import CollectionDetailScreen from '../screens/CollectionDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CreateNftScreen from '../screens/CreateNftScreen';
import CreateCollectionScreen from '../screens/CreateCollectionScreen';
import { theme } from '../styles/theme';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>; 
  NftDetail: { nftId: string };
  CollectionDetail: { collectionId: string };
  EditProfile: undefined;
  CreateNftModal: undefined; 
  CreateCollectionModal: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator 
        initialRouteName="MainTabs"
        screenOptions={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: theme.colors.primaryForeground,
            headerTitleStyle: { fontWeight: 'bold' },
            headerBackTitleVisible: false, // Common practice on iOS
        }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen 
        name="NftDetail" 
        component={NftDetailScreen} 
        options={({ route }) => ({ 
            title: `NFT Detail`, // Title set in screen or dynamic
        })} 
      />
      <Stack.Screen 
        name="CollectionDetail" 
        component={CollectionDetailScreen} 
        options={{ title: `Collection Detail` }}  // Title set in screen or dynamic
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Edit Profile' }} 
      />
      <Stack.Screen 
        name="CreateNftModal" 
        component={CreateNftScreen} 
        options={{ 
            title: 'Create New NFT',
            presentation: 'modal', // iOS-style modal presentation
        }} 
      />
      <Stack.Screen 
        name="CreateCollectionModal" 
        component={CreateCollectionScreen} 
        options={{ 
            title: 'Create New Collection',
            presentation: 'modal',
        }} 
      />
    </Stack.Navigator>
  );
};
export default AppNavigator;
