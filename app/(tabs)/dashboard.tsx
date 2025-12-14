import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Linking,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '../../utils/api';
import LanguageSelectorButton from '../../components/LanguageSelectorButton';
import AdSenseBanner from '../../components/AdSenseBanner';
import AdSenseInFeed from '../../components/AdSenseInFeed';
import AdSenseNative from '../../components/AdSenseNative';
import AdSenseMultiplex from '../../components/AdSenseMultiplex';
import AdSensePlaceholder from '../../components/AdSensePlaceholder';
import { useAdRevenue } from '../../contexts/AdRevenueContext';

interface DashboardData {
  token_balance: number;
  pending_revenue_usd: number;
  pending_tokens: number;
  today_earnings_usd: number;
  total_earnings_usd: number;
  referral_earnings_usd: number;
  referral_earnings_tokens: number;
  referral_code: string;
  referred_users_count: number;
  pump_fun_link: string;
  passive_farm_active?: boolean;
  passive_farm_plan?: 'daily' | 'weekly' | 'monthly' | null;
  passive_farm_expires_at?: string | null;
}

interface WinBalanceData {
  locked_win: number;
  available_win: number;
  total_win: number;
  vesting_schedules: Array<{
    _id: string;
    win_amount: number;
    unlock_date: string;
    status: string;
  }>;
  vesting_count: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [winBalance, setWinBalance] = useState<WinBalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [passiveModalVisible, setPassiveModalVisible] = useState(false);
  const [subscribingPlan, setSubscribingPlan] = useState<'daily' | 'weekly' | 'monthly' | null>(null);
  const [subscribing, setSubscribing] = useState(false);
  
  // Solana Wallet Modal State
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletStatus, setWalletStatus] = useState<any>(null);
  const [connectingWallet, setConnectingWallet] = useState(false);
  
  const router = useRouter();
  const { t } = useLanguage();
  const { todayWinTokens, totalWinTokens, todayUSD, totalUSD, refreshFromBackend } = useAdRevenue();

  useEffect(() => {
    fetchDashboard();
    fetchWinBalance();
  }, []);

  // Auto-refresh when screen comes into focus (e.g., after playing a game)
  useFocusEffect(
    useCallback(() => {
      console.log('[DASHBOARD] Screen focused - refreshing data');
      fetchDashboard();
      refreshFromBackend(); // Sync WIN tokens and USD values
    }, [])
  );

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/user/dashboard');
      console.log('📊 [DASHBOARD] Backend response:', response.data);
      setData(response.data);
      
      // Also refresh WIN balance
      await fetchWinBalance();
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchWinBalance = async () => {
    try {
      const response = await api.get('/user/win-balance');
      setWinBalance(response.data);
    } catch (error) {
      console.error('Error fetching WIN balance:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const handleSellToken = async () => {
    // Check wallet connection first
    try {
      const response = await api.get('/wallet/status');
      setWalletStatus(response.data);
      
      if (response.data.connected) {
        // Wallet already connected, redirect to pump.fun
        if (data?.pump_fun_link) {
          Linking.openURL(data.pump_fun_link);
        }
      } else {
        // Wallet not connected, show modal
        setWalletModalVisible(true);
      }
    } catch (error) {
      console.error('Error checking wallet status:', error);
      // Show modal anyway
      setWalletModalVisible(true);
    }
  };

  const formatPassivePlan = () => {
    if (!data?.passive_farm_active) return 'Jo aktiv';
    if (!data.passive_farm_plan) return 'Aktiv';
    if (data.passive_farm_plan === 'daily') return 'Daily';
    if (data.passive_farm_plan === 'weekly') return 'Weekly';
    if (data.passive_farm_plan === 'monthly') return 'Monthly';
    return 'Aktiv';
  };

  const formatPassiveExpiry = () => {
    if (!data?.passive_farm_active || !data.passive_farm_expires_at) return '—';
    try {
      const exp = new Date(data.passive_farm_expires_at);
      return exp.toLocaleDateString() + ' ' + exp.toLocaleTimeString();
    } catch {
      return '—';
    }
  };

  const openPassiveModal = () => {
    setPassiveModalVisible(true);
  };

  const closePassiveModal = () => {
    setPassiveModalVisible(false);
    setSubscribingPlan(null);
  };

  const handleSubscribe = async (plan: 'daily' | 'weekly' | 'monthly') => {
    if (!data) return;
    setSubscribingPlan(plan);
    try {
      setSubscribing(true);
      const res = await api.post('/user/passive-farm/subscribe', { plan });
      Alert.alert('Sukses', res.data?.message || 'Passive Farm u aktivizua!');
      await fetchDashboard();
      closePassiveModal();
    } catch (error: any) {
      console.error('Error subscribing passive farm:', error);
      const msg = error?.response?.data?.detail || 'Nuk mund të blihet plani. Provo përsëri.';
      Alert.alert('Gabim', msg);
    } finally {
      setSubscribing(false);
      setSubscribingPlan(null);
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
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />
        }
      >
        <View style={styles.content}>
          {/* Language Selector - Fixed Position */}
          <View style={styles.languageSelectorContainer}>
          </View>
          
          <View style={styles.header}>
            <Text style={styles.title}>{t('dashboard.title')}</Text>
          </View>
          
          {/* 🔥 AD #1: Top Banner (High Visibility) */}
          <AdSensePlaceholder type="banner" format="responsive" />
          <AdSenseBanner slot="1234567890" format="responsive" />

          {/* Card 1: Pending Earnings - LIVE Updates! */}
          <View style={[styles.earningsCard, styles.pendingCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="hourglass" size={28} color="#FF9800" />
              <Text style={styles.cardLabel}>{t('dashboard.pending')}</Text>
            </View>
            <Text style={styles.cardAmount}>${data?.pending_revenue_usd.toFixed(6) || '0.000000'} USD</Text>
            <Text style={styles.cardSubtext}>
              ≈ {data?.pending_tokens.toFixed(2) || '0.00'} WIN tokens
            </Text>
            <View style={styles.cardFooter}>
              <Ionicons name="time-outline" size={16} color="#FF9800" />
              <Text style={styles.cardFooterText}>Converts at midnight (00:00)</Text>
            </View>
          </View>

          {/* Card 2: Today's Rewards - Daily Progress */}
          <View style={[styles.earningsCard, styles.todayCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="today" size={24} color="#2196F3" />
              <Text style={styles.cardLabel}>{t('dashboard.todayEarnings')}</Text>
            </View>
            <Text style={styles.cardAmount}>
              ${(data?.today_earnings_usd || 0).toFixed(4)}
            </Text>
            <Text style={styles.cardSubtext}>
              {((data?.today_earnings_usd || 0) * 60).toFixed(2)} WIN tokens (60%)
            </Text>
          </View>

          {/* 🔥 AD #2: Native Ad (Blends with content) */}
          <AdSensePlaceholder type="native" />
          <AdSenseNative slot="4234567890" layout="image-top" />
          
          {/* Card 3: All-Time Earnings - Total Achievement */}
          <View style={[styles.earningsCard, styles.totalCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="trending-up" size={24} color="#4CAF50" />
              <Text style={styles.cardLabel}>{t('dashboard.totalEarnings')}</Text>
            </View>
            <Text style={styles.cardAmount}>
              ${(data?.total_earnings_usd || 0).toFixed(4)}
            </Text>
            <Text style={styles.cardSubtext}>
              {((data?.total_earnings_usd || 0) * 60).toFixed(2)} WIN tokens (60%)
            </Text>
          </View>

          {/* Card 4: Referral Earnings - Social Rewards */}
          <View style={[styles.earningsCard, styles.referralCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="people" size={24} color="#9C27B0" />
              <Text style={styles.cardLabel}>{t('dashboard.referralEarnings')}</Text>
            </View>
            <Text style={styles.cardAmount}>${data?.referral_earnings_usd.toFixed(2) || '0.00'}</Text>
            <Text style={styles.cardSubtext}>
              {data?.referred_users_count || 0} {t('dashboard.friendsReferred')}
            </Text>
          </View>

          {/* Card 5: WIN Balance - Blockchain Earnings */}
          <View style={[styles.earningsCard, styles.winBalanceCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="logo-bitcoin" size={24} color="#FF9800" />
              <Text style={styles.cardLabel}>WIN Token Balance</Text>
            </View>
            
            {winBalance ? (
              <>
                <View style={styles.winBalanceRow}>
                  <View style={styles.winBalanceItem}>
                    <Text style={styles.winBalanceLabel}>🔓 Available</Text>
                    <Text style={styles.winBalanceAmount}>
                      {winBalance.available_win.toFixed(2)} WIN
                    </Text>
                  </View>
                  <View style={styles.winBalanceItem}>
                    <Text style={styles.winBalanceLabel}>🔒 Locked</Text>
                    <Text style={styles.winBalanceLocked}>
                      {winBalance.locked_win.toFixed(2)} WIN
                    </Text>
                  </View>
                </View>

                <View style={styles.winTotalRow}>
                  <Text style={styles.winTotalLabel}>Total:</Text>
                  <Text style={styles.winTotalAmount}>
                    {winBalance.total_win.toFixed(2)} WIN
                  </Text>
                </View>

                {winBalance.vesting_count > 0 && (
                  <View style={styles.vestingInfo}>
                    <Ionicons name="time-outline" size={14} color="#FF9800" />
                    <Text style={styles.vestingText}>
                      {winBalance.vesting_count} vesting schedule{winBalance.vesting_count > 1 ? 's' : ''} • Unlocks in 15 days
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={styles.cardSubtext}>Loading WIN balance...</Text>
            )}
          </View>

          {/* Passive Farm Card */}
          <View style={[styles.earningsCard, styles.passiveCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="leaf" size={24} color="#FFC107" />
              <Text style={styles.cardLabel}>{t('dashboard.passiveFarm')}</Text>
            </View>
            <Text style={styles.cardSubtext}>
              {t('dashboard.status')}: <Text style={styles.passiveStatus}>{formatPassivePlan()}</Text>
            </Text>
            <Text style={styles.cardSubtext}>
              {t('dashboard.expires')}: <Text style={styles.passiveStatus}>{formatPassiveExpiry()}</Text>
            </Text>
            <TouchableOpacity style={styles.extendButton} onPress={() => setPassiveModalVisible(true)}>
              <Ionicons name="add-circle" size={16} color="#4CAF50" />
              <Text style={styles.extendButtonText}>
                {data?.passive_farm_active ? t('dashboard.extend') : t('dashboard.activate')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity style={styles.playButton} onPress={() => router.push('/(tabs)/games')}>
            <Ionicons name="game-controller" size={24} color="#fff" />
            <Text style={styles.playButtonText}>{t('dashboard.playGame')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sellButton} onPress={handleSellToken}>
            <Ionicons name="cash" size={24} color="#4CAF50" />
            <Text style={styles.sellButtonText}>{t('dashboard.sellToken')}</Text>
          </TouchableOpacity>
          
          {/* 🔥 AD #3: In-Feed Banner (Between content) */}
          <AdSenseBanner slot="1234567891" format="responsive" />
          
          {/* 🔥 AD #4: Multiplex Grid (Recommended content ads) */}
          <AdSensePlaceholder type="multiplex" />
          <AdSenseMultiplex slot="5234567890" rows={2} columns={2} />
          
          {/* 🔥 AD #5: Sticky Bottom Banner (Always visible) */}
          <AdSenseBanner slot="1234567893" format="responsive" sticky />
        </View>
      </ScrollView>

      {/* Passive Farm Overlay (works the same on web & mobile) */}
      {passiveModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Passive Farm</Text>
            <Text style={styles.modalSubtitle}>
              Zgjidh një plan për të marrë WIN tokens automatikisht çdo ditë. Pagesa bëhet me WIN
              tokens nga balanca jote.
            </Text>

            <View style={styles.modalPlans}>
              <TouchableOpacity
                style={styles.modalPlanButton}
                onPress={() => handleSubscribe('daily')}
                disabled={subscribing}
              >
                <View style={styles.modalPlanHeader}>
                  <Text style={styles.modalPlanTitle}>Ditor</Text>
                  <Text style={styles.modalPlanBadge}>1 ditë</Text>
                </View>
                <Text style={styles.modalPlanDesc}>Fillim i shpejtë për të testuar Passive Farm.</Text>
                <Text style={styles.modalPlanPrice}>Kosto: ~100 WIN</Text>
                {subscribing && subscribingPlan === 'daily' && (
                  <ActivityIndicator style={styles.modalPlanLoader} color="#4CAF50" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPlanButton}
                onPress={() => handleSubscribe('weekly')}
                disabled={subscribing}
              >
                <View style={styles.modalPlanHeader}>
                  <Text style={styles.modalPlanTitle}>Javor</Text>
                  <Text style={styles.modalPlanBadge}>7 ditë</Text>
                </View>
                <Text style={styles.modalPlanDesc}>Plani më i balancuar për përdorues aktiv.</Text>
                <Text style={styles.modalPlanPrice}>Kosto: ~600 WIN</Text>
                {subscribing && subscribingPlan === 'weekly' && (
                  <ActivityIndicator style={styles.modalPlanLoader} color="#4CAF50" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPlanButton}
                onPress={() => handleSubscribe('monthly')}
                disabled={subscribing}
              >
                <View style={styles.modalPlanHeader}>
                  <Text style={styles.modalPlanTitle}>Mujor</Text>
                  <Text style={styles.modalPlanBadge}>30 ditë</Text>
                </View>
                <Text style={styles.modalPlanDesc}>Maksimizo pasivitetin me çmim më të mirë.</Text>
                <Text style={styles.modalPlanPrice}>Kosto: ~2000 WIN</Text>
                {subscribing && subscribingPlan === 'monthly' && (
                  <ActivityIndicator style={styles.modalPlanLoader} color="#4CAF50" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.modalCloseButton} onPress={closePassiveModal}>
              <Text style={styles.modalCloseText}>Mbyll</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Solana Wallet Connection Modal */}
      <Modal
        visible={walletModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setWalletModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>🔗 Lidh Solana Wallet</Text>
            <Text style={styles.modalSubtitle}>
              Lidh wallet-in tënd Solana për të shitur WIN tokens në Pump.fun
            </Text>

            {walletStatus?.connected ? (
              <View style={styles.walletConnected}>
                <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
                <Text style={styles.walletConnectedText}>Wallet i lidhur!</Text>
                <Text style={styles.walletAddress}>
                  {walletStatus.wallet_address?.slice(0, 8)}...{walletStatus.wallet_address?.slice(-8)}
                </Text>
                <TouchableOpacity
                  style={styles.sellNowButton}
                  onPress={() => {
                    setWalletModalVisible(false);
                    if (data?.pump_fun_link) {
                      Linking.openURL(data.pump_fun_link);
                    }
                  }}
                >
                  <Text style={styles.sellNowButtonText}>Shit Tokens Tani</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.walletInputLabel}>Vendos Solana Wallet Address:</Text>
                <TextInput
                  style={styles.walletInput}
                  placeholder="Shembull: 7EnbCIv9BpE..."
                  placeholderTextColor="#666"
                  value={walletAddress}
                  onChangeText={setWalletAddress}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={async () => {
                    if (!walletAddress || walletAddress.trim().length < 32) {
                      Alert.alert('Gabim', 'Ju lutem vendosni një wallet address të vlefshëm');
                      return;
                    }
                    try {
                      setConnectingWallet(true);
                      await api.post('/wallet/connect', {
                        wallet_address: walletAddress.trim()
                      });
                      Alert.alert('Sukses', 'Wallet u lidh me sukses!');
                      // Refresh status
                      const response = await api.get('/wallet/status');
                      setWalletStatus(response.data);
                    } catch (error) {
                      console.error('Error connecting wallet:', error);
                      Alert.alert('Gabim', 'Nuk u lidh wallet-i. Provoni përsëri.');
                    } finally {
                      setConnectingWallet(false);
                    }
                  }}
                  disabled={connectingWallet}
                >
                  {connectingWallet ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.connectButtonText}>Lidh Wallet</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setWalletModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Mbyll</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
    padding: 16,
    paddingTop: 60,
  },
  languageSelectorContainer: {
    position: 'absolute',
    top: 10,
    right: 16,
    zIndex: 9999,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  balanceCard: {
    backgroundColor: '#1a3a1a',
    alignItems: 'center',
  },
  pendingCard: {
    backgroundColor: '#2a1a0a',
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pendingTitle: {
    fontSize: 16,
    color: '#FF9800',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  pendingAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFB74D',
    marginVertical: 8,
  },
  pendingSubtext: {
    fontSize: 16,
    color: '#FF9800',
    marginBottom: 8,
  },
  pendingNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  cardTitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  gridValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sellButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // New Earnings Cards Styles
  earningsCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 100,
  },
  todayCard: {
    backgroundColor: '#0a1a2a',
    borderColor: '#2196F3',
  },
  totalCard: {
    backgroundColor: '#0a1a0a',
    borderColor: '#4CAF50',
  },
  referralCard: {
    backgroundColor: '#1a0a1a',
    borderColor: '#9C27B0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  cardAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 12,
    color: '#999',
    marginBottom: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  cardFooterText: {
    fontSize: 11,
    color: '#999',
    marginLeft: 6,
  },
  passiveCard: {
    backgroundColor: '#1a1a0a',
    borderColor: '#FFC107',
  },
  passiveStatus: {
    color: '#FFC107',
    fontWeight: '600',
  },
  passiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC107',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  passiveButtonText: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#000',
  },
  extendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  extendButtonText: {
    marginLeft: 6,
    fontWeight: '600',
    color: '#fff',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 16,
  },
  modalPlans: {
    marginBottom: 16,
  },
  modalPlanButton: {
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  modalPlanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalPlanBadge: {
    fontSize: 12,
    color: '#FFC107',
    borderWidth: 1,
    borderColor: '#FFC107',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  modalPlanDesc: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 4,
  },
  modalPlanPrice: {
    fontSize: 13,
    color: '#FFC107',
    marginTop: 6,
    fontWeight: '600',
  },
  modalPlanLoader: {
    marginTop: 8,
  },
  modalCloseButton: {
    marginTop: 4,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#444',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
  },
  // WIN Balance Card Styles
  winBalanceCard: {
    backgroundColor: '#1a0f0a',
    borderColor: '#FF9800',
  },
  winBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  winBalanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  winBalanceLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  winBalanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  winBalanceLocked: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  winTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  winTotalLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  winTotalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  vestingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  vestingText: {
    fontSize: 11,
    color: '#FF9800',
    marginLeft: 6,
  },
  walletConnected: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  walletConnectedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 12,
  },
  walletAddress: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  sellNowButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  sellNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  walletInputLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  walletInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
