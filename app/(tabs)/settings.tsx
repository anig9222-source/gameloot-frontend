import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import storage from '../../utils/storage';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleClearCache = async () => {
    Alert.alert(
      'Pastro Cache',
      'Je i sigurt që dëshiron të pastrosh cache-in?',
      [
        { text: 'Anulo', style: 'cancel' },
        {
          text: 'Pastro',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.clear();
              Alert.alert('Sukses', 'Cache u pastrua!');
            } catch (error) {
              Alert.alert('Gabim', 'Nuk mund të pastrohej cache');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Konfigurimet</Text>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Njoftimet</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={24} color="#4CAF50" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Merr njoftime për rewards</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#2a2a2a', true: '#4CAF50' }}
              thumbColor={notifications ? '#fff' : '#666'}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencat</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high" size={24} color="#4CAF50" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Tingujt</Text>
                <Text style={styles.settingDescription}>Efekte zanore në lojëra</Text>
              </View>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ false: '#2a2a2a', true: '#4CAF50' }}
              thumbColor={soundEffects ? '#fff' : '#666'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon" size={24} color="#4CAF50" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Temë e errët</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#2a2a2a', true: '#4CAF50' }}
              thumbColor={darkMode ? '#fff' : '#666'}
            />
          </View>
        </View>

        {/* App Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Të Dhënat e Aplikacionit</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
            <View style={styles.settingLeft}>
              <Ionicons name="trash" size={24} color="#FF9800" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Pastro Cache</Text>
                <Text style={styles.settingDescription}>Fshi të dhënat e përkohshme</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rreth</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Versioni</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Build Number</Text>
            <Text style={styles.infoValue}>2024.11.29</Text>
          </View>
        </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#999',
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
