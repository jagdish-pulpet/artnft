
// react-native-app/src/screens/SignUpScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppInput from '../components/common/Input';
import AppButton from '../components/common/Button';
import { theme } from '../styles/theme';
import type { AuthScreenProps } from '../navigation/types';
// import { useAuth } from '../hooks/useAuth';

// type SignUpScreenProps = AuthScreenProps<'SignUp'>;

const SignUpScreen = (/*{ navigation }: SignUpScreenProps*/) => {
  // const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // await signup({ username, email, password, walletAddress }); // Adjust payload as per your auth hook
      // navigation.replace('AppNavigator', { screen: 'Home'}); // Or to email verification
      console.log('Attempting sign up with:', username, email, password, walletAddress);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <AppInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Choose a username"
        disabled={isLoading}
      />
      <AppInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="you@example.com"
        disabled={isLoading}
      />
      <AppInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Create a strong password"
        disabled={isLoading}
      />
      <AppInput
        label="Wallet Address"
        value={walletAddress}
        onChangeText={setWalletAddress}
        placeholder="0x..."
        disabled={isLoading}
      />
      <AppButton title="Sign Up" onPress={handleSignUp} isLoading={isLoading} disabled={isLoading} />
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => console.log('Navigate to Sign In')} /* navigation.navigate('SignIn') */>
          <Text style={[styles.linkText, styles.signInLink]}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  errorText: {
    color: theme.colors.destructive,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  footer: {
    marginTop: theme.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
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
    marginLeft: theme.spacing.xs,
    fontWeight: 'bold',
  }
});

export default SignUpScreen;

    