import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { View, ActivityIndicator } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { CartProvider } from '../components/CartContext';
import { FavoritesProvider } from '../components/FavoritesContext';
import { AuthProvider, useAuth } from '../components/AuthContext';

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

  // Wait for fonts to load
  if (!loaded) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootLayoutNav />
            <StatusBar style="auto" />
          </ThemeProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

// Separate component to use auth context
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait for auth check to complete
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
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
          <Stack.Screen name="+not-found" />
        </>
      )}
    </Stack>
  );
}