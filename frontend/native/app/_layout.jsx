import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import { CartProvider } from '../components/CartContext';
import { FavoritesProvider } from '../components/FavoritesContext';

// Loading component
function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken'); // Replace with your token key
      console.log(token)
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  // Wait for fonts to load
  if (!loaded) {
    return <LoadingScreen />;
  }

  // Wait for auth check to complete
  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }

  return (
    <FavoritesProvider>
      <CartProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
              // Unauthenticated stack - only login/signup accessible
              <>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="signup" options={{ headerShown: false }} />
              </>
            ) : (
              // Authenticated stack - full app accessible
              <>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
                <Stack.Screen name="signup" options={{ headerShown: false, presentation: 'modal' }} />
                <Stack.Screen name="+not-found" />
              </>
            )}
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </CartProvider>
    </FavoritesProvider>
  );
}