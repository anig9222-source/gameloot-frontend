import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
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
  const [error, setError] = useState('');
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
    console.log('🔵 [REGISTER] Button clicked - starting registration');
    setError('');
    
    if (!email || !password || !confirmPassword) {
      setError('Ju lutem plotësoni të gjitha fushat');
      console.log('❌ [REGISTER] Validation failed: empty fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Fjalëkalimet nuk përputhen');
      console.log('❌ [REGISTER] Validation failed: passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Fjalëkalimi duhet të jetë të paktën 8 karaktere');
      console.log('❌ [REGISTER] Validation failed: password too short');
      return;
    }

    console.log('🔵 [REGISTER] Validation passed, calling API...');
    setLoading(true);
    try {
      await register(email, password, referralCode, router);
      console.log('✅ [REGISTER] Registration successful');
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Regjistrimi dështoi';
      setError(errorMsg);
      console.error('❌ [REGISTER] Registration failed:', errorMsg, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>WinWin</Text>
          <Text style={styles.subtitle}>Krijo llogari të re</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            editable={!loading}
            accessibilityLabel="Email input"
            accessibilityHint="Enter your email address"
          />

          <TextInput
            style={styles.input}
            placeholder="Fjalëkalimi (min 8 karaktere)"
            placeholderTextColor="#666"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            secureTextEntry
            autoComplete="password-new"
            textContentType="newPassword"
            editable={!loading}
            accessibilityLabel="Password input"
            accessibilityHint="Enter a password with at least 8 characters"
          />

          <TextInput
            style={styles.input}
            placeholder="Konfirmo Fjalëkalimin"
            placeholderTextColor="#666"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError('');
            }}
            secureTextEntry
            autoComplete="password-new"
            textContentType="newPassword"
            editable={!loading}
            accessibilityLabel="Confirm password input"
            accessibilityHint="Re-enter your password"
          />

          <TextInput
            style={styles.input}
            placeholder="Kodi i Referimit (opsionale)"
            placeholderTextColor="#666"
            value={referralCode}
            onChangeText={setReferralCode}
            autoCapitalize="characters"
            editable={!loading}
            accessibilityLabel="Referral code input"
            accessibilityHint="Optional referral code"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Register button"
            accessibilityState={{ disabled: loading }}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.loadingText}>Po regjistron...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Regjistrohu</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.link}>Ke llogari tashmë? Hyr</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 40,
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
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 56,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 56,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  link: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
});
