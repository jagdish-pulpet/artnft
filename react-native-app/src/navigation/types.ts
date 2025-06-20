
// react-native-app/src/navigation/types.ts
// Central place for navigation-related type definitions

// Import param lists from your navigators
import type { StackScreenProps as RNScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps as RNBottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { AppStackParamList } from './AppNavigator';
import type { AuthStackParamList } from './AuthNavigator';
import type { MainTabParamList } from './MainTabNavigator'; // If you implement tabs

// Combine all stack param lists if needed for nested navigators
// This is useful if you have navigators nested within other navigators
// For simple cases, you might not need a combined RootStackParamList
export type RootStackParamList = AuthStackParamList & AppStackParamList; // Example combination

// Screen prop types for Stack Navigators
export type AppScreenProps<T extends keyof AppStackParamList> = RNScreenProps<AppStackParamList, T>;
export type AuthScreenProps<T extends keyof AuthStackParamList> = RNScreenProps<AuthStackParamList, T>;

// Screen prop types for Bottom Tab Navigator
export type MainTabScreenProps<T extends keyof MainTabParamList> = RNBottomTabScreenProps<MainTabParamList, T>;


// Example usage for a specific screen:
// import type { AuthScreenProps } from './types';
// type WelcomeScreenNavigationProp = AuthScreenProps<'Welcome'>['navigation'];
// type WelcomeScreenRouteProp = AuthScreenProps<'Welcome'>['route'];

// This file helps in maintaining type safety across your navigation setup.

    