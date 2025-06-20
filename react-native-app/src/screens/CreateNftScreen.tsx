// react-native-app/src/screens/CreateNftScreen.tsx
// Placeholder for Create NFT Screen
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
// import CreateNftForm from '../components/nft/CreateNftForm'; // You would create this

const CreateNftScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New NFT</Text>
      {/* <CreateNftForm /> */}
    </View>
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

export default CreateNftScreen;
