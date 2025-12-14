import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface User {
  _id: string;
  email: string;
  token_balance: number;
  total_earnings_usd: number;
  referral_code: string;
  referred_by?: string;
  created_at: string;
  last_login?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('admin_token');
      if (!token) return;

      const [usersRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUsers(usersRes.data.users || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('sq-AL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => {
    if (!filter) return true;
    return (
      user.email.toLowerCase().includes(filter.toLowerCase()) ||
      user.referral_code.toLowerCase().includes(filter.toLowerCase())
    );
  });

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
        <Text style={styles.title}>User Management</Text>

        {/* Stats Cards */}
        {stats && (
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderColor: '#4CAF50' }]}>
              <Ionicons name="people" size={32} color="#4CAF50" />
              <Text style={styles.statValue}>{stats.total_users}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>

            <View style={[styles.statCard, { borderColor: '#2196F3' }]}>
              <Ionicons name="log-in" size={32} color="#2196F3" />
              <Text style={styles.statValue}>{stats.active_today}</Text>
              <Text style={styles.statLabel}>Active Today</Text>
            </View>

            <View style={[styles.statCard, { borderColor: '#FF9800' }]}>
              <Ionicons name="cash" size={32} color="#FF9800" />
              <Text style={styles.statValue}>${stats.total_revenue?.toFixed(2) || '0.00'}</Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>

            <View style={[styles.statCard, { borderColor: '#9C27B0' }]}>
              <Ionicons name="gift" size={32} color="#9C27B0" />
              <Text style={styles.statValue}>{stats.total_tokens?.toFixed(0) || '0'}</Text>
              <Text style={styles.statLabel}>Tokens Issued</Text>
            </View>
          </View>
        )}

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Kërko email ose referral code..."
            placeholderTextColor="#666"
            value={filter}
            onChangeText={setFilter}
          />
        </View>

        <Text style={styles.sectionTitle}>{filteredUsers.length} përdorues</Text>

        {/* Users List */}
        {filteredUsers.map((user) => (
          <View key={user._id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userIcon}>
                <Ionicons name="person" size={24} color="#4CAF50" />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userCode}>Referral: {user.referral_code}</Text>
              </View>
            </View>

            <View style={styles.userStats}>
              <View style={styles.userStat}>
                <Text style={styles.userStatLabel}>Tokens</Text>
                <Text style={styles.userStatValue}>{user.token_balance.toFixed(2)}</Text>
              </View>
              <View style={styles.userStat}>
                <Text style={styles.userStatLabel}>Earnings</Text>
                <Text style={styles.userStatValue}>${user.total_earnings_usd.toFixed(2)}</Text>
              </View>
              <View style={styles.userStat}>
                <Text style={styles.userStatLabel}>Joined</Text>
                <Text style={styles.userStatValue}>{formatDate(user.created_at)}</Text>
              </View>
            </View>

            {user.last_login && (
              <View style={styles.userFooter}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.userFooterText}>Last login: {formatDate(user.last_login)}</Text>
              </View>
            )}
          </View>
        ))}

        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>Nuk ka përdorues</Text>
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
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  userCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a3a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userCode: {
    fontSize: 12,
    color: '#999',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  userStat: {
    alignItems: 'center',
  },
  userStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  userStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  userFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  userFooterText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});
