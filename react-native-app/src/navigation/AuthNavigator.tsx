
// react-native-app/src/navigation/AuthNavigator.tsx
// Placeholder for the authentication flow navigator (Welcome, SignIn, SignUp screens)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
// Import ForgotPasswordScreen, VerifyEmailScreen when you create them

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword?: undefined; // Optional if you add it
  VerifyEmail?: { email: string }; // Optional if you add it
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
      {/* <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} /> */}
    </Stack.Navigator>
  );
};
export default AuthNavigator;

    