// react-native-app/src/screens/EditProfileScreen.tsx
// Placeholder for Edit Profile Screen
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AppInput from '../components/common/Input';
import AppButton from '../components/common/Button';
import { theme } from '../styles/theme';

const EditProfileScreen = () => {
  // Form handling for username, bio, avatar, cover, social links
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      {/* <AppInput label="Username" value={""} onChangeText={() => {}} />
      <AppInput label="Bio" multiline value={""} onChangeText={() => {}} />
      <AppButton title="Save Changes" onPress={() => {}} /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary,
  },
});

export default EditProfileScreen;
