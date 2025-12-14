import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Privacy Policy - Politika e Privatësisë</Text>
        <Text style={styles.lastUpdated}>Last Updated: December 14, 2025</Text>

        <Text style={styles.sectionTitle}>1. Information We Collect / Informacioni që Mbledhim</Text>
        <Text style={styles.text}>
          We collect information you provide directly to us, including:
          - Account information (email, password)
          - Game activity and statistics
          - Device information and IP address
          - Ad interaction data
        </Text>
        <Text style={styles.text}>
          Ne mbledhim informacione që ju na jepni drejtpërdrejt, përfshirë:
          - Informacion të llogarisë (email, fjalëkalim)
          - Aktivitet dhe statistika të lojërave
          - Informacion të pajisjes dhe adresë IP
          - Të dhëna të ndërveprimit me reklama
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information / Si Përdorim Informacionin Tuaj</Text>
        <Text style={styles.text}>
          We use collected information to:
          - Provide and improve our services
          - Process transactions and calculate rewards
          - Display personalized advertisements
          - Communicate with you about your account
          - Ensure platform security
        </Text>
        <Text style={styles.text}>
          Ne përdorim informacionin e mbledhur për të:
          - Ofruar dhe përmirësuar shërbimet tona
          - Përpunuar transaksione dhe llogaritur shpërblime
          - Shfaqur reklama të personalizuara
          - Komunikuar me ju rreth llogarisë suaj
          - Siguruar sigurinë e platformës
        </Text>

        <Text style={styles.sectionTitle}>3. Google AdSense / Google AdSense</Text>
        <Text style={styles.text}>
          We use Google AdSense to display advertisements. Google uses cookies and similar technologies to:
          - Serve ads based on your interests
          - Measure ad performance
          - Prevent fraud and abuse
          
          You can opt out of personalized advertising by visiting Google's Ads Settings.
        </Text>
        <Text style={styles.text}>
          Ne përdorim Google AdSense për të shfaqur reklama. Google përdor cookies dhe teknologji të ngjashme për të:
          - Shfaqur reklama bazuar në interesat tuaja
          - Matur performancën e reklamave
          - Parandaluar mashtrim dhe keqpërdorim
          
          Ju mund të refuzoni reklamat e personalizuara duke vizituar Cilësimet e Reklamave të Google.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Security / Siguria e të Dhënave</Text>
        <Text style={styles.text}>
          We implement security measures to protect your information, including:
          - Encrypted data transmission (HTTPS)
          - Secure password storage (bcrypt hashing)
          - Regular security audits
          - Limited access to personal data
        </Text>
        <Text style={styles.text}>
          Ne zbatojmë masa sigurie për të mbrojtur informacionin tuaj, përfshirë:
          - Transmetim të enkriptuar të të dhënave (HTTPS)
          - Ruajtje të sigurt të fjalëkalimeve (bcrypt hashing)
          - Auditime të rregullta të sigurisë
          - Akses të kufizuar në të dhënat personale
        </Text>

        <Text style={styles.sectionTitle}>5. Your Rights / Të Drejtat Tuaja</Text>
        <Text style={styles.text}>
          You have the right to:
          - Access your personal data
          - Request data correction or deletion
          - Opt out of marketing communications
          - Withdraw consent at any time
          - Export your data
        </Text>
        <Text style={styles.text}>
          Ju keni të drejtë të:
          - Aksesoni të dhënat tuaja personale
          - Kërkoni korrigjim ose fshirje të të dhënave
          - Refuzoni komunikimet e marketingut
          - Tërhiqni pëlqimin në çdo kohë
          - Eksportoni të dhënat tuaja
        </Text>

        <Text style={styles.sectionTitle}>6. Children's Privacy / Privatësia e Fëmijëve</Text>
        <Text style={styles.text}>
          Our service is not intended for children under 13 years old. We do not knowingly collect information from children under 13.
        </Text>
        <Text style={styles.text}>
          Shërbimi ynë nuk është i destinuar për fëmijë nën 13 vjeç. Ne nuk mbledhim në mënyrë të vetëdijshme informacion nga fëmijë nën 13 vjeç.
        </Text>

        <Text style={styles.sectionTitle}>7. Contact Us / Na Kontaktoni</Text>
        <Text style={styles.text}>
          For privacy-related questions, contact us at:
          Email: anig9222@gmail.com
        </Text>
        <Text style={styles.text}>
          Për pyetje të lidhura me privatësinë, na kontaktoni në:
          Email: anig9222@gmail.com
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to This Policy / Ndryshime në Këtë Politikë</Text>
        <Text style={styles.text}>
          We may update this policy periodically. Continued use of our service after changes constitutes acceptance of the updated policy.
        </Text>
        <Text style={styles.text}>
          Ne mund të përditësojmë këtë politikë periodikisht. Vazhdimi i përdorimit të shërbimit tonë pas ndryshimeve përbën pranimin e politikës së përditësuar.
        </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
    marginBottom: 10,
  },
});