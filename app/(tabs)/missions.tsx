import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../utils/api';
import LanguageSelectorButton from '../../components/LanguageSelectorButton';
import AdSenseBanner from '../../components/AdSenseBanner';
import AdSensePlaceholder from '../../components/AdSensePlaceholder';
import { useAdRevenue } from '../../contexts/AdRevenueContext';

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  completed: boolean;
  icon: string;
  color: string;
}

export default function Missions() {
  const { t } = useLanguage();
  const { refreshFromBackend } = useAdRevenue();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const response = await api.get('/missions');
      setMissions(response.data.missions || []);
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMissions();
  };

  const handleClaimReward = async (missionId: string) => {
    try {
      const response = await api.post('/missions/claim', { mission_id: missionId });
      
      if (response.data.success) {
        console.log(`✅ Claimed reward for mission: ${missionId}`);
        console.log(`💰 Reward: ${response.data.reward} WIN tokens`);
        
        // 🔄 CRITICAL: Refresh all data across app
        await fetchMissions(); // Refresh missions list
        await refreshFromBackend(); // Refresh Games & Dashboard cards
        
        console.log('✅ [AUTO-SYNC] All tabs updated after mission claim!');
      }
    } catch (error) {
      console.error('❌ Error claiming reward:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>{t('missions.title')}</Text>
        <Text style={styles.subtitle}>{t('missions.subtitle')}</Text>

        {/* 🔥 AD #1: Top Banner */}
        <AdSensePlaceholder type="banner" />
        <AdSenseBanner slot="6234567890" format="responsive" />

        {missions.map((mission, index) => (
          <View key={mission.id}>
            <View style={styles.missionCard}>
              <View style={[styles.iconContainer, { backgroundColor: mission.color }]}>
                <Ionicons name={mission.icon as any} size={32} color="#fff" />
              </View>
              <View style={styles.missionInfo}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionDesc}>{mission.description}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(mission.progress / mission.target) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {mission.progress} / {mission.target}
                </Text>
              </View>
              <View style={styles.rewardContainer}>
                <Text style={styles.rewardAmount}>+{mission.reward}</Text>
                <Text style={styles.rewardLabel}>WIN</Text>
                
                {/* Collect Button - Visible when mission is completed */}
                {mission.completed && (
                  <TouchableOpacity
                    style={styles.collectButton}
                    onPress={() => handleClaimReward(mission.id)}
                  >
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.collectButtonText}>Mbledhur</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            {/* 🔥 AD #2: In-Feed Native (After every 2 missions) */}
            {index === 1 && (
              <>
                <AdSensePlaceholder type="native" />
                <AdSenseBanner slot="6234567891" format="responsive" />
              </>
            )}
          </View>
        ))}

        {/* 🔥 AD #3: Bottom Banner */}
        <AdSensePlaceholder type="banner" />
        <AdSenseBanner slot="6234567892" format="responsive" />

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
  },
  missionCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  missionDesc: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  rewardContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  rewardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  rewardLabel: {
    fontSize: 12,
    color: '#999',
  },
  collectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    gap: 6,
  },
  collectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
