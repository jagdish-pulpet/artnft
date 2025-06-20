
// react-native-app/src/navigation/MainTabNavigator.tsx
import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'; 
import CollectionListScreen from '../screens/CollectionListScreen';
import CreateNftScreen from '../screens/CreateNftScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { theme } from '../styles/theme';
import { Home, LayoutGrid, PlusCircle, User } from 'lucide-react-native';

export type MainTabParamList = {
  HomeTab: undefined; 
  CollectionsTab: undefined;
  CreateTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'HomeTab') return <Home color={color} size={size} strokeWidth={focused ? 2.5 : 2} />;
          if (route.name === 'CollectionsTab') return <LayoutGrid color={color} size={size} strokeWidth={focused ? 2.5 : 2} />;
          if (route.name === 'CreateTab') return <PlusCircle color={color} size={size} strokeWidth={focused ? 2.5 : 2} />;
          if (route.name === 'ProfileTab') return <User color={color} size={size} strokeWidth={focused ? 2.5 : 2} />;
          return null;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedForeground,
        tabBarStyle: { 
            backgroundColor: theme.colors.card, 
            borderTopColor: theme.colors.border,
            paddingBottom: Platform.OS === 'ios' ? 20 : 5, // Adjust for notch or safe area if needed
            paddingTop: 5,
            height: Platform.OS === 'ios' ? 80 : 60, // Taller for iOS safe area
        },
        tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
            marginBottom: Platform.OS === 'ios' ? -5 : 5, // Adjust label position for iOS
        },
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.primaryForeground,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShown: true, // Show headers for tab screens by default
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Explore' }} />
      <Tab.Screen name="CollectionsTab" component={CollectionListScreen} options={{ title: 'Collections' }} />
      <Tab.Screen name="CreateTab" component={CreateNftScreen} options={{ title: 'Create' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
