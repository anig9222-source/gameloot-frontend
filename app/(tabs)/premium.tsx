import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

export default function Premium() {
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [premiumCredits, setPremiumCredits] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/dashboard');
      setPremiumCredits(response.data.premium_credits || 0);
      setTokenBalance(response.data.token_balance || 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertTokensToCredits = async (amount: number) => {
    if (tokenBalance < amount) {
      Alert.alert('Gabim', 'Nuk ke tokens të mjaftueshëm.');
      return;
    }

    Alert.alert(
      'Konfirmo Konvertimin',
      `A je i sigurt që dëshiron të konvertosh ${amount} tokens në ${amount} premium credits?\n\nMe premium credits mund të luash pa reklama!`,
      [
        { text: 'Anulo', style: 'cancel' },
        {
          text: 'Konfirmo',
          onPress: async () => {
            setConverting(true);
            try {
              // Call backend to convert (this endpoint needs to be implemented)
              await api.post('/user/convert-to-premium', {
                token_amount: amount
              });
              
              Alert.alert('Sukses! 🎉', `U konvertuan ${amount} tokens në ${amount} premium credits!`);
              await fetchUserData();
            } catch (error: any) {
              Alert.alert(
                'Gabim',
                error.response?.data?.detail || 'Ndodhi një problem gjatë konvertimit.'
              );
            } finally {
              setConverting(false);
            }
          }
        }
      ]
    );
  };

  const playPremiumSlot = async () => {
    if (premiumCredits <= 0) {
      Alert.alert('Gabim', 'Nuk ke premium credits. Konverto tokens për të luajtur pa reklama!');
      return;
    }

    Alert.alert(
      'Premium Slot',
      'Slot Machine premium është në zhvillim. Së shpejti do të mund të luash pa reklama!',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Duke ngarkuar...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="diamond" size={48} color="#FFD700" />
          <Text style={styles.title}>Premium Play</Text>
          <Text style={styles.subtitle}>Luaj pa reklama dhe fito më shumë!</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Token Balance</Text>
            <View style={styles.balanceValueContainer}>
              <Ionicons name="logo-bitcoin" size={24} color="#4CAF50" />
              <Text style={styles.balanceValue}>{tokenBalance.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Premium Credits</Text>
            <View style={styles.balanceValueContainer}>
              <Ionicons name="diamond" size={24} color="#FFD700" />
              <Text style={[styles.balanceValue, { color: '#FFD700' }]}>
                {premiumCredits}
              </Text>
            </View>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Përfitimet Premium</Text>
          
          <View style={styles.benefitCard}>
            <Ionicons name="flash" size={32} color="#FFD700" />
            <View style={styles.benefitInfo}>
              <Text style={styles.benefitTitle}>Lojëra pa Reklama</Text>
              <Text style={styles.benefitDesc}>
                Luaj slot machine pa pritur reklamat. Kurseje kohë dhe fito më shpejt!
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <Ionicons name="trending-up" size={32} color="#4CAF50" />
            <View style={styles.benefitInfo}>
              <Text style={styles.benefitTitle}>Payout më të Mirë</Text>
              <Text style={styles.benefitDesc}>
                Premium slots ofrojnë payout më të lartë dhe jackpot më të shpeshtë!
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <Ionicons name="shield-checkmark" size={32} color="#2196F3" />
            <View style={styles.benefitInfo}>
              <Text style={styles.benefitTitle}>Prioritet në Payout</Text>
              <Text style={styles.benefitDesc}>
                Përdoruesit premium marrin prioritet në procesimin e payout requests.
              </Text>
            </View>
          </View>
        </View>

        {/* Conversion Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Konverto Tokens</Text>
          <Text style={styles.conversionNote}>
            1 Token = 1 Premium Credit
          </Text>

          <View style={styles.conversionOptions}>
            {[10, 50, 100, 500].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.conversionButton,
                  tokenBalance < amount && styles.conversionButtonDisabled
                ]}
                onPress={() => convertTokensToCredits(amount)}
                disabled={converting || tokenBalance < amount}
              >
                {converting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="swap-horizontal" size={20} color="#fff" />
                    <Text style={styles.conversionButtonText}>{amount}</Text>
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Premium Games Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium Games</Text>

          <TouchableOpacity
            style={[
              styles.premiumGameCard,
              premiumCredits <= 0 && styles.premiumGameCardDisabled
            ]}
            onPress={playPremiumSlot}
            disabled={premiumCredits <= 0}
          >
            <View style={styles.premiumGameHeader}>
              <Ionicons name="diamond" size={40} color="#FFD700" />
              <View style={styles.premiumGameInfo}>
                <Text style={styles.premiumGameTitle}>Premium Slot Machine</Text>
                <Text style={styles.premiumGameDesc}>
                  Pa reklama • Payout më të lartë • Lojë më e shpejtë
                </Text>
              </View>
            </View>
            
            <View style={styles.premiumGameCost}>
              <Ionicons name="diamond" size={16} color="#FFD700" />
              <Text style={styles.premiumGameCostText}>1 credit/spin</Text>
            </View>
          </TouchableOpacity>

          {premiumCredits <= 0 && (
            <View style={styles.noCreditsWarning}>
              <Ionicons name="warning" size={20} color="#FF9800" />
              <Text style={styles.noCreditsText}>
                Konverto tokens për të luajtur premium games!
              </Text>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#2196F3" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Si funksionon?</Text>
            <Text style={styles.infoText}>
              • Luaj lojëra normale për të fituar tokens{'\n'}
              • Konverto tokens në premium credits (1:1){'\n'}
              • Përdor credits për të luajtur pa reklama{'\n'}
              • Fito më shumë me payout më të mirë!
            </Text>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  loadingText: {
    color: '#999',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  balanceCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  balanceValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  benefitInfo: {
    flex: 1,
    marginLeft: 16,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  conversionNote: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
  },
  conversionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  conversionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversionButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  conversionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  premiumGameCard: {
    backgroundColor: '#2a2a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 12,
  },
  premiumGameCardDisabled: {
    opacity: 0.5,
    borderColor: '#666',
  },
  premiumGameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumGameInfo: {
    flex: 1,
    marginLeft: 16,
  },
  premiumGameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  premiumGameDesc: {
    fontSize: 13,
    color: '#999',
  },
  premiumGameCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  premiumGameCostText: {
    color: '#FFD700',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: 'bold',
  },
  noCreditsWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a1a1a',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  noCreditsText: {
    color: '#FF9800',
    marginLeft: 8,
    fontSize: 14,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
});
