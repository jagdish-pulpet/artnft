
// react-native-app/src/screens/WelcomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AppButton from '../components/common/Button';
import { theme } from '../styles/theme';
import type { AuthScreenProps } from '../navigation/types'; 
import WalletButtons from '../components/auth/WalletButtons';
import { Mail } from 'lucide-react-native';
import { useAuth } from '../store/authContext'; // For isAuthLoading

type WelcomeScreenProps = AuthScreenProps<'Welcome'>;

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const [authError, setAuthError] = useState<string | null>(null);
  const { isLoading } = useAuth(); // Use isLoading from auth context

  const handleAuthSuccess = () => {
    // Navigation is handled by AuthContext's useEffect which triggers RootNavigator re-render
    console.log("Wallet auth successful from WelcomeScreen");
    setAuthError(null); // Clear any previous errors
  };

  const handleAuthError = (message: string) => {
    setAuthError(message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>ArtNFT</Text>
      <Text style={styles.tagline}>Discover, Collect, and Trade Unique Digital Art.</Text>
      
      {authError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{authError}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <WalletButtons 
            onAuthSuccess={handleAuthSuccess} 
            onAuthError={handleAuthError} 
        />

        <AppButton
          title="Sign Up with Email"
          onPress={() => { setAuthError(null); navigation.navigate('SignUp'); }}
          variant="outline"
          style={styles.emailButton}
          leftIcon={<Mail size={18} color={theme.colors.accent} />}
          disabled={isLoading}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.signInLinkContainer} 
        onPress={() => { setAuthError(null); navigation.navigate('SignIn'); }}
        disabled={isLoading}
      >
        <Text style={styles.footerText}>Already have an account? </Text>
        <Text style={[styles.linkText, styles.signInLink]}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  errorBanner: {
    width: '100%',
    maxWidth: 340,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.destructive,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  errorText: {
    color: theme.colors.destructiveForeground,
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 340,
  },
  emailButton: {
    marginTop: theme.spacing.md, 
    borderColor: theme.colors.accent,
  },
  signInLinkContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.mutedForeground,
    fontSize: theme.fontSize.sm,
  },
  linkText: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.sm,
  },
  signInLink: {
    fontWeight: 'bold',
  }
});

export default WelcomeScreen;
