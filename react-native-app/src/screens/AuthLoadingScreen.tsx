// react-native-app/src/screens/AuthLoadingScreen.tsx
// Placeholder for a screen that checks auth state on app start and navigates accordingly
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import { useAuth } from '../hooks/useAuth';
// import type { NavigationProp } from '@react-navigation/native'; // For navigation

const AuthLoadingScreen = (/*{ navigation }: { navigation: NavigationProp<any> }*/) => {
  // const { isLoading, isAuthenticated } = useAuth();

  // useEffect(() => {
  //   if (!isLoading) {
  //     navigation.navigate(isAuthenticated ? 'App' : 'Auth'); // Navigate to App or Auth stack
  //   }
  // }, [isLoading, isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default AuthLoadingScreen;
