import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function AdminDashboard() {
  const [config, setConfig] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedConfig, setEditedConfig] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = await AsyncStorage.getItem('admin_token');
      if (!token) {
        router.replace('/admin');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [configRes, usersRes, payoutsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/config`, { headers }),
        axios.get(`${API_URL}/api/admin/users`, { headers }),
        axios.get(`${API_URL}/api/admin/payouts`, { headers })
      ]);

      setConfig(configRes.data);
      setEditedConfig(configRes.data);
      setUsers(usersRes.data.users);
      setPayouts(payoutsRes.data.payouts);
    } catch (error: any) {
      console.error('Error fetching admin data:', error);
      if (error.response?.status === 403) {
        Alert.alert('Gabim', 'Sesioni ka skaduar');
        router.replace('/admin');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminData();
  };

  const handleSaveConfig = async () => {
    try {
      const token = await AsyncStorage.getItem('admin_token');
      await axios.put(
        `${API_URL}/api/admin/config`,
        editedConfig,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Alert.alert('Sukses', 'Konfigurimi u përditësua!');
      setConfig(editedConfig);
      setEditMode(false);
    } catch (error) {
      Alert.alert('Gabim', 'Dështoi përditësimi i konfigurimit');
    }
  };

  const handleApprovePayout = async (payoutId: string, status: string) => {
    try {
      const token = await AsyncStorage.getItem('admin_token');
      await axios.put(
        `${API_URL}/api/admin/payout/approve`,
        { payout_id: payoutId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Alert.alert('Sukses', `Payout u ${status}!`);
      fetchAdminData();
    } catch (error: any) {
      Alert.alert('Gabim', error.response?.data?.detail || 'Dështoi procesimi');
    }
  };

  const triggerSettlement = async () => {
    try {
      const token = await AsyncStorage.getItem('admin_token');
      await axios.post(
        `${API_URL}/api/admin/trigger-settlement`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Alert.alert('Sukses', 'Settlement u aktivizua!');
    } catch (error) {
      Alert.alert('Gabim', 'Dështoi aktivizimi i settlement');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF9800" />
      }
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FF9800" />
          </TouchableOpacity>
          <Text style={styles.title}>Admin Dashboard</Text>
        </View>

        {/* Quick Nav Buttons */}
        <View style={styles.quickNavGrid}>
          <TouchableOpacity
            style={[styles.quickNavButton, { backgroundColor: '#1a3a1a', borderColor: '#4CAF50' }]}
            onPress={() => router.push('/admin/users')}
          >
            <Ionicons name="people" size={32} color="#4CAF50" />
            <Text style={styles.quickNavText}>Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickNavButton, { backgroundColor: '#1a1a2a', borderColor: '#2196F3' }]}
            onPress={() => router.push('/admin/events')}
          >
            <Ionicons name="document-text" size={32} color="#2196F3" />
            <Text style={styles.quickNavText}>Events</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={32} color="#4CAF50" />
            <Text style={styles.statValue}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="cash" size={32} color="#FFD700" />
            <Text style={styles.statValue}>{payouts.filter(p => p.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending Payouts</Text>
          </View>
        </View>

        {/* Config Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Konfigurimi</Text>
            <TouchableOpacity onPress={() => setEditMode(!editMode)}>
              <Ionicons name={editMode ? 'close' : 'create'} size={24} color="#FF9800" />
            </TouchableOpacity>
          </View>

          {editMode ? (
            <View>
              <Text style={styles.label}>Platform Fee (%)</Text>
              <TextInput
                style={styles.input}
                value={(editedConfig.platform_fee * 100).toString()}
                onChangeText={(text) => setEditedConfig({...editedConfig, platform_fee: parseFloat(text) / 100})}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Referral Rate (%)</Text>
              <TextInput
                style={styles.input}
                value={(editedConfig.referral_rate * 100).toString()}
                onChangeText={(text) => setEditedConfig({...editedConfig, referral_rate: parseFloat(text) / 100})}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Token Rate (USD per token)</Text>
              <TextInput
                style={styles.input}
                value={editedConfig.token_rate_usd?.toString()}
                onChangeText={(text) => setEditedConfig({...editedConfig, token_rate_usd: parseFloat(text)})}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Min Withdraw (USD)</Text>
              <TextInput
                style={styles.input}
                value={editedConfig.min_withdraw_usd?.toString()}
                onChangeText={(text) => setEditedConfig({...editedConfig, min_withdraw_usd: parseFloat(text)})}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Daily Limit (USD)</Text>
              <TextInput
                style={styles.input}
                value={editedConfig.daily_withdraw_limit_usd?.toString()}
                onChangeText={(text) => setEditedConfig({...editedConfig, daily_withdraw_limit_usd: parseFloat(text)})}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Pump.fun Link</Text>
              <TextInput
                style={styles.input}
                value={editedConfig.pump_fun_link}
                onChangeText={(text) => setEditedConfig({...editedConfig, pump_fun_link: text})}
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveConfig}>
                <Text style={styles.saveButtonText}>Ruaj Ndryshimet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Platform Fee:</Text>
                <Text style={styles.configValue}>{(config?.platform_fee * 100).toFixed(0)}%</Text>
              </View>
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Referral Rate:</Text>
                <Text style={styles.configValue}>{(config?.referral_rate * 100).toFixed(0)}%</Text>
              </View>
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Token Rate:</Text>
                <Text style={styles.configValue}>${config?.token_rate_usd} per token</Text>
              </View>
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Min Withdraw:</Text>
                <Text style={styles.configValue}>${config?.min_withdraw_usd}</Text>
              </View>
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Daily Limit:</Text>
                <Text style={styles.configValue}>${config?.daily_withdraw_limit_usd}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Settlement Button */}
        <TouchableOpacity style={styles.settlementButton} onPress={triggerSettlement}>
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.settlementButtonText}>Trigger Daily Settlement</Text>
        </TouchableOpacity>

        {/* Pending Payouts */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pending Payouts</Text>
          {payouts.filter(p => p.status === 'pending').map((payout) => (
            <View key={payout._id} style={styles.payoutItem}>
              <View style={styles.payoutInfo}>
                <Text style={styles.payoutEmail}>{payout.user_email}</Text>
                <Text style={styles.payoutAmount}>${payout.amount_usd.toFixed(2)}</Text>
              </View>
              <View style={styles.payoutActions}>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => handleApprovePayout(payout._id, 'approved')}
                >
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleApprovePayout(payout._id, 'rejected')}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {payouts.filter(p => p.status === 'pending').length === 0 && (
            <Text style={styles.emptyText}>Nuk ka payout pending</Text>
          )}
        </View>

        {/* Recent Users */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Users</Text>
          {users.slice(0, 10).map((user) => (
            <View key={user._id} style={styles.userItem}>
              <Ionicons name="person-circle" size={32} color="#4CAF50" />
              <View style={styles.userInfo}>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userStat}>
                  {user.token_balance?.toFixed(2) || 0} tokens | ${user.total_earnings_usd?.toFixed(2) || 0}
                </Text>
              </View>
            </View>
          ))}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9800',
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
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#0c0c0c',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  configLabel: {
    fontSize: 14,
    color: '#999',
  },
  configValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  settlementButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  settlementButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  payoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  payoutInfo: {
    flex: 1,
  },
  payoutEmail: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  payoutActions: {
    flexDirection: 'row',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  rejectButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  userStat: {
    fontSize: 12,
    color: '#999',
  },
  quickNavGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickNavButton: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  quickNavText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
});