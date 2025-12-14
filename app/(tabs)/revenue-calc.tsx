import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';

export default function RevenueCalculator() {
  const [loading, setLoading] = useState(true);
  const [projection, setProjection] = useState<any>(null);
  const [selectedStrategy, setSelectedStrategy] = useState('balanced');
  const [hours, setHours] = useState(10);

  useEffect(() => {
    fetchProjection();
  }, [hours]);

  const fetchProjection = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/revenue/projection?hours=${hours}`);
      setProjection(response.data);
    } catch (error) {
      console.error('Error fetching projection:', error);
      Alert.alert('Gabim', 'Nuk mund të ngarkoheshin projektimet.');
    } finally {
      setLoading(false);
    }
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'aggressive': return '#FF6B6B';
      case 'balanced': return '#4CAF50';
      case 'user_friendly': return '#2196F3';
      default: return '#4CAF50';
    }
  };

  const getStrategyIcon = (strategy: string) => {
    switch (strategy) {
      case 'aggressive': return 'flash';
      case 'balanced': return 'speedometer';
      case 'user_friendly': return 'happy';
      default: return 'speedometer';
    }
  };

  const getStrategyName = (strategy: string) => {
    switch (strategy) {
      case 'aggressive': return 'Agresiv';
      case 'balanced': return 'I Balancuar';
      case 'user_friendly': return 'Miqësor';
      default: return strategy;
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(4)}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Duke llogarit earnings...</Text>
      </View>
    );
  }

  if (!projection) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Nuk u gjenden të dhëna</Text>
      </View>
    );
  }

  const currentProj = projection.projections[selectedStrategy];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="calculator" size={48} color="#4CAF50" />
          <Text style={styles.title}>Revenue Calculator</Text>
          <Text style={styles.subtitle}>
            Llogaritje reale bazuar në Google AdMob rates 💰
          </Text>
        </View>

        {/* Location Card */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={24} color="#2196F3" />
            <Text style={styles.locationTitle}>Lokacioni Juaj</Text>
          </View>
          <Text style={styles.locationCountry}>
            {projection.user_location.country_name}
          </Text>
          <Text style={styles.locationCode}>
            Code: {projection.user_location.country_code}
          </Text>
          <Text style={styles.locationNote}>
            CPM rates bazohen në këtë lokacion
          </Text>
        </View>

        {/* Hours Selector */}
        <View style={styles.hoursCard}>
          <Text style={styles.cardTitle}>Zgjedh Kohëzgjatjen</Text>
          <View style={styles.hoursButtons}>
            {[1, 5, 10, 24].map((h) => (
              <TouchableOpacity
                key={h}
                style={[
                  styles.hourButton,
                  hours === h && styles.hourButtonActive
                ]}
                onPress={() => setHours(h)}
              >
                <Text style={[
                  styles.hourButtonText,
                  hours === h && styles.hourButtonTextActive
                ]}>
                  {h}h
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Strategy Selector */}
        <View style={styles.strategyCard}>
          <Text style={styles.cardTitle}>Strategjia e Të Ardhurave</Text>
          {['aggressive', 'balanced', 'user_friendly'].map((strategy) => {
            const strat = projection.projections[strategy];
            return (
              <TouchableOpacity
                key={strategy}
                style={[
                  styles.strategyOption,
                  selectedStrategy === strategy && {
                    borderColor: getStrategyColor(strategy),
                    backgroundColor: `${getStrategyColor(strategy)}20`
                  }
                ]}
                onPress={() => setSelectedStrategy(strategy)}
              >
                <View style={styles.strategyLeft}>
                  <Ionicons
                    name={getStrategyIcon(strategy)}
                    size={28}
                    color={getStrategyColor(strategy)}
                  />
                  <View style={styles.strategyInfo}>
                    <Text style={styles.strategyName}>
                      {getStrategyName(strategy)}
                    </Text>
                    <Text style={styles.strategyAds}>
                      {strat.total_ads} ads në {hours}h
                    </Text>
                  </View>
                </View>
                <Text style={[
                  styles.strategyRevenue,
                  { color: getStrategyColor(strategy) }
                ]}>
                  {formatCurrency(strat.total_revenue)}
                </Text>
              </TouchableOpacity>
            );
          })}
          {selectedStrategy === 'balanced' && (
            <View style={styles.recommendedBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.recommendedText}>Rekomanduar</Text>
            </View>
          )}
        </View>

        {/* Revenue Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.cardTitle}>Breakdown i Detajuar</Text>
          
          <View style={styles.mainStat}>
            <Text style={styles.mainStatLabel}>Total Earnings ({hours}h)</Text>
            <Text style={styles.mainStatValue}>
              {formatCurrency(currentProj.total_revenue)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stat}>
            <Text style={styles.statLabel}>Hourly Rate</Text>
            <Text style={styles.statValue}>
              {formatCurrency(currentProj.hourly_revenue)}/h
            </Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statLabel}>Total Ads</Text>
            <Text style={styles.statValue}>{currentProj.total_ads} ads</Text>
          </View>

          <View style={styles.divider} />

          {/* Ad Type Breakdown */}
          <Text style={styles.breakdownTitle}>Për Lloj Reklame:</Text>
          
          {Object.entries(currentProj.breakdown).map(([type, data]: [string, any]) => (
            <View key={type} style={styles.adTypeRow}>
              <View style={styles.adTypeLeft}>
                <View style={[
                  styles.adTypeDot,
                  { backgroundColor: type === 'video' ? '#FF6B6B' : type === 'interstitial' ? '#FFD700' : '#2196F3' }
                ]} />
                <Text style={styles.adTypeLabel}>
                  {type === 'video' ? '📹 Video' : type === 'interstitial' ? '🎯 Interstitial' : '🖼️ Banner'}
                </Text>
              </View>
              <View style={styles.adTypeRight}>
                <Text style={styles.adTypeCount}>{data.count} ads</Text>
                <Text style={styles.adTypeRevenue}>
                  {formatCurrency(data.revenue)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* CPM Rates */}
        <View style={styles.cpmCard}>
          <Text style={styles.cardTitle}>CPM Rates (për 1000 views)</Text>
          <Text style={styles.cpmNote}>
            Këto janë rates reale nga Google AdMob për {projection.user_location.country_name}
          </Text>
          {Object.entries(currentProj.cpm_rates).map(([type, rate]: [string, any]) => (
            <View key={type} style={styles.cpmRow}>
              <Text style={styles.cpmType}>
                {type === 'video' ? '📹 Video' : type === 'interstitial' ? '🎯 Interstitial' : '🖼️ Banner'}
              </Text>
              <Text style={styles.cpmRate}>${rate.toFixed(2)}</Text>
            </View>
          ))}
          <Text style={styles.cpmFormula}>
            💡 Revenue per ad = CPM / 1000
          </Text>
        </View>

        {/* Transparency Note */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>100% Transparent</Text>
            <Text style={styles.infoText}>
              Këto janë earnings reale bazuar në Google AdMob CPM rates. 
              Vlerat ndryshojnë sipas lokacionit tuaj gjeografik.
              {'\n\n'}
              Kur të integrosh me Google AdMob, këto do të jenë earnings e vërteta!
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
  errorText: {
    color: '#ff4444',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  locationCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  locationCountry: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  locationCode: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  locationNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  hoursCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  hoursButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hourButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  hourButtonActive: {
    backgroundColor: '#4CAF50',
  },
  hourButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hourButtonTextActive: {
    color: '#fff',
  },
  strategyCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  strategyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  strategyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  strategyInfo: {
    marginLeft: 12,
  },
  strategyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  strategyAds: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  strategyRevenue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#2a2a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: -4,
  },
  recommendedText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  breakdownCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  mainStat: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  mainStatLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  mainStatValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
  },
  stat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#999',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  adTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  adTypeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adTypeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  adTypeLabel: {
    fontSize: 13,
    color: '#ccc',
  },
  adTypeRight: {
    alignItems: 'flex-end',
  },
  adTypeCount: {
    fontSize: 12,
    color: '#999',
  },
  adTypeRevenue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 2,
  },
  cpmCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cpmNote: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  cpmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  cpmType: {
    fontSize: 14,
    color: '#ccc',
  },
  cpmRate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  cpmFormula: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#1a2a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#999',
    lineHeight: 20,
  },
});
