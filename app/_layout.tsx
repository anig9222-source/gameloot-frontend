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
  // Initialize Ads (Web only)
  useEffect(() => {
    if (Platform.OS === 'web') {
      console.log('🔥 MONETIZATION MODE ACTIVATED');
      console.log('💰 MonetizeTag Multitag initialized - Banner Ads + Push Notifications');
    }
  }, []);
  
  return (
    <>
      <Head>
        <meta name="monetag" content="84a69637dddbaf50918ff9457037a31a" />
        {/* MonetizeTag Multitag - Banner Ads + Push Notifications + More (Zone: 193429) */}
        <script src="https://quge5.com/88/tag.min.js" data-zone="193429" async data-cfasync="false" />
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