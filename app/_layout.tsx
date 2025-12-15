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
  // Initialize AdSense Auto Ads (Web only)
  useEffect(() => {
    if (Platform.OS === 'web') {
      initializeAdSense();
      console.log('🔥 AGGRESSIVE MONETIZATION MODE ACTIVATED');
      console.log('💰 Google AdSense Auto Ads initialized for maximum revenue');
    }
  }, []);
  
  return (
    <>
      <Head>
        <meta name="monetag" content="84a69637dddbaf50918ff9457037a31a" />
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