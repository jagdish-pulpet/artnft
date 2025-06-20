
// react-native-app/src/screens/WelcomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AppButton from '../components/common/Button';
// import WalletButtons from '../components/auth/WalletButtons'; // If you create specific WalletButtons
import { theme } from '../styles/theme';
import type { AuthScreenProps } from '../navigation/types'; // For navigation prop typing

// type WelcomeScreenProps = AuthScreenProps<'Welcome'>;

const WelcomeScreen = (/*{ navigation }: WelcomeScreenProps*/) => {
  return (
    <View style={styles.container}>
      {/* Placeholder for Logo */}
      {/* <Image source={require('../assets/images/logo.png')} style={styles.logoImage} /> */}
      <Text style={styles.logoText}>ArtNFT</Text>
      <Text style={styles.tagline}>Discover, Collect, and Trade Unique Digital Art.</Text>
      
      <View style={styles.buttonContainer}>
        <AppButton
          title="Connect with MetaMask" // Example
          onPress={() => console.log('Connect MetaMask (RN)')}
          // leftIcon={<MetaMaskIcon />} // Example if you have icons
          style={styles.walletButton}
        />
        <AppButton
          title="Connect with WalletConnect" // Example
          onPress={() => console.log('Connect WalletConnect (RN)')}
          variant="outline"
          // leftIcon={<WalletConnectIcon />} // Example
          style={styles.walletButton}
        />
        <AppButton
          title="Sign Up with Email"
          onPress={() => console.log('Navigate to SignUp')} // navigation.navigate('SignUp')
          variant="outline"
          style={styles.emailButton}
        />
        <AppButton
          title="Already have an account? Sign In"
          onPress={() => console.log('Navigate to SignIn')} // navigation.navigate('SignIn')
          variant="link"
          style={styles.signInLink}
          textStyle={styles.signInLinkText}
        />
      </View>
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
    // fontFamily: 'YourHeadlineFont' // if custom fonts are loaded
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.md,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 340,
  },
  walletButton: {
    marginBottom: theme.spacing.md,
  },
  emailButton: {
    marginTop: theme.spacing.sm, // Little space after wallet buttons
    borderColor: theme.colors.accent, // Example: Use accent for email outline
  },
  signInLink: {
    marginTop: theme.spacing.lg,
  },
  signInLinkText: {
    color: theme.colors.accent, // Ensure link text color matches variant intention
  }
});

export default WelcomeScreen;

    