
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
    If `node_modules` directory doesn't exist or you need to update dependencies (after pulling changes or for the first time):
    ```bash
    npm install
    # or
    # yarn install
    ```
    Key dependencies being installed (see `package.json` for full list):
    *   `expo`, `expo-image-picker`, `expo-status-bar`
    *   `react`, `react-native`
    *   `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`
    *   `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler`
    *   `axios` (for API calls)
    *   `react-native-dotenv` (for environment variables)
    *   `@react-native-async-storage/async-storage` (for local storage, e.g., auth tokens)
    *   `lucide-react-native` (for icons)
    *   `@walletconnect/react-native-dapp` (for WalletConnect integration)
    *   `react-native-modal` (dependency for `@walletconnect/react-native-dapp`)
    *   `react-native-get-random-values` (polyfill for crypto operations)
    *   `ethers` (v5, for wallet utilities like message hex encoding)
    *   `@react-native-picker/picker` (for dropdown/select inputs)
    *   `react-native-toast-message` (for toast notifications)

3.  **Set Up Environment Variables:**
    *   Copy the `.env.example` file to a new file named `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Open the `.env` file and configure the `API_URL` to point to your running ArtNFT backend API.
        Example:
        ```env
        # react-native-app/.env
        API_URL=http://localhost:3001/api # For local backend on same machine with iOS Simulator or web
        # If using Android Emulator, localhost for the host machine is typically 10.0.2.2:
        # API_URL=http://10.0.2.2:3001/api 
        # API_URL=https://your-deployed-backend.com/api # For deployed backend
        ```
    *   Ensure `babel.config.js` is configured for `react-native-dotenv` (it should be).

4.  **Deep Linking for WalletConnect (CRITICAL):**
    *   For WalletConnect to redirect back to your app after interaction with a mobile wallet, you **must** configure deep linking.
    *   **Choose a unique URL scheme** for your app (e.g., `artnftmarketplace`).
    *   **Expo Managed Workflow:**
        *   Open `app.json` (or `app.config.js`/`app.config.ts`) in the `react-native-app` directory.
        *   Add or update the `scheme` property:
            ```json
            {
              "expo": {
                "name": "ArtNFT Marketplace",
                "slug": "artnft-marketplace-app",
                "scheme": "artnftmarketplace", // Your chosen scheme
                // ... other configurations ...
              }
            }
            ```
    *   **Bare React Native Workflow (if you eject from Expo):**
        *   **iOS:** Configure `CFBundleURLTypes` in `ios/YourAppName/Info.plist`.
        *   **Android:** Add an `intent-filter` to your main `Activity` in `android/app/src/main/AndroidManifest.xml`.
    *   **Update `App.tsx`**:
        *   Ensure the `SCHEME` constant in `react-native-app/App.tsx` matches your chosen scheme. The `REDIRECT_URL` will be derived from this.

5.  **Image Picker Permissions (iOS & Android):**
    *   `expo-image-picker` requires permissions to access the user's photo library and optionally the camera.
    *   **Expo Managed Workflow:**
        *   Add the `expo-image-picker` plugin to your `app.json` (or `app.config.js`/`app.config.ts`) to configure native permissions strings.
        *   Update `app.json` -> `expo.plugins` section:
            ```json
            {
              "expo": {
                // ... other configurations
                "plugins": [
                  // ... other plugins
                  [
                    "expo-image-picker",
                    {
                      "photosPermission": "ArtNFT Marketplace needs access to your photo library to allow you to select images for NFTs, collections, and your profile.",
                      "cameraPermission": "ArtNFT Marketplace needs access to your camera to allow you to take photos for NFTs, collections, and your profile."
                    }
                  ]
                ]
              }
            }
            ```
        *   When you build your app (`expo prebuild` or during a build with EAS Build), these permissions will be added to the native `Info.plist` (iOS) and `AndroidManifest.xml` (Android). If you are only using `launchImageLibraryAsync`, `cameraPermission` might not be strictly necessary but it's good practice to include if you might add camera capture later.
    *   The code in screens like `CreateNftScreen.tsx` uses `ImagePicker.requestMediaLibraryPermissionsAsync()` to ask for permission at runtime if not already granted.

6.  **Ensure Backend is Running:**
    The mobile app will need to communicate with your ArtNFT backend. Make sure the backend server (from the `artnft-backend/` directory) is running and accessible from your mobile device/emulator at the `API_URL` you configured.

## Running the App

You have several options to run the app using Expo:

*   **Run on an Android Emulator/Device:**
    ```bash
    npm run android
    # or
    # expo start --android
    ```
    (Ensure an emulator is running or a device is connected and recognized by ADB.)

*   **Run on an iOS Simulator/Device (macOS only):**
    ```bash
    npm run ios
    # or
    # expo start --ios
    ```
    (Ensure a simulator is running or a device is connected.)

*   **Run in Expo Go (on a physical device):**
    1.  Start the Metro bundler:
        ```bash
        npm start
        # or
        # expo start
        ```
    2.  The terminal will display a QR code.
    3.  Open the Expo Go app on your physical device and scan the QR code. (Ensure your device and development machine are on the same Wi-Fi network).

*   **Run in a Web Browser (for limited testing, some native features like WalletConnect deep linking might behave differently):**
    ```bash
    npm run web
    # or
    # expo start --web
    ```

## Project Structure Overview

*   `android/` & `ios/`: Native project files (mostly managed by Expo).
*   `src/`: Your main application source code.
    *   `api/`: API service (`apiService.ts`) for backend communication.
    *   `assets/`: Static assets like images, fonts.
    *   `components/`: Reusable UI components (common, auth, nft, collection specific).
    *   `hooks/`: Custom React Hooks (e.g., `useAuth.ts`, `useToast.ts`).
    *   `navigation/`: Navigation setup using React Navigation (`AppNavigator.tsx`, `AuthNavigator.tsx`, `MainTabNavigator.tsx`, `types.ts`).
    *   `screens/`: Top-level screen components.
    *   `services/`: Other services (e.g., `imageUploadService.ts`).
    *   `store/`: State management (`authContext.tsx`).
    *   `styles/`: Global styles, theme configuration (`theme.ts`).
    *   `types/`: TypeScript type definitions (`entities.ts`, `api.ts`).
    *   `utils/`: Utility functions (`helpers.ts`, `storage.ts`).
*   `App.tsx`: The root component of your application, sets up providers (WalletConnect, Auth, Toast) and root navigator.
*   `index.js`: The main entry point for React Native (includes polyfill for `react-native-get-random-values`).
*   `babel.config.js`: Babel configuration (e.g., for `react-native-dotenv`).
*   `metro.config.js`: Configuration for the Metro bundler.
*   `package.json`: Project dependencies and scripts.
*   `tsconfig.json`: TypeScript configuration.
*   `.env.example` & `.env`: Environment variable configuration.
*   `app.json` (or `app.config.js`): Expo configuration file (scheme for deep linking, plugins for permissions).

## Testing Form Submissions & Image Uploads

*   **Unit/Component Tests:**
    *   Mock the `imageUploadService` and `apiClient` to test form components in isolation. Verify form validation, state updates, and that correct payloads are constructed.
    *   Mock `expo-image-picker` for tests involving image selection.
*   **Integration Tests:**
    *   Test the full flow from image selection (mocking `expo-image-picker`), through form input, to the `handleSubmit` function calling the (mocked) services (`imageUploadService`, `apiClient`).
*   **E2E Tests (Detox/Maestro):**
    *   Simulate actual image picking from the device gallery (if testing framework supports it, or use pre-loaded images in emulator).
    *   Fill out forms and submit.
    *   Verify that new NFTs/Collections appear in lists or that profiles are updated (requires a test backend or mocked API responses at the E2E level).

## Security Considerations for File Uploads

*   **Server-Side Validation (Backend):** The backend (`artnft-backend`) **must** perform its own validation on uploaded files:
    *   **File Type Validation:** Check MIME types again on the server. Don't rely solely on client-side `Content-Type` headers.
    *   **File Size Limits:** Enforce maximum file sizes on the server to prevent abuse (current backend Multer config has a 10MB limit).
    *   **Content Scanning:** For production, consider integrating services to scan uploads for malware or inappropriate content.
    *   **Sanitize Filenames:** Ensure filenames are sanitized to prevent path traversal or other injection attacks when storing files. (Current backend implementation uses UUIDs for filenames, which is good).
*   **Secure Storage:** Use Firebase Storage (or your chosen provider) security rules to restrict access to uploaded files as needed.
*   **Authentication:** Ensure that only authenticated users can upload files, and associate uploads with the correct user account (current backend `upload/image` route is protected by `authMiddleware`).

## Key End-to-End Testing Scenarios (Mobile App)

Once the core features are implemented, perform thorough E2E testing:

1.  **Authentication & Account Management:**
    *   Successful email/password signup and login.
    *   Failed login attempts (wrong password, non-existent email).
    *   **Wallet Sign-In (WalletConnect via Mobile Wallet):**
        *   User successfully connects a mobile wallet (e.g., MetaMask Mobile, Trust Wallet) via WalletConnect.
        *   Verify deep linking works correctly.
        *   User successfully signs the message via the mobile wallet.
        *   User cancels connection from the WalletConnect modal or from the mobile wallet.
        *   User rejects message signing from the mobile wallet.
    *   Logout functionality.
    *   View user profile (own and others).
    *   **Edit user profile:** Update username, bio, avatar/cover images (test image picking and upload).
    *   (When implemented) Password reset flow.

2.  **NFT Management:**
    *   View lists of NFTs (e.g., on Home screen, Collection Detail screen, Profile tabs) with correct data from backend. Test pagination and pull-to-refresh.
    *   View NFT detail screen.
    *   **Create an NFT:** Including image selection/upload and assigning to a collection. Verify navigation to NFT detail page after creation.
    *   (When implemented) List an NFT for sale.
    *   (When implemented) Favorite/unfavorite an NFT.

3.  **Collection Management:**
    *   View list of collections. Test pagination and pull-to-refresh.
    *   View collection detail screen (including its NFTs).
    *   **Create a new collection:** Including image selections (logo, cover) and uploads. Verify navigation to Collection detail page after creation.

4.  **Offer Management:**
    *   Make an offer on an NFT (UI placeholder for now, needs implementation).
    *   View offers made and received on profile tabs.
    *   Accept/reject/cancel offers from the profile screen and verify UI updates & toast notifications.

5.  **Navigation & Usability:**
    *   Verify all navigation paths (tabs, stacks, modals).
    *   Check for UI consistency across screens.
    *   Test loading states (skeletons, spinners) and error message displays (toasts, inline alerts).
    *   Ensure responsiveness on different device sizes (if not using fixed-size emulators).
    *   Test pull-to-refresh functionality on lists.
    *   Test toast notifications for various actions.

## Notes on WalletConnect with `@walletconnect/react-native-dapp`

*   **Deep Linking is Crucial**: For WalletConnect to return to your app after interaction with a mobile wallet, deep linking must be configured correctly for your app (see "Deep Linking for WalletConnect" above).
*   **`ethers` for message formatting**: The example uses `ethers.utils.hexlify(ethers.utils.toUtf8Bytes(originalMessage))` because some wallets expect the message for `personal_sign` to be in hex format when coming from WalletConnect. Ensure `ethers` (v5 used here) is installed.
*   **Library Status**: `@walletconnect/react-native-dapp` is an older library. For new projects or if you encounter issues, consider WalletConnect's newer SDKs (`@walletconnect/modal-react-native` from Web3Modal) which might offer more up-to-date features and easier integration. However, this setup uses the specified library.
*   **Error Handling**: WalletConnect interactions can have various failure points. Robust error handling and clear user feedback are important.

This README provides a starting point. You'll expand it as your mobile application develops.
