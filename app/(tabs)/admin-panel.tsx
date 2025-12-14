import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';

// Web-compatible button component
const WebButton = ({ onPress, style, children, disabled }: any) => {
  if (Platform.OS === 'web') {
    // Flatten style array to object
    const flatStyle = Array.isArray(style) 
      ? Object.assign({}, ...style.filter(Boolean))
      : style || {};
    
    // Convert React Native styles to CSS
    const cssStyle: any = {
      backgroundColor: flatStyle.backgroundColor,
      padding: `${flatStyle.paddingVertical || 0}px ${flatStyle.paddingHorizontal || 0}px`,
      borderRadius: `${flatStyle.borderRadius || 0}px`,
      opacity: flatStyle.opacity !== undefined ? flatStyle.opacity : 1,
      flex: flatStyle.flex,
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      outline: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      fontFamily: 'inherit',
      width: '100%',
    };
    
    return (
      <button
        onClick={onPress}
        disabled={disabled}
        style={cssStyle}
      >
        {children}
      </button>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} style={style} disabled={disabled}>
      {children}
    </TouchableOpacity>
  );
};

export default function AdminPanelScreen() {
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);  // Changed to false initially
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null);
  const [txSignatures, setTxSignatures] = useState('');
  const [executing, setExecuting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);  // New state for initial load

  useEffect(() => {
    fetchPendingSettlements();
  }, []);

  const fetchPendingSettlements = async () => {
    try {
      // Fetch all settlements (not just pending)
      const response = await api.get('/admin/settlement-history');
      // Filter to show pending and approved only (hide executed ones)
      const activeSettlements = response.data.settlements.filter(
        (s: any) => s.status === 'pending_approval' || s.status === 'approved'
      );
      setSettlements(activeSettlements);
    } catch (error: any) {
      console.error('Error fetching settlements:', error);
      if (error.response?.status === 403) {
        Alert.alert('Access Denied', 'You are not authorized to access Admin Panel');
      }
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateSettlement = async () => {
    console.log('🟢 handleCreateSettlement clicked!');
    try {
      setLoading(true);
      const response = await api.post('/admin/create-settlement');
      
      if (response.data.proposal) {
        Alert.alert('Success', 'Settlement proposal created successfully!');
        fetchPendingSettlements();
      } else {
        Alert.alert('Info', response.data.message);
      }
    } catch (error) {
      console.error('Error creating settlement:', error);
      Alert.alert('Error', 'Failed to create settlement');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (settlementId: string) => {
    try {
      Alert.alert(
        'Approve Settlement',
        'After approval, you need to manually execute transactions on-chain',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Approve',
            onPress: async () => {
              setLoading(true);
              await api.post(`/admin/approve-settlement/${settlementId}`);
              Alert.alert('Approved', 'Settlement approved. Execute transactions on-chain and submit signatures.');
              fetchPendingSettlements();
              setLoading(false);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error approving settlement:', error);
      Alert.alert('Error', 'Failed to approve settlement');
      setLoading(false);
    }
  };

  const handleAddTestRevenue = () => {
    console.log('🔵 handleAddTestRevenue clicked!');
    Alert.alert(
      'Add Test Revenue',
      'How much revenue to add per user? (in USD)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '$0.10',
          onPress: () => addTestRevenue(0.10),
        },
        {
          text: '$1.00',
          onPress: () => addTestRevenue(1.00),
        },
        {
          text: '$10.00',
          onPress: () => addTestRevenue(10.00),
        },
      ]
    );
  };

  const addTestRevenue = async (amount: number) => {
    try {
      setLoading(true);
      const response = await api.post('/admin/add-test-revenue', {
        amount_usd: amount,
      });
      
      Alert.alert(
        'Success!',
        `Added $${amount} to ${response.data.users_updated} users. Now create a settlement!`
      );
      fetchPendingSettlements();
    } catch (error: any) {
      console.error('Error adding test revenue:', error);
      Alert.alert('Error', error.response?.data?.detail || 'Failed to add test revenue');
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!selectedSettlement || !txSignatures.trim()) {
      Alert.alert('Error', 'Please enter transaction signatures');
      return;
    }

    try {
      setExecuting(true);
      const signatures = txSignatures.split(',').map(s => s.trim()).filter(s => s);
      
      await api.post('/admin/execute-settlement', {
        settlement_id: selectedSettlement._id,
        transaction_signatures: signatures,
      });

      Alert.alert('Success!', `Settlement executed! Distributed WIN to ${selectedSettlement.users_count} users.`);
      setSelectedSettlement(null);
      setTxSignatures('');
      fetchPendingSettlements();
    } catch (error: any) {
      console.error('Error executing settlement:', error);
      Alert.alert('Error', error.response?.data?.detail || 'Failed to execute settlement');
    } finally {
      setExecuting(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPendingSettlements();
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={styles.loadingText}>Loading Admin Panel...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={40} color="#9C27B0" />
        <Text style={styles.title}>Admin Panel</Text>
        <Text style={styles.subtitle}>Settlement Management</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <WebButton 
          style={[styles.createButton, loading && styles.buttonDisabled]} 
          onPress={handleCreateSettlement}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.createButtonText}>Create Settlement</Text>
            </>
          )}
        </WebButton>

        <WebButton 
          style={[styles.testButton, loading && styles.buttonDisabled]} 
          onPress={handleAddTestRevenue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="flask" size={24} color="#fff" />
              <Text style={styles.testButtonText}>Add Test Revenue</Text>
            </>
          )}
        </WebButton>
      </View>

      {/* Pending Settlements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Pending Settlements ({settlements.length})
        </Text>

        {settlements.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle" size={64} color="#4CAF50" />
            <Text style={styles.emptyText}>No pending settlements</Text>
            <Text style={styles.emptySubtext}>Create a new settlement to get started</Text>
          </View>
        ) : (
          settlements.map((settlement) => (
            <View key={settlement._id} style={styles.settlementCard}>
              <View style={styles.settlementHeader}>
                <View style={styles.settlementTitleRow}>
                  <Ionicons name="document-text" size={24} color="#FF9800" />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.settlementId}>
                      {settlement._id.slice(0, 8)}...
                    </Text>
                    <Text style={styles.settlementDate}>
                      {new Date(settlement.created_at).toLocaleString()}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge,
                  settlement.status === 'pending_approval' && styles.statusPending,
                  settlement.status === 'approved' && styles.statusApproved,
                ]}>
                  <Text style={styles.statusText}>{settlement.status}</Text>
                </View>
              </View>

              <View style={styles.settlementStats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Total Revenue</Text>
                  <Text style={styles.statValue}>${settlement.total_revenue_usd.toFixed(2)}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>WIN to Buy</Text>
                  <Text style={styles.statValue}>{settlement.total_win_to_buy.toFixed(2)}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Users</Text>
                  <Text style={styles.statValue}>{settlement.users_count}</Text>
                </View>
              </View>

              <View style={styles.distribution}>
                <View style={styles.distributionRow}>
                  <Text style={styles.distributionLabel}>70% for Users:</Text>
                  <Text style={styles.distributionValue}>
                    {settlement.win_for_users_70.toFixed(2)} WIN
                  </Text>
                </View>
                <View style={styles.distributionRow}>
                  <Text style={styles.distributionLabel}>30% for Liquidity:</Text>
                  <Text style={styles.distributionValue}>
                    {settlement.win_for_liquidity_30.toFixed(2)} WIN
                  </Text>
                </View>
              </View>

              {settlement.status === 'pending_approval' && (
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => handleApprove(settlement._id)}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.approveButtonText}>Approve Settlement</Text>
                </TouchableOpacity>
              )}

              {settlement.status === 'approved' && (
                <TouchableOpacity
                  style={styles.executeButton}
                  onPress={() => setSelectedSettlement(settlement)}
                >
                  <Ionicons name="rocket" size={20} color="#fff" />
                  <Text style={styles.executeButtonText}>Execute Settlement</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>

      {/* Execute Settlement Modal */}
      {selectedSettlement && (
        <View style={styles.executeModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Execute Settlement</Text>
            <Text style={styles.modalSubtitle}>
              Enter transaction signatures (comma-separated)
            </Text>

            <TextInput
              style={styles.signatureInput}
              value={txSignatures}
              onChangeText={setTxSignatures}
              placeholder="tx_sig_1, tx_sig_2"
              placeholderTextColor="#666"
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setSelectedSettlement(null);
                  setTxSignatures('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleExecute}
                disabled={executing}
              >
                {executing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Execute</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c0c0c',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  createButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9C27B0',
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  testButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    paddingVertical: 16,
    borderRadius: 12,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  settlementCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  settlementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  settlementTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settlementId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  settlementDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#FF9800',
  },
  statusApproved: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  settlementStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  distribution: {
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  distributionLabel: {
    fontSize: 13,
    color: '#999',
  },
  distributionValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  executeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 8,
  },
  executeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  executeModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  signatureInput: {
    backgroundColor: '#0c0c0c',
    borderRadius: 8,
    padding: 16,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
