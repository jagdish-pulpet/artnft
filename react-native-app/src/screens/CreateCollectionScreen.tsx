// react-native-app/src/screens/CreateCollectionScreen.tsx
// Placeholder for Create Collection Screen
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
// import CreateCollectionForm from '../components/collection/CreateCollectionForm'; // You would create this

const CreateCollectionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Collection</Text>
      {/* <CreateCollectionForm /> */}
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

export default CreateCollectionScreen;
