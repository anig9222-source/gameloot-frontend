import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import storage from '../../utils/storage';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!password) {
      Alert.alert('Gabim', 'Ju lutem vendos password-in');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, {
        password
      });

      const { access_token } = response.data;
      await storage.setItem('admin_token', access_token);
      
      router.push('/admin/dashboard');
    } catch (error: any) {
      Alert.alert('Gabim', error.response?.data?.detail || 'Password i gabuar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Kthehu</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Admin Panel</Text>
        <Text style={styles.subtitle}>Hyr si administrator</Text>

        <TextInput
          style={styles.input}
          placeholder="Admin Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Hyr</Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Password default: WinWinAdmin2024!@#</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
  },
  backText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF9800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 48,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  infoText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
});