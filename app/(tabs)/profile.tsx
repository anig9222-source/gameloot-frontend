import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useAudio } from '../../contexts/AudioContext';
import { useRouter } from 'expo-router';
import LanguageSelector from '../../components/LanguageSelector';

export default function Profile() {
  const { user, logout } = useAuth();
  const { isMusicEnabled, toggleMusic } = useAudio();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log('[PROFILE] Logout button pressed');
      await logout();
      console.log('[PROFILE] Logout completed, navigating to root');
      // Shko te '/' dhe le index.tsx të bëjë redirect sipas autentikimit
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigateToAdmin = () => {
    router.push('/admin');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profili</Text>

        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#4CAF50" />
          </View>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
            <Text style={styles.badgeText}>Verified User</Text>
          </View>
        </View>

        {/* Language Selector */}
        <LanguageSelector />

        {/* Menu Items */}
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/revenue-calc')}>
            <Ionicons name="calculator" size={24} color="#FFD700" />
            <Text style={styles.menuText}>💰 Earnings Calculator</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/transactions')}>
            <Ionicons name="wallet" size={24} color="#4CAF50" />
            <Text style={styles.menuText}>Historiku i Transaksioneve</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/settings')}>
            <Ionicons name="settings" size={24} color="#4CAF50" />
            <Text style={styles.menuText}>Konfigurimet</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/solana-wallet')}>
            <Ionicons name="wallet" size={24} color="#9C27B0" />
            <Text style={styles.menuText}>🚀 Solana Wallet (NEW)</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          {/* Admin Panel - Only for specific email */}
          {user?.email === 'donlaki4444@gmail.com' && (
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/admin-panel')}>
              <Ionicons name="shield-checkmark" size={24} color="#9C27B0" />
              <Text style={styles.menuText}>🔐 Admin Panel</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/support')}>
            <Ionicons name="help-circle" size={24} color="#4CAF50" />
            <Text style={styles.menuText}>Ndihma & Suport</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={navigateToAdmin}>
            <Ionicons name="shield" size={24} color="#FF9800" />
            <Text style={styles.menuText}>Admin Panel</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Audio Settings */}
        <View style={styles.audioCard}>
          <View style={styles.audioHeader}>
            <Ionicons name="musical-notes" size={28} color="#4CAF50" />
            <Text style={styles.audioTitle}>Muzika & Sound Effects</Text>
          </View>
          <View style={styles.audioToggle}>
            <View style={styles.audioInfo}>
              <Text style={styles.audioLabel}>
                {isMusicEnabled ? '🎵 Muzika: ON' : '🔇 Muzika: OFF'}
              </Text>
              <Text style={styles.audioDescription}>
                Muzikë background dhe efekte zanore për lojëra
              </Text>
            </View>
            <Switch
              value={isMusicEnabled}
              onValueChange={toggleMusic}
              trackColor={{ false: '#333', true: '#4CAF50' }}
              thumbColor={isMusicEnabled ? '#fff' : '#666'}
              ios_backgroundColor="#333"
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Për WinWin</Text>
          <Text style={styles.infoText}>Version 1.0.0</Text>
          <Text style={styles.infoText}>© 2024 WinWin. All rights reserved.</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#ff4444" />
          <Text style={styles.logoutText}>Dil nga Llogaria</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  email: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#4CAF50',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 8,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 16,
  },
  audioCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  audioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  audioToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioInfo: {
    flex: 1,
  },
  audioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 6,
  },
  audioDescription: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 6,
  },
  logoutButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ff4444',
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});