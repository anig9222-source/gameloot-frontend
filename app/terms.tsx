import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

export default function TermsOfService() {
  const { t } = useLanguage();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Terms of Service - Kushtet e Shërbimit</Text>
        <Text style={styles.lastUpdated}>Last Updated: December 14, 2025</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms / Pranimi i Kushteve</Text>
        <Text style={styles.text}>
          By accessing or using GameLoot ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
        </Text>
        <Text style={styles.text}>
          Duke aksesuar ose përdorur GameLoot ("Shërbimi"), ju pranoni të jeni të lidhur me këto Kushte Shërbimi. Nëse nuk pranoni, mos e përdorni Shërbimin.
        </Text>

        <Text style={styles.sectionTitle}>2. Description of Service / Përshkrimi i Shërbimit</Text>
        <Text style={styles.text}>
          GameLoot is a play-to-earn gaming platform where users:
          - Play casual games
          - Watch advertisements
          - Earn WIN tokens based on ad revenue
          - Participate in missions and referral programs
          - Access premium features through subscriptions
        </Text>
        <Text style={styles.text}>
          GameLoot është një platformë lojërash play-to-earn ku përdoruesit:
          - Luajnë lojëra casual
          - Shikojnë reklama
          - Fitojnë WIN tokens bazuar në të ardhurat nga reklama
          - Marrin pjesë në misione dhe programe referimi
          - Aksesojnë veçori premium përmes abonimeve
        </Text>

        <Text style={styles.sectionTitle}>3. User Accounts / Llogaritë e Përdoruesve</Text>
        <Text style={styles.text}>
          To use the Service, you must:
          - Be at least 13 years old
          - Provide accurate registration information
          - Maintain the security of your account credentials
          - Notify us of any unauthorized access
          - Not share your account with others
        </Text>
        <Text style={styles.text}>
          Për të përdorur Shërbimin, ju duhet:
          - Të jeni të paktën 13 vjeç
          - Të jepni informacion të saktë regjistrimi
          - Të mbani sigurinë e kredencialeve të llogarisë suaj
          - Të na njoftoni për çdo akses të paautorizuar
          - Të mos ndani llogarinë tuaj me të tjerët
        </Text>

        <Text style={styles.sectionTitle}>4. WIN Tokens and Revenue Sharing / WIN Tokens dhe Ndarje e të Ardhurave</Text>
        <Text style={styles.text}>
          Revenue Model:
          - 60% of ad revenue is converted to WIN tokens for users
          - 40% goes to WIN coin liquidity pool
          - WIN tokens have a market-based price (currently $0.001/WIN)
          - Tokens can be used for premium features or MGM subscriptions
          - Minimum withdrawal thresholds apply
        </Text>
        <Text style={styles.text}>
          Modeli i të Ardhurave:
          - 60% e të ardhurave nga reklama konvertohen në WIN tokens për përdoruesit
          - 40% shkon në pool-in e likuiditetit të WIN coin
          - WIN tokens kanë një çmim bazuar në market (aktualisht $0.001/WIN)
          - Tokens mund të përdoren për veçori premium ose abonim MGM
          - Aplikohen pragje minimale për tërheqje
        </Text>

        <Text style={styles.sectionTitle}>5. Mini Gold Mine (MGM) Subscriptions / Abonimet Mini Gold Mine (MGM)</Text>
        <Text style={styles.text}>
          MGM Subscription Rules:
          - Subscriptions are LOCKED for the chosen duration (1-24 months)
          - Daily rewards accumulate but cannot be withdrawn until expiry
          - Early cancellation results in 100% forfeit of all accumulated rewards
          - Rewards are paid in WIN tokens
          - Limited slots may apply to certain tiers
        </Text>
        <Text style={styles.text}>
          Rregullat e Abonimit MGM:
          - Abonimet janë të BLLOKUARA për kohëzgjatjen e zgjedhur (1-24 muaj)
          - Shpërblimet ditore akumulohen por nuk mund të tërhiqen deri në skadim
          - Anulimi i hershëm rezulton në humbje 100% të të gjitha shpërblimeve të akumuluara
          - Shpërblimet paguhen në WIN tokens
          - Slot-e të kufizuara mund të aplikohen për disa nivele
        </Text>

        <Text style={styles.sectionTitle}>6. Prohibited Conduct / Sjellje e Ndaluar</Text>
        <Text style={styles.text}>
          You may NOT:
          - Use bots, scripts, or automated tools
          - Create multiple accounts to exploit the system
          - Manipulate ad viewing or click-through rates
          - Engage in fraudulent activity
          - Harass other users
          - Violate any applicable laws
        </Text>
        <Text style={styles.text}>
          Ju NUK mund:
          - Të përdorni bots, scripts, ose mjete të automatizuara
          - Të krijoni llogari të shumta për të shfrytëzuar sistemin
          - Të manipuloni shikimin e reklamave ose normat e klikimeve
          - Të angazhoheni në aktivitete mashtrimore
          - Të ngacmoni përdorues të tjerë
          - Të shkelni çdo ligj të zbatueshëm
        </Text>

        <Text style={styles.sectionTitle}>7. Termination / Përfundimi</Text>
        <Text style={styles.text}>
          We reserve the right to:
          - Suspend or terminate accounts for violations
          - Withhold rewards from accounts involved in fraud
          - Modify or discontinue the Service at any time
          - Change these Terms with notice
        </Text>
        <Text style={styles.text}>
          Ne rezervojmë të drejtën për të:
          - Pezulluar ose përfunduar llogari për shkelje
          - Mbajtur shpërblime nga llogari të përfshira në mashtrim
          - Modifikuar ose ndërprerë Shërbimin në çdo kohë
          - Ndryshuar këto Kushte me njoftim
        </Text>

        <Text style={styles.sectionTitle}>8. Disclaimers / Mohimet</Text>
        <Text style={styles.text}>
          The Service is provided "AS IS" without warranties. We are not responsible for:
          - Market fluctuations in WIN token value
          - Technical issues or downtime
          - Loss of tokens due to user error
          - Third-party services (Google AdSense, payment processors)
        </Text>
        <Text style={styles.text}>
          Shërbimi ofrohet "SI ËSHTË" pa garanci. Ne nuk jemi përgjegjës për:
          - Luhatshmëri të tregut në vlerën e WIN token
          - Probleme teknike ose kohë të ndërprerjes
          - Humbje të token-ave për shkak të gabimit të përdoruesit
          - Shërbime të palëve të treta (Google AdSense, procesorë pagesash)
        </Text>

        <Text style={styles.sectionTitle}>9. Limitation of Liability / Kufizimi i Përgjegjësisë</Text>
        <Text style={styles.text}>
          To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.
        </Text>
        <Text style={styles.text}>
          Në masën maksimale të lejuar nga ligji, ne nuk jemi përgjegjës për çdo dëm të tërthortë, të rastësishëm, special, ose pasues që rrjedh nga përdorimi juaj i Shërbimit.
        </Text>

        <Text style={styles.sectionTitle}>10. Governing Law / Ligji Rregullues</Text>
        <Text style={styles.text}>
          These Terms are governed by the laws of Albania. Any disputes shall be resolved in Albanian courts.
        </Text>
        <Text style={styles.text}>
          Këto Kushte rregullohen nga ligjet e Shqipërisë. Çdo mosmarrëveshje do të zgjidhet në gjykatat shqiptare.
        </Text>

        <Text style={styles.sectionTitle}>11. Contact / Kontakt</Text>
        <Text style={styles.text}>
          For questions about these Terms, contact:
          Email: anig9222@gmail.com
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