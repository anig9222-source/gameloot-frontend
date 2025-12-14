import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert('Gabim', 'Ju lutem plotësoni të gjitha fushat');
      return;
    }

    // Open email client with pre-filled content
    const emailSubject = `GameLoot Contact: ${name}`;
    const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailto = `mailto:anig9222@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    Linking.openURL(mailto)
      .then(() => {
        Alert.alert('Sukses', 'Email klienti u hap. Ju lutem dërgoni mesazhin.');
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch(() => {
        Alert.alert('Gabim', 'Nuk mund të hapet email klienti. Ju lutem dërgoni email manualisht në: anig9222@gmail.com');
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="mail" size={48} color="#4CAF50" />
          <Text style={styles.title}>Contact Us - Na Kontaktoni</Text>
          <Text style={styles.subtitle}>We'd love to hear from you!</Text>
          <Text style={styles.subtitle}>Do të na pëlqente të dëgjonim nga ju!</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={24} color="#FFD700" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>anig9222@gmail.com</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={24} color="#FFD700" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Response Time / Koha e Përgjigjes</Text>
              <Text style={styles.infoValue}>24-48 hours / 24-48 orë</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="globe-outline" size={24} color="#FFD700" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Languages / Gjuhët</Text>
              <Text style={styles.infoValue}>English, Albanian (Shqip)</Text>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Send us a message / Dërgona një mesazh</Text>
          
          <Text style={styles.label}>Name / Emri</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name / Emri juaj"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Message / Mesazhi</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={message}
            onChangeText={setMessage}
            placeholder="Your message / Mesazhi juaj..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Ionicons name="send" size={20} color="#fff" />
            <Text style={styles.buttonText}>Send / Dërgo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Quick Help / Ndihmë e Shpejtë</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>❓ How do I earn WIN tokens?</Text>
            <Text style={styles.faqAnswer}>Play games and watch ads. 60% of ad revenue becomes WIN tokens.</Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>❓ Si fitoj WIN tokens?</Text>
            <Text style={styles.faqAnswer}>Luaj lojëra dhe shiko reklama. 60% e të ardhurave nga reklama bëhen WIN tokens.</Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>❓ When can I withdraw?</Text>
            <Text style={styles.faqAnswer}>Minimum withdrawal varies. Check dashboard for current threshold.</Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>❓ Kur mund të tërheq?</Text>
            <Text style={styles.faqAnswer}>Minimumi i tërheqjes varion. Kontrolloni dashboard për pragun aktual.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#1a1f2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  form: {
    backgroundColor: '#1a1f2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#0a0e1a',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  faqSection: {
    backgroundColor: '#1a1f2e',
    borderRadius: 12,
    padding: 16,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#ccc',
    lineHeight: 20,
  },
});