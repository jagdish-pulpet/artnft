
// react-native-app/src/navigation/AppNavigator.tsx
// Placeholder for the main app navigator (after user is authenticated)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// Import your actual screens
import HomeScreen from '../screens/HomeScreen';
import NftDetailScreen from '../screens/NftDetailScreen';
import CollectionDetailScreen from '../screens/CollectionDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CreateNftScreen from '../screens/CreateNftScreen';
import CreateCollectionScreen from '../screens/CreateCollectionScreen';
// import MainTabNavigator from './MainTabNavigator'; // If you use a tab navigator as the base

import { Text, View, Button } from 'react-native'; // For placeholder screens

// Example: Define your screen params type
export type AppStackParamList = {
  // MainTabs: undefined; // If using MainTabNavigator as a screen
  Home: undefined;
  NftDetail: { nftId: string };
  CollectionDetail: { collectionId: string };
  Profile: { userId?: string }; // Optional userId to view other profiles
  EditProfile: undefined;
  CreateNft: undefined;
  CreateCollection: undefined;
  // ... more screens
};

const Stack = createStackNavigator<AppStackParamList>();

// Placeholder Screen Component
const PlaceholderScreen = ({ route }: { route: { name: string }}) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Screen: {route.name}</Text>
  </View>
);


const AppNavigator = () => {
  return (
    <Stack.Navigator 
        // initialRouteName="MainTabs" // If using tabs
        initialRouteName="Home"
        screenOptions={{
            headerStyle: { backgroundColor: '#673AB7' /* theme.colors.primary */ },
            headerTintColor: '#fff' /* theme.colors.primaryForeground */,
            headerTitleStyle: { fontWeight: 'bold' },
        }}
    >
      {/* <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Explore ArtNFT' }} />
      <Stack.Screen name="NftDetail" component={NftDetailScreen} options={({ route }) => ({ title: `NFT #${route.params.nftId.substring(0,6)}...` })} />
      <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} options={({ route }) => ({ title: `Collection` })} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={({ route }) => ({ title: route.params?.userId ? 'User Profile' : 'My Profile' })}/>
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="CreateNft" component={CreateNftScreen} options={{ title: 'Create NFT' }} />
      <Stack.Screen name="CreateCollection" component={CreateCollectionScreen} options={{ title: 'Create Collection' }} />
    </Stack.Navigator>
  );
};
export default AppNavigator;

    