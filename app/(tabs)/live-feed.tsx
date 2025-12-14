import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';

interface Activity {
  id: string;
  user: string;
  game_type: string;
  amount: number;
  result: string;
  timestamp: string;
  user_stats: {
    total_earnings: number;
    rank: number;
    games_played: number;
  };
}

export default function LiveFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const fadeAnims = useRef<{ [key: string]: Animated.Value }>({}).current;

  useEffect(() => {
    fetchActivities();
    
    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchActivities(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      const response = await api.get('/live-feed?limit=50');
      const newActivities = response.data.activities || [];
      
      // Animate new entries
      newActivities.forEach((activity: Activity) => {
        if (!fadeAnims[activity.id]) {
          fadeAnims[activity.id] = new Animated.Value(0);
          Animated.timing(fadeAnims[activity.id], {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }
      });
      
      setActivities(newActivities);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching live feed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  const getGameIcon = (gameType: string) => {
    switch (gameType) {
      case 'slot': return '🎰';
      case 'spin': return '🎡';
      case 'tap': return '👆';
      case 'quiz': return '❓';
      default: return '🎮';
    }
  };

  const getGameColor = (gameType: string) => {
    switch (gameType) {
      case 'slot': return '#FFD700';
      case 'spin': return '#FF6B6B';
      case 'tap': return '#4ECDC4';
      case 'quiz': return '#95E1D3';
      default: return '#4CAF50';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 10) return 'Tani';
    if (diffSecs < 60) return `${diffSecs}s`;
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString('sq-AL');
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '🏆';
    return '⭐';
  };

  if (loading && activities.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Duke ngarkuar aktivitete...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <View style={styles.liveBadge}>
              <View style={styles.liveIndicator} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.title}>Aktiviteti Live</Text>
          </View>
          {lastUpdated && (
            <Text style={styles.updateTime}>
              Update: {formatTimeAgo(lastUpdated.toISOString())}
            </Text>
          )}
        </View>
        <Text style={styles.subtitle}>
          Shiko fitoren e përdoruesve në kohë reale 24/7! 🚀
        </Text>
      </View>

      {/* Activities Feed */}
      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />
        }
      >
        {activities.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="radio-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>Asnjë aktivitet për momentin</Text>
            <Text style={styles.emptySubtext}>Aktiviteti do të shfaqet këtu në kohë reale</Text>
          </View>
        ) : (
          activities.map((activity) => (
            <Animated.View
              key={activity.id}
              style={[
                styles.activityCard,
                {
                  opacity: fadeAnims[activity.id] || 1,
                  transform: [
                    {
                      translateY: fadeAnims[activity.id]
                        ? fadeAnims[activity.id].interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          })
                        : 0,
                    },
                  ],
                },
              ]}
            >
              {/* Game Icon */}
              <View
                style={[
                  styles.gameIconContainer,
                  { backgroundColor: getGameColor(activity.game_type) + '20' },
                ]}
              >
                <Text style={styles.gameIcon}>{getGameIcon(activity.game_type)}</Text>
              </View>

              {/* Content */}
              <View style={styles.activityContent}>
                <View style={styles.activityHeader}>
                  <Text style={styles.userName}>
                    {activity.user}
                  </Text>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankEmoji}>{getRankEmoji(activity.user_stats.rank)}</Text>
                    <Text style={styles.rankText}>#{activity.user_stats.rank}</Text>
                  </View>
                </View>

                <Text style={styles.activityText}>
                  {activity.amount > 0 ? (
                    <>
                      <Text style={styles.actionText}>fitoi </Text>
                      <Text style={styles.amountText}>${activity.amount.toFixed(2)}</Text>
                      <Text style={styles.actionText}> nga {activity.game_type}</Text>
                    </>
                  ) : (
                    <Text style={styles.actionText}>luajti {activity.game_type}</Text>
                  )}
                </Text>

                {/* User Stats */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Ionicons name="cash" size={12} color="#4CAF50" />
                    <Text style={styles.statText}>
                      ${activity.user_stats.total_earnings.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="game-controller" size={12} color="#999" />
                    <Text style={styles.statText}>{activity.user_stats.games_played} lojë</Text>
                  </View>
                  <Text style={styles.timeText}>{formatTimeAgo(activity.timestamp)}</Text>
                </View>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
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
  loadingText: {
    color: '#999',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  updateTime: {
    fontSize: 11,
    color: '#666',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  gameIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gameIcon: {
    fontSize: 24,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rankEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  rankText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  activityText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  actionText: {
    color: '#ccc',
  },
  amountText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 15,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 11,
    color: '#999',
    marginLeft: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 'auto',
  },
});
