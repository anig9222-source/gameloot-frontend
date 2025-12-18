import { useEffect } from 'react';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { Platform } from 'react-native';
import { AuthProvider } from '../contexts/AuthContext';
import { AudioProvider } from '../contexts/AudioContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AdRevenueProvider } from '../contexts/AdRevenueContext';
import { initializeAdSense } from '../services/adsenseService';

export default function RootLayout() {
  // Ads temporarily removed for white screen fix
  useEffect(() => {
    if (Platform.OS === 'web') {
      console.log('🔥 App initialized - Ads temporarily disabled');
    }
  }, []);
  
  return (
    <>
      <Head>
        {/* Monetag scripts temporarily removed - will be replaced with rewarded video ads */}
      </Head>
      <LanguageProvider>
        <AuthProvider>
          <AudioProvider>
            <AdRevenueProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="admin" />
              </Stack>
            </AdRevenueProvider>
          </AudioProvider>
        </AuthProvider>
      </LanguageProvider>
    </>
  );
}