/**
 * Language Selector Component - For Profile Page
 * 
 * Shows all 7 languages with flags
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="language" size={24} color="#4CAF50" />
        <Text style={styles.title}>Zgjidh Gjuhën / Select Language</Text>
      </View>
      
      <View style={styles.languagesContainer}>
        {availableLanguages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              language === lang.code && styles.languageButtonActive
            ]}
            onPress={() => setLanguage(lang.code)}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text style={[
              styles.languageName,
              language === lang.code && styles.languageNameActive
            ]}>
              {lang.name}
            </Text>
            {language === lang.code && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  languagesContainer: {
    gap: 12,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c0c0c',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#333',
  },
  languageButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#1a2a1a',
  },
  flag: {
    fontSize: 28,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    color: '#999',
    flex: 1,
  },
  languageNameActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
