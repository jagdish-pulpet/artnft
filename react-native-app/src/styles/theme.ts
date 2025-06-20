
// react-native-app/src/styles/theme.ts
// Define your app's theme (colors, fonts, spacing) here
// This should ideally align with your web app's Tailwind theme for consistency

// Web App Colors (from globals.css for reference):
// Primary: hsl(263 59% 56%) /* Purple #673AB7 */
// Background: hsl(233 67% 94%) /* Light Blue #E8EAF6 */
// Accent/Secondary: hsl(174 44% 51%) /* Teal #4DB6AC */

// Helper to convert HSL to HEX (basic version, consider a library for full accuracy if needed)
// function hslToHex(h, s, l) {
//   l /= 100;
//   const a = s * Math.min(l, 1 - l) / 100;
//   const f = n => {
//     const k = (n + h / 30) % 12;
//     const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
//     return Math.round(255 * color).toString(16).padStart(2, '0');
//   };
//   return `#${f(0)}${f(8)}${f(4)}`;
// }

const palette = {
  // Based on web app's globals.css
  primaryPurple: '#673AB7', // hsl(263 59% 56%)
  primaryPurpleForeground: '#F8F7FC', // Lighter for text on primaryPurple

  backgroundLightBlue: '#E8EAF6', // hsl(233 67% 94%)
  backgroundLightBlueForeground: '#2C3A7E', // Darker blue-gray for text on lightBlue (derived)

  accentTeal: '#4DB6AC', // hsl(174 44% 51%)
  accentTealForeground: '#FFFFFF', // White for text on Teal

  cardWhite: '#FFFFFF',
  cardWhiteForeground: '#2C3A7E', // Same as backgroundLightBlueForeground

  mutedLightGray: '#E0E0E0', // General muted color (derived)
  mutedGrayText: '#757575', // Muted text (derived)

  destructiveRed: '#F44336', // Standard destructive red
  destructiveRedForeground: '#FFFFFF',

  borderGray: '#BDBDBD', // General border color (derived)
  inputBackground: '#F5F5F5', // Light gray for input fields

  // Standard colors
  white: '#FFFFFF',
  black: '#000000',
  lightGray: '#EEEEEE', // For subtle backgrounds or dividers
};

export const theme = {
  colors: {
    primary: palette.primaryPurple,
    primaryForeground: palette.primaryPurpleForeground,
    secondary: palette.accentTeal, // Using accent as secondary
    secondaryForeground: palette.accentTealForeground,
    background: palette.backgroundLightBlue,
    foreground: palette.backgroundLightBlueForeground, // Default text color on main background
    card: palette.cardWhite,
    cardForeground: palette.cardWhiteForeground, // Text color on cards
    popover: palette.cardWhite, // Assuming popovers are similar to cards
    popoverForeground: palette.cardWhiteForeground,
    muted: palette.mutedLightGray, // For less prominent elements
    mutedForeground: palette.mutedGrayText, // Text on muted backgrounds or less important text
    accent: palette.accentTeal,
    accentForeground: palette.accentTealForeground,
    destructive: palette.destructiveRed,
    destructiveForeground: palette.destructiveRedForeground,
    border: palette.borderGray,
    input: palette.inputBackground, // Background for TextInput
    ring: palette.primaryPurple, // Focus ring, matches primary

    // For convenience
    white: palette.white,
    black: palette.black,
    lightGray: palette.lightGray, 
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,  // Approx: calc(var(--radius) - 4px) where web radius is 0.75rem (12px)
    lg: 12, // Approx: var(--radius)
    xl: 16,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16, // Default text size
    md: 16,   // For RN, base and md often same
    lg: 18,
    xl: 20,
    xxl: 24,
    '3xl': 30, // For large headings
  },
  fontFamily: {
    // These are placeholders. You'll need to load these fonts into your RN project.
    // See react-native-app/src/assets/fonts/README.md
    body: 'System', // Default system font
    headline: 'System', // Default system font, perhaps make it bolder in use
    // code: 'Menlo', // Example monospace
  },
  // Add other theme properties like elevation, shadows if needed
};

// Dark theme variant (example, implement if needed later)
// export const darkTheme = {
//   ...theme,
//   colors: {
//     ...theme.colors,
//     background: '#121212',
//     foreground: '#E0E0E0',
//     card: '#1E1E1E',
//     // ... adjust other colors
//   }
// };

    