import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Share,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import * as Clipboard from 'expo-clipboard';
import api from '../../utils/api';
import LanguageSelectorButton from '../../components/LanguageSelectorButton';

interface ReferralData {
  referral_code: string;
  total_referrals: number;
  referral_earnings_usd: number;
  referral_earnings_tokens: number;
  referred_users: any[];
}

export default function Referral() {
  const { t } = useLanguage();
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await api.get('/referral/stats');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReferralData();
  };

  const copyToClipboard = async () => {
    if (data?.referral_code) {
      try {
        // Create full referral link
        const appUrl = 'https://gameearnings.preview.emergentagent.com'; // Replace with your actual app URL
        const referralLink = `${appUrl}/register?ref=${data.referral_code}`;
        
        // Check if we're in web environment
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(referralLink);
        } else {
          await Clipboard.setStringAsync(referralLink);
        }
        Alert.alert('✅ Sukses', `Link u kopjua!\n\n${referralLink}`);
      } catch (error) {
        console.error('Clipboard error:', error);
        Alert.alert('Gabim', 'Nuk mund të kopjohet linku');
      }
    }
  };

  const shareReferralCode = async () => {
    if (!data?.referral_code) {
      Alert.alert('Gabim', 'Kodi i referimit nuk u gjet');
      return;
    }
    
    try {
      // Create full app link with referral code
      const appUrl = 'https://gameearnings.preview.emergentagent.com';
      const referralLink = `${appUrl}/register?ref=${data.referral_code}`;
      
      const shareMessage = `🎮 GAMELOOT - Fito Para Reale!

Luaj lojëra dhe fito USD! 💰

KLIKO LINKUN PËR TU REGJISTRUAR:
${referralLink}

Kodi Referral: ${data.referral_code}

Fillo tani dhe fito!`;

      console.log('📤 [SHARE] Link:', referralLink);
      
      const result = await Share.share({
        message: shareMessage,
        url: referralLink,
        title: 'Bashkohu në GameLoot'
      });
      
      console.log('✅ [SHARE] Result:', result);
    } catch (error) {
      console.error('❌ [SHARE] Error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>{t('referral.title')}</Text>
        <Text style={styles.subtitle}>{t('referral.step3')}</Text>

        {/* Referral Code Card */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>{t('referral.yourCode')}</Text>
          <TouchableOpacity onPress={copyToClipboard} style={styles.codeContainer} activeOpacity={0.7}>
            <Text style={styles.code}>{data?.referral_code || 'Loading...'}</Text>
            <Ionicons name="copy" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <Text style={styles.copyHint}>👆 Kliko për të kopjuar</Text>
          
          <TouchableOpacity style={styles.shareButton} onPress={shareReferralCode}>
            <Ionicons name="share-social" size={20} color="#fff" />
            <Text style={styles.shareButtonText}>{t('referral.share')}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={32} color="#4CAF50" />
            <Text style={styles.statValue}>{data?.total_referrals || 0}</Text>
            <Text style={styles.statLabel}>{t('referral.friends')}</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="cash" size={32} color="#FFD700" />
            <Text style={styles.statValue}>${data?.referral_earnings_usd.toFixed(2) || '0.00'}</Text>
            <Text style={styles.statLabel}>{t('referral.earnings')}</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="trophy" size={32} color="#FF9800" />
            <Text style={styles.statValue}>{data?.referral_earnings_tokens.toFixed(2) || '0.00'}</Text>
            <Text style={styles.statLabel}>Tokens të Fituara</Text>
          </View>
        </View>

        {/* How it Works */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Si Funksionon?</Text>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>Ndaj kodin tënd me shokët</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>Ata regjistrohen duke përdorur kodin</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>Ti merr 10% nga çdo fitim i tyre!</Text>
          </View>
        </View>

        {/* Referred Users List */}
        {data && data.referred_users.length > 0 && (
          <View style={styles.listCard}>
            <Text style={styles.listTitle}>Përdoruesit e Referuar</Text>
            {data.referred_users.map((user, index) => (
              <View key={user._id || index} style={styles.userItem}>
                <Ionicons name="person-circle" size={32} color="#4CAF50" />
                <View style={styles.userInfo}>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userDate}>
                    {new Date(user.created_at).toLocaleDateString('sq-AL')}
                  </Text>
                </View>
                <Text style={styles.userEarnings}>
                  ${user.total_earnings_usd?.toFixed(2) || '0.00'}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
  },
  codeCard: {
    backgroundColor: '#1a2a1a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginBottom: 8,
  },
  code: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    letterSpacing: 3,
    flex: 1,
  },
  copyHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 12,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    color: '#999',
    marginLeft: 12,
    fontSize: 14,
  },
  listCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  userDate: {
    fontSize: 12,
    color: '#666',
  },
  userEarnings: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});