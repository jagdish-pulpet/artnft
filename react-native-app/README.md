
# ArtNFT Marketplace - React Native Mobile App

This directory contains the React Native (Expo) mobile application for the ArtNFT Marketplace.

## Prerequisites

Before you begin, ensure you have the following installed:

1.  **Node.js and npm/yarn:**
    *   Node.js (LTS version recommended, e.g., v18.x or later). You can download it from [nodejs.org](https://nodejs.org/).
    *   npm is included with Node.js. Yarn is an alternative package manager.
2.  **Watchman (Recommended for macOS and Linux):**
    *   A file watching service. Install it via Homebrew on macOS: `brew install watchman`
    *   For Linux, follow instructions on the [Watchman installation guide](https://facebook.github.io/watchman/docs/install.html).
3.  **Java Development Kit (JDK):**
    *   Required for Android development. AdoptOpenJDK or Oracle JDK (version 11 or later recommended).
    *   Ensure `JAVA_HOME` environment variable is set.
4.  **Android Studio (for Android development):**
    *   Download from [developer.android.com/studio](https://developer.android.com/studio).
    *   Install the Android SDK, SDK Platforms, and SDK Build-Tools.
    *   Set up an Android Virtual Device (AVD) or connect a physical Android device for testing.
    *   Ensure `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) environment variable is set.
5.  **Xcode (for iOS development - macOS only):**
    *   Install from the Mac App Store.
    *   Install Xcode Command Line Tools: `xcode-select --install`
    *   Set up an iOS Simulator or connect a physical iOS device.
6.  **Expo Go App (Optional, for quick testing on physical devices):**
    *   Install the "Expo Go" app on your iOS or Android device from the App Store or Google Play Store. This allows you to run your app without needing a full native build initially.
7.  **Expo CLI (Globally or via npx):**
    ```bash
    npm install -g expo-cli
    # or use npx for commands: npx expo ...
    ```

## Getting Started

1.  **Navigate to the `react-native-app` directory:**
    ```bash
    cd path/to/artnft-marketplace/react-native-app
    ```

2.  **Install Dependencies:**
    If `node_modules` directory doesn't exist or you need to update dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set Up Environment Variables:**
    *   Copy the `.env.example` file to a new file named `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Open the `.env` file and configure the `API_URL` to point to your running ArtNFT backend API.
        Example:
        ```env
        API_URL=http://localhost:3001/api # For local backend
        # API_URL=https://your-deployed-backend.com/api # For deployed backend
        ```

4.  **Ensure Backend is Running:**
    The mobile app will need to communicate with your ArtNFT backend. Make sure the backend server (from the `artnft-backend/` directory) is running.

## Running the App

You have several options to run the app using Expo:

*   **Run on an Android Emulator/Device:**
    ```bash
    npm run android
    # or
    expo start --android
    ```
    (Ensure an emulator is running or a device is connected and recognized by ADB.)

*   **Run on an iOS Simulator/Device (macOS only):**
    ```bash
    npm run ios
    # or
    expo start --ios
    ```
    (Ensure a simulator is running or a device is connected.)

*   **Run in Expo Go (on a physical device):**
    1.  Start the Metro bundler:
        ```bash
        npm start
        # or
        expo start
        ```
    2.  The terminal will display a QR code.
    3.  Open the Expo Go app on your physical device and scan the QR code.

*   **Run in a Web Browser (for limited testing):**
    ```bash
    npm run web
    # or
    expo start --web
    ```
    (Note: This provides a web version of your React Native app and may not support all native features or render identically to mobile.)

## Project Structure Overview

*   `android/` & `ios/`: Native project files (mostly managed by Expo).
*   `src/`: Your main application source code.
    *   `api/`: API service for backend communication.
    *   `assets/`: Static assets like images, fonts.
    *   `components/`: Reusable UI components.
    *   `hooks/`: Custom React Hooks.
    *   `navigation/`: Navigation setup using React Navigation.
    *   `screens/`: Top-level screen components.
    *   `services/`: Other services (e.g., for native modules).
    *   `store/`: State management (Context API, Zustand, Redux, etc.).
    *   `styles/`: Global styles, theme configuration.
    *   `types/`: TypeScript type definitions.
    *   `utils/`: Utility functions.
*   `App.tsx`: The root component of your application.
*   `index.js`: The main entry point for React Native.
*   `babel.config.js`: Babel configuration (e.g., for `react-native-dotenv`).
*   `metro.config.js`: Configuration for the Metro bundler.
*   `package.json`: Project dependencies and scripts.
*   `tsconfig.json`: TypeScript configuration.

## Next Steps in Development

1.  **Implement Core Navigation:** Set up `AuthNavigator` and `AppNavigator` (or `MainTabNavigator`) in `src/navigation/`.
2.  **Develop UI Screens:** Build out the UI for screens like `WelcomeScreen`, `SignInScreen`, `SignUpScreen`, `HomeScreen`, `NftDetailScreen`, `ProfileScreen`, etc., using React Native components and your theme.
3.  **State Management:** Implement authentication state management (e.g., using `AuthContext` in `src/store/`) and integrate `useAuth` hook.
4.  **API Integration:** Connect screens to your backend API using the `apiService` to fetch and display data.
5.  **Component Library:** Decide if you want to use a React Native UI component library (e.g., React Native Paper, NativeBase) or build custom components.
6.  **Wallet Integration:** For wallet features, you'll need to integrate libraries like `@web3-react/core`, `ethers.js` (for React Native), or SDKs provided by wallet providers (e.g., WalletConnect SDK).
7.  **Testing:** Set up Jest for unit/component testing and consider an E2E testing framework like Detox or Maestro.

This README provides a starting point. You'll expand it as your mobile application develops.

    