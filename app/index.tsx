import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function Index() {
  const { isAuthenticated, loading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('[INDEX] Auth state changed:', { isAuthenticated, loading, hasToken: !!token });
    if (!loading) {
      if (isAuthenticated && token) {
        console.log('[INDEX] Navigating to dashboard');
        router.replace('/(tabs)/dashboard');
      } else {
        console.log('[INDEX] Navigating to login');
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading, token]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.text}>WinWin</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
  }
});