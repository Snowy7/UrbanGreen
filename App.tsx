/**
 * @file App.tsx
 * @description Root application component that initializes core app functionality
 * including fonts, internationalization, Redux store, and navigation.
 *
 * This component handles:
 * - Custom font loading
 * - RTL configuration (explicitly disabled for controlled management)
 * - Theme initialization and provider setup
 * - Redux store integration
 * - Safe area handling for notched devices
 * - SplashScreen management
 */

import { useFonts } from '@expo-google-fonts/almarai/useFonts';
import { Almarai_300Light } from '@expo-google-fonts/almarai/300Light';
import { Almarai_400Regular } from '@expo-google-fonts/almarai/400Regular';
import { Almarai_700Bold } from '@expo-google-fonts/almarai/700Bold';
import { Almarai_800ExtraBold } from '@expo-google-fonts/almarai/800ExtraBold';

import "@/lang";
import Routes from "@/navigation/Routes";
import store from "@/redux/store";
import React, { useEffect, useState } from "react";
import { I18nManager, StatusBar, Animated } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { ThemeProvider } from "@/context/ThemeContext";
import { getLocalItem } from "@/utils/checkStorage";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import * as NavigationBar from "expo-navigation-bar";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import SplashScreen from "@/components/SplashScreen";

const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

/**
 * Main application component that serves as the entry point for the app.
 *
 * @returns {JSX.Element | null} The rendered app or null during font loading
 */
const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  /**
   * Load custom fonts using Expo's useFonts hook
   */
  const [loaded, error] = useFonts({
    "Inter-Regular": require("./src/assets/fonts/CodecPro-Regular.ttf"),
    "Inter-Bold": require("./src/assets/fonts/CodecPro-Bold.ttf"),
    "Inter-Medium": require("./src/assets/fonts/CodecPro-Heavy.ttf"),
    "Inter-SemiBold": require("./src/assets/fonts/CodecPro-Fat.ttf"),
  });

  useEffect(() => {
    // Disable automatic RTL handling - we manage this explicitly through i18n
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);

    // Initialize app from stored user preferences
    getLocalItem();

    // Set navigation bar to transparent
    StatusBar.setBarStyle("light-content");
    StatusBar.setTranslucent(true);
    NavigationBar.setBackgroundColorAsync("transparent");
    NavigationBar.setPositionAsync("absolute");

    if (loaded || error) {
      // Start fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsAppReady(true);
      });
    }
  }, [loaded, error, fadeAnim]);

  return (
    <>
      {!isAppReady && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: fadeAnim,
            zIndex: 1,
          }}
        >
          <SplashScreen />
        </Animated.View>
      )}
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemeProvider>
            <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
              <ClerkLoaded>
                <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                  <Routes />
                </ConvexProviderWithClerk>
              </ClerkLoaded>
            </ClerkProvider>
          </ThemeProvider>
        </Provider>
      </SafeAreaProvider>
    </>
  );
};

export default App;
