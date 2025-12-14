import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import api from '../../utils/api';

interface Transaction {
  _id: string;
  game_type: string;
  revenue_usd: number;
  timestamp: string;
  settled: boolean;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/game/history');
      setTransactions(response.data.sessions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('sq-AL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGameIcon = (gameType: string) => {
    switch (gameType) {
      case 'spin': return 'disc';
      case 'tap': return 'hand-left';
      case 'quiz': return 'help-circle';
      default: return 'game-controller';
    }
  };

  const getGameColor = (gameType: string) => {
    switch (gameType) {
      case 'spin': return '#FF9800';
      case 'tap': return '#2196F3';
      case 'quiz': return '#9C27B0';
      default: return '#4CAF50';
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
        <Text style={styles.title}>Historiku i Transaksioneve</Text>
        <Text style={styles.subtitle}>{transactions.length} transaksione totale</Text>

        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <View key={transaction._id} style={styles.transactionCard}>
              <View style={[styles.iconContainer, { backgroundColor: getGameColor(transaction.game_type) + '20' }]}>
                <Ionicons
                  name={getGameIcon(transaction.game_type) as any}
                  size={32}
                  color={getGameColor(transaction.game_type)}
                />
              </View>

              <View style={styles.transactionContent}>
                <Text style={styles.gameName}>
                  {transaction.game_type === 'spin' ? 'Spin Wheel' : transaction.game_type === 'tap' ? 'Tap Game' : 'Quiz Game'}
                </Text>
                <Text style={styles.transactionDate}>{formatDate(transaction.timestamp)}</Text>
                <View style={styles.statusBadge}>
                  <Ionicons
                    name={transaction.settled ? 'checkmark-circle' : 'time'}
                    size={14}
                    color={transaction.settled ? '#4CAF50' : '#FF9800'}
                  />
                  <Text style={[styles.statusText, { color: transaction.settled ? '#4CAF50' : '#FF9800' }]}>
                    {transaction.settled ? 'Settled' : 'Pending'}
                  </Text>
                </View>
              </View>

              <Text style={styles.revenue}>${transaction.revenue_usd.toFixed(4)}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>Nuk ka transaksione</Text>
            <Text style={styles.emptySubtext}>Luaj lojëra për të filluar të fitosh!</Text>
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
  transactionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionContent: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  revenue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
