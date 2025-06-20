// react-native-app/src/screens/SettingsScreen.tsx
// Placeholder for app settings (e.g., theme, notifications, account management)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/common/Button';
import { theme } from '../styles/theme';
// import { useAuth } from '../hooks/useAuth';

const SettingsScreen = () => {
  // const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {/* Theme toggle, notification preferences, etc. */}
      <AppButton title="Log Out" onPress={() => console.log('Log Out')} variant="destructive" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
  }
});
export default SettingsScreen;
