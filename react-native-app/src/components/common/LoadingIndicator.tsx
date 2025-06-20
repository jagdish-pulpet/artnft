
// react-native-app/src/components/common/LoadingIndicator.tsx
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  style?: object;
  fullScreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'large',
  color = theme.colors.primary,
  style,
  fullScreen = false,
}) => {
  return (
    <View style={[fullScreen ? styles.fullScreenContainer : styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background, // Optional: for full screen loading
  }
});

export default LoadingIndicator;

    