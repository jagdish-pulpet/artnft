
// react-native-app/src/components/common/Input.tsx
// Placeholder for a reusable Input component
import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
import { theme } from '../../styles/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const AppInput: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : {}, style]}
        placeholderTextColor={theme.colors.mutedForeground}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    color: theme.colors.foreground,
    fontSize: theme.fontSize.base,
  },
  inputError: {
    borderColor: theme.colors.destructive,
  },
  errorText: {
    color: theme.colors.destructive,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
  },
});

export default AppInput;

    