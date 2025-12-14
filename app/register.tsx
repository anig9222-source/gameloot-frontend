import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Auto-fill referral code from URL parameter
  useEffect(() => {
    if (params.ref && typeof params.ref === 'string') {
      setReferralCode(params.ref);
      console.log('✅ [REFERRAL] Auto-filled code from URL:', params.ref);
    }
  }, [params.ref]);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Gabim', 'Ju lutem plotësoni të gjitha fushat');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Gabim', 'Fjalëkalimet nuk përputhen');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Gabim', 'Fjalëkalimi duhet të jetë të paktën 8 karaktere');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, referralCode, router);
      // Navigation tani trajtohet nga AuthContext direkt
      console.log('[REGISTER] Registration successful, navigating to dashboard');
    } catch (error: any) {
      Alert.alert('Gabim', error.response?.data?.detail || 'Regjistrimi dështoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>WinWin</Text>
        <Text style={styles.subtitle}>Krijo llogari të re</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Fjalëkalimi (min 8 karaktere)"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Konfirmo Fjalëkalimin"
          placeholderTextColor="#666"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Kodi i Referimit (opsionale)"
          placeholderTextColor="#666"
          value={referralCode}
          onChangeText={setReferralCode}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Regjistrohu</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Ke llogari tashmë? Hyr</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 32,
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
    backgroundColor: '#4CAF50',
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
  link: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
});