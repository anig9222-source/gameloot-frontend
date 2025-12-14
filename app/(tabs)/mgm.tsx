import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../utils/api';
import LanguageSelectorButton from '../../components/LanguageSelectorButton';
import AdSenseBanner from '../../components/AdSenseBanner';
import AdSensePlaceholder from '../../components/AdSensePlaceholder';

interface Subscription {
  active: boolean;
  tier?: string;
  investment?: number;
  daily_reward?: number;
  accumulated_rewards?: number;
  start_date?: string;
  end_date?: string;
  days_remaining?: number;
  is_expired?: boolean;
  can_claim?: boolean;
}

interface Package {
  id: string;
  name: string;
  cost: number;
  daily_reward: number;
  days: number;
  total_reward: number;
  roi: string;
  available: boolean;
  limited?: boolean;
  slots_remaining?: number;
  slots_total?: number;
}

interface MGMStatus {
  subscription: Subscription;
  packages: Package[];
  config: {
    early_cancel_penalty: number;
    coin_ticker: string;
  };
}

export default function MGMScreen() {
  const { t } = useLanguage();
  const [mgmStatus, setMgmStatus] = useState<MGMStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMGMStatus = useCallback(async () => {
    try {
      const response = await api.get('/mgm/status');
      setMgmStatus(response.data);
    } catch (error) {
      console.error('Error fetching MGM status:', error);
      Alert.alert('Gabim', 'Nuk mund të ngarkohen të dhënat');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMGMStatus();
  }, [fetchMGMStatus]);

  const handleSubscribe = async (packageId: string, packageData: Package) => {
    console.log('[MGM] Subscribe button clicked for package:', packageId, packageData);
    
    Alert.alert(
      `Subscribe: ${packageData.name}`,
      `💰 Kosto: ${packageData.cost} WIN\n📅 Kohëzgjatja: ${packageData.days} ditë\n⭐ Shpërblim ditor: ${packageData.daily_reward} WIN\n💎 Total shpërblim: ${packageData.total_reward} WIN (${packageData.roi})\n\n⚠️ KUJDES: Investimi është i bllokuar për ${packageData.days} ditë. Nëse anullon më herët, humbet TË GJITHA rewards!`,
      [
        { text: 'Anulo', style: 'cancel' },
        {
          text: 'Subscribe',
          style: 'default',
          onPress: async () => {
            console.log('[MGM] User confirmed subscription, starting API call...');
            setSubscribing(true);
            try {
              console.log('[MGM] Calling API: POST /mgm/subscribe with tier:', packageId);
              const response = await api.post('/mgm/subscribe', { tier: packageId });
              console.log('[MGM] API response:', response.data);

              Alert.alert(
                '🎉 Sukses!',
                response.data.message,
                [{ text: 'OK', onPress: () => fetchMGMStatus() }]
              );
            } catch (error: any) {
              console.error('[MGM] Subscription error:', error);
              console.error('[MGM] Error response:', error.response?.data);
              Alert.alert(
                'Gabim', 
                error.response?.data?.detail || error.message || 'Subscription dështoi'
              );
            } finally {
              setSubscribing(false);
              console.log('[MGM] Subscription process completed');
            }
          },
        },
      ]
    );
  };

  const handleClaim = async () => {
    Alert.alert(
      'Merr Rewards',
      `Je i sigurt që dëshiron të marrësh ${mgmStatus?.subscription.accumulated_rewards} WIN?`,
      [
        { text: 'Anulo', style: 'cancel' },
        {
          text: 'Merr',
          style: 'default',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await api.post('/mgm/claim');

              Alert.alert(
                '🎉 Sukses!',
                response.data.message,
                [{ text: 'OK', onPress: () => fetchMGMStatus() }]
              );
            } catch (error: any) {
              Alert.alert('Gabim', error.response?.data?.detail || 'Claim dështoi');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCancel = async () => {
    Alert.alert(
      '⚠️ KUJDES: Anulim i Hershëm',
      `Nëse anullon tani, do të HUMBASËSH të gjitha ${mgmStatus?.subscription.accumulated_rewards} WIN që ke akumuluar!\n\nKy veprim është i PAKTHYESHËM.\n\nJe i sigurt?`,
      [
        { text: 'Jo, mos anulo', style: 'cancel' },
        {
          text: 'Po, anulo',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await api.post('/mgm/cancel');

              Alert.alert(
                'Subscription Anuluar',
                response.data.message,
                [{ text: 'OK', onPress: () => fetchMGMStatus() }]
              );
            } catch (error: any) {
              Alert.alert('Gabim', error.response?.data?.detail || 'Cancel dështoi');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMGMStatus();
  }, [fetchMGMStatus]);

  if (loading && !mgmStatus) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Duke ngarkuar...</Text>
      </View>
    );
  }

  const { subscription, packages } = mgmStatus || {};

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FFD700']} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="diamond" size={48} color="#FFD700" />
        <Text style={styles.headerTitle}>{t('mgm.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('mgm.subtitle')}
        </Text>
      </View>
      
      {/* 🔥 AD #1: Top Banner */}
      <AdSensePlaceholder type="banner" />
      <AdSenseBanner slot="7234567890" format="responsive" />

      {/* Active Subscription */}
      {subscription?.active && (
        <View style={styles.activeCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
            <Text style={styles.cardTitle}>{t('mgm.activeSubscription')}</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('mgm.investment')}</Text>
              <Text style={styles.statValue}>{subscription.investment} WIN</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('mgm.dailyReward')}</Text>
              <Text style={styles.statValue}>+{subscription.daily_reward} WIN</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('mgm.accumulated')}</Text>
              <Text style={styles.statValueLocked}>
                🔒 {subscription.accumulated_rewards} WIN
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('mgm.daysRemaining')}</Text>
              <Text style={styles.statValue}>{subscription.days_remaining} {t('mgm.days')}</Text>
            </View>
          </View>

          {subscription.can_claim && (
            <TouchableOpacity style={styles.claimButton} onPress={handleClaim}>
              <Text style={styles.claimButtonText}>🎉 {t('mgm.claimRewards')}</Text>
            </TouchableOpacity>
          )}

          {subscription.days_remaining !== undefined && subscription.days_remaining > 0 && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>⚠️ {t('mgm.cancelSub')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Available Packages */}
      {!subscription?.active && (
        <>
          <Text style={styles.sectionTitle}>{t('mgm.selectPackage')}</Text>

          {packages?.map((pkg) => (
            <View key={pkg.id} style={styles.packageCard}>
              <View style={styles.packageHeader}>
                <Text style={styles.packageName}>{pkg.name}</Text>
                {pkg.limited && !pkg.available && (
                  <Text style={styles.soldOutBadge}>SOLD OUT</Text>
                )}
                {pkg.limited && pkg.available && (
                  <Text style={styles.limitedBadge}>
                    Limited: {pkg.slots_remaining}/{pkg.slots_total}
                  </Text>
                )}
              </View>

              <View style={styles.packageDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>💰 Kosto:</Text>
                  <Text style={styles.detailValue}>{pkg.cost} WIN</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>📅 Kohëzgjatja:</Text>
                  <Text style={styles.detailValue}>{pkg.days} ditë ({pkg.name})</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>⭐ Shpërblim ditor:</Text>
                  <Text style={styles.detailValue}>{pkg.daily_reward} WIN</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>💎 Total shpërblim:</Text>
                  <Text style={[styles.detailValue, styles.highlight]}>
                    {pkg.total_reward} WIN
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>📈 ROI:</Text>
                  <Text style={[styles.detailValue, styles.highlight]}>
                    {pkg.roi}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  (!pkg.available || subscribing) && styles.subscribeButtonDisabled,
                ]}
                onPress={() => handleSubscribe(pkg.id, pkg)}
                disabled={!pkg.available || subscribing}
              >
                <Text style={styles.subscribeButtonText}>
                  {!pkg.available ? 'SOLD OUT' : subscribing ? 'Duke u përpunuar...' : 'Subscribe'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}

      {/* Info Section */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Si funksionon?</Text>
        <Text style={styles.infoText}>
          • Zgjidh paketën që të përshtatet (1-6 muaj, 1-2 vjet)
        </Text>
        <Text style={styles.infoText}>
          • Investimi është <Text style={styles.bold}>i bllokuar</Text> për kohëzgjatjen e zgjedhur
        </Text>
        <Text style={styles.infoText}>
          • Merr rewards <Text style={styles.bold}>çdo ditë</Text> (automatikisht)
        </Text>
        <Text style={styles.infoText}>
          • Rewards janë <Text style={styles.bold}>të bllokuara</Text> deri në fund
        </Text>
        <Text style={styles.infoText}>
          • Pas skadimit, merr <Text style={styles.bold}>TË GJITHA</Text> rewards në një herë
        </Text>
        <Text style={[styles.infoText, styles.warning]}>
          ⚠️ Anulim i hershëm = Humb TË GJITHA rewards (100% penaliteti)
        </Text>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0e1a',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#1a1f2e',
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 4,
  },
  activeCard: {
    backgroundColor: '#1a1f2e',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#0a0e1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginRight: '2%',
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a0a0',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  statValueLocked: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  claimButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  claimButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  packageCard: {
    backgroundColor: '#1a1f2e',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  soldOutBadge: {
    backgroundColor: '#f44336',
    color: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  limitedBadge: {
    backgroundColor: '#ff6b6b',
    color: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  packageDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#cccccc',
  },
  detailValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  highlight: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  subscribeButton: {
    backgroundColor: '#FFD700',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  subscribeButtonText: {
    color: '#0a0e1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#1a1f2e',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 8,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  warning: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    marginTop: 8,
  },
  spacer: {
    height: 32,
  },
});
