
// react-native-app/src/components/common/EmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';
// import { PackageOpen } from 'lucide-react-native'; // Example, if using lucide-react-native

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode; // Pass an icon component if desired
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon }) => {
  return (
    <View style={styles.container}>
      {icon ? icon : <Text style={styles.iconPlaceholder}> कोई सामग्री नहीं </Text> /* Placeholder Icon */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  iconPlaceholder: {
    fontSize: 48,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.foreground,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontSize: theme.fontSize.base,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
});

export default EmptyState;

    