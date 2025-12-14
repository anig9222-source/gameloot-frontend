import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRouter } from 'expo-router';

export default function LanguageScreen() {
  const { language, setLanguage, availableLanguages, t } = useLanguage();
  const router = useRouter();

  const handleLanguageSelect = async (langCode: any) => {
    await setLanguage(langCode);
    // Go back after selection
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.selectLanguage')}</Text>
      </View>

      {/* Language Options */}
      <View style={styles.content}>
        {availableLanguages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageItem,
              language === lang.code && styles.languageItemActive,
            ]}
            onPress={() => handleLanguageSelect(lang.code)}
          >
            <View style={styles.languageInfo}>
              <Text style={styles.languageFlag}>{lang.flag}</Text>
              <Text style={styles.languageName}>{lang.name}</Text>
            </View>
            {language === lang.code && (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          The app will restart to apply the new language.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#333',
  },
  languageItemActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#1a2a1a',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  infoCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
