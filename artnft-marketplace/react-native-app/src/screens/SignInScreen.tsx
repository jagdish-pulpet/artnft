
// react-native-app/src/screens/SignInScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput as RNTextInput } from 'react-native';
import AppInput from '../components/common/Input';
import AppButton from '../components/common/Button';
import { theme } from '../styles/theme';
import type { AuthScreenProps } from '../navigation/types';
import { useAuth } from '../store/authContext';
import { ApiError } from '../api/apiService';
import { ArrowLeft, AlertCircle } from 'lucide-react-native';

type SignInScreenProps = AuthScreenProps<'SignIn'>;

const SignInScreen = ({ navigation }: SignInScreenProps) => {
  const { login, isLoading: isAuthLoading } = useAuth(); // Use isLoading from auth context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const passwordInputRef = useRef<RNTextInput>(null);

  const handleSignIn = async () => {
    if (!email || !password) {
        setError("Email and password are required.");
        return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await login(email, password, false);
      // On successful login, AuthContext's useEffect will handle navigation via RootNavigator
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.data?.message || err.message || 'Sign in failed. Please check your credentials.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error("Sign in error:", err);
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
        <Text style={styles.title}>Sign In</Text>
        {error && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color={theme.colors.destructiveForeground} style={{marginRight: theme.spacing.xs}}/>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <AppInput
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
            placeholder="••••••••"
            disabled={isLoading}
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
        />
        <AppButton title="Sign In" onPress={handleSignIn} isLoading={isLoading} disabled={isLoading || !email || !password} style={styles.signInButton} />
        
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.linkContainer} disabled={isLoading}>
            <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={isLoading}>
            <Text style={[styles.linkText, styles.signUpLink]}>Sign Up</Text>
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
  signInButton: {
    marginTop: theme.spacing.sm,
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
