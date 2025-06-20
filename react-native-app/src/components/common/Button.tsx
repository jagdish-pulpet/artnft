
// react-native-app/src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../styles/theme'; // Assuming a theme file

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AppButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled,
  isLoading,
  leftIcon,
  rightIcon,
}) => {
  const baseButtonStyle = styles.button;
  const baseTextStyle = styles.text;

  let variantButtonStyle: ViewStyle = {};
  let variantTextStyle: TextStyle = {};

  switch (variant) {
    case 'primary':
      variantButtonStyle = styles.primaryButton;
      variantTextStyle = styles.primaryText;
      break;
    case 'secondary':
      variantButtonStyle = styles.secondaryButton;
      variantTextStyle = styles.secondaryText;
      break;
    case 'outline':
      variantButtonStyle = styles.outlineButton;
      variantTextStyle = styles.outlineText;
      break;
    case 'ghost':
      variantButtonStyle = styles.ghostButton;
      variantTextStyle = styles.ghostText;
      break;
    case 'link':
      variantButtonStyle = styles.linkButton;
      variantTextStyle = styles.linkText;
      break;
    case 'destructive':
      variantButtonStyle = styles.destructiveButton;
      variantTextStyle = styles.destructiveText;
      break;
  }

  return (
    <TouchableOpacity
      style={[baseButtonStyle, variantButtonStyle, disabled || isLoading ? styles.disabled : {}, style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'destructive' ? theme.colors.white : theme.colors.primary} />
      ) : (
        <>
          {leftIcon && leftIcon}
          <Text style={[baseTextStyle, variantTextStyle, textStyle]}>{title}</Text>
          {rightIcon && rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.md,
    minHeight: 48,
  },
  text: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 8, // if icons are present
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  primaryText: {
    color: theme.colors.primaryForeground,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  secondaryText: {
    color: theme.colors.secondaryForeground,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  outlineText: {
    color: theme.colors.primary, // Or theme.colors.foreground for more general outline
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: theme.colors.primary,
  },
  linkButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: undefined,
  },
  linkText: {
    color: theme.colors.accent,
    textDecorationLine: 'underline',
    fontSize: theme.fontSize.sm,
  },
  destructiveButton: {
    backgroundColor: theme.colors.destructive,
  },
  destructiveText: {
      color: theme.colors.destructiveForeground,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default AppButton;

    