
// react-native-app/src/screens/SignUpScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput as RNTextInput } from 'react-native';
import AppInput from '../components/common/Input';
import AppButton from '../components/common/Button';
import { theme } from '../styles/theme';
import type { AuthScreenProps } from '../navigation/types';
import { useAuth } from '../store/authContext';
import { ApiError } from '../api/apiService';
import { ArrowLeft, AlertCircle } from 'lucide-react-native';

type SignUpScreenProps = AuthScreenProps<'SignUp'>;

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
  const { signup, isLoading: isAuthLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const emailInputRef = useRef<RNTextInput>(null);
  const passwordInputRef = useRef<RNTextInput>(null);
  const walletAddressInputRef = useRef<RNTextInput>(null);

  const handleSignUp = async () => {
    if (!username || !email || !password || !walletAddress) {
        setError("All fields are required.");
        return;
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    // Basic password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    // Basic wallet address check (simple regex)
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      setError("Please enter a valid Ethereum wallet address.");
      return;
    }


    setIsSubmitting(true);
    setError(null);
    try {
      await signup(username, email, password, walletAddress);
      // On successful signup, AuthContext's useEffect will handle navigation
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.data?.message || err.message || 'Sign up failed. Please try again.');
      } else {
         setError('An unexpected error occurred. Please try again.');
      }
      console.error("Sign up error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isAuthLoading;

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
    >
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} disabled={isLoading}>
            <ArrowLeft size={24} color={theme.colors.primary} />
            <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
        {error && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color={theme.colors.destructiveForeground} style={{marginRight: theme.spacing.xs}}/>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <AppInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            disabled={isLoading}
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current?.focus()}
        />
        <AppInput
            ref={emailInputRef}
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
            disabled={isLoading}
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
        />
        <AppInput
            ref={passwordInputRef}
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Create a strong password (min 8 chars)"
            disabled={isLoading}
            returnKeyType="next"
            onSubmitEditing={() => walletAddressInputRef.current?.focus()}
        />
        <AppInput
            ref={walletAddressInputRef}
            label="Wallet Address"
            value={walletAddress}
            onChangeText={setWalletAddress}
            placeholder="0x..."
            autoCapitalize="none"
            disabled={isLoading}
            returnKeyType="done"
            onSubmitEditing={handleSignUp}
        />
        <AppButton 
            title="Sign Up" 
            onPress={handleSignUp} 
            isLoading={isLoading} 
            disabled={isLoading || !username || !email || !password || !walletAddress} 
            style={styles.signUpButton}
        />
        
        <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')} disabled={isLoading}>
            <Text style={[styles.linkText, styles.signInLink]}>Sign In</Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30, 
    left: theme.spacing.md,
    padding: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.base,
    marginLeft: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.destructive,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.destructiveForeground,
    fontSize: theme.fontSize.sm,
    flexShrink: 1,
  },
  signUpButton: {
    marginTop: theme.spacing.sm,
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
