
// react-native-app/src/screens/SignInScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import AuthForm from '../components/auth/AuthForm'; // Assuming AuthForm handles sign-in fields
import AppInput from '../components/common/Input';
import AppButton from '../components/common/Button';
import { theme } from '../styles/theme';
import type { AuthScreenProps } from '../navigation/types';
// import { useAuth } from '../hooks/useAuth'; // Import your auth hook

// type SignInScreenProps = AuthScreenProps<'SignIn'>;

const SignInScreen = (/*{ navigation }: SignInScreenProps*/) => {
  // const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // await login({ email, password }); // Assuming login takes an object
      // navigation.navigate('App'); // Or wherever successful login leads
      console.log('Attempting sign in with:', email, password);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // if (success) navigation.replace('AppNavigator', { screen: 'Home'}); else setError...
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
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
        placeholder="••••••••"
        disabled={isLoading}
      />
      <AppButton title="Sign In" onPress={handleSignIn} isLoading={isLoading} disabled={isLoading} />
      
      <TouchableOpacity onPress={() => console.log('Navigate to Forgot Password')} /* navigation.navigate('ForgotPassword') */ style={styles.linkContainer}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => console.log('Navigate to Sign Up')} /* navigation.navigate('SignUp') */>
          <Text style={[styles.linkText, styles.signUpLink]}>Sign Up</Text>
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
  linkContainer: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  linkText: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.sm,
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
  signUpLink: {
    marginLeft: theme.spacing.xs,
    fontWeight: 'bold',
  }
});

export default SignInScreen;

    