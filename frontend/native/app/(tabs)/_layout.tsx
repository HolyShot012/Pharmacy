import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function TabLayout() {
  const colorScheme = 'light'; // Force light mode

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="cube" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <Ionicons name="cart-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vaccination"
        options={{
          title: 'Vaccine',
          tabBarIcon: ({ color }) => <FontAwesome5 name="syringe" size={22} color={color} />,
        }}
      />

    </Tabs>
  );
}
