// Import polyfills FIRST before any Solana imports
import '../../polyfills';

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
  Linking,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../utils/api';

// Solana wallet screen - MVP for WIN token integration
export default function SolanaWalletScreen() {
  const { token } = useAuth();
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [walletStatus, setWalletStatus] = useState<any>(null);
  const [tokenBalance, setTokenBalance] = useState<any>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  
  // WIN token mint address from Pump.fun
  const WIN_TOKEN_MINT = '3judPeZPx5tfPkhvHi4tApaosJZxiu6MtrAS44mCpump';

  useEffect(() => {
    fetchWalletStatus();
  }, []);

  const fetchWalletStatus = async () => {
    try {
      const response = await api.get('/wallet/status');
      setWalletStatus(response.data);
      
      // If wallet is connected, fetch balance
      if (response.data.connected) {
        fetchTokenBalance();
      }
    } catch (error) {
      console.error('Error fetching wallet status:', error);
    }
  };

  const fetchTokenBalance = async () => {
    try {
      const response = await api.get('/wallet/balance', {
        params: { token_mint: WIN_TOKEN_MINT },
      });
      setTokenBalance(response.data);
    } catch (error) {
      console.error('Error fetching token balance:', error);
      setTokenBalance({ ui_amount: 0, symbol: 'WIN' });
    }
  };

  const handleConnectWallet = async () => {
    // Show manual input modal
    setShowManualInput(true);
  };

  const handleManualConnect = async () => {
    if (!manualAddress || manualAddress.trim().length < 32) {
      Alert.alert(
        t('common.error') || 'Error',
        t('solana.invalidAddress') || 'Please enter a valid Solana wallet address'
      );
      return;
    }

    try {
      setLoading(true);
      
      // Connect wallet via API
      const response = await api.post('/wallet/connect', {
        wallet_address: manualAddress.trim()
      });

      console.log('Wallet connected:', response.data);

      setShowManualInput(false);
      setManualAddress('');
      
      Alert.alert(
        t('common.success') || 'Success',
        t('solana.connected') || 'Wallet connected successfully!'
      );

      // Refresh status
      await fetchWalletStatus();
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      Alert.alert(
        t('common.error') || 'Error',
        error.response?.data?.detail || t('solana.connectionError') || 'Failed to connect wallet'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectWallet = async () => {
    Alert.alert(
      t('solana.disconnectTitle') || 'Disconnect Wallet',
      t('solana.disconnectMessage') || 'Are you sure you want to disconnect your wallet?',
      [
        { text: t('common.cancel') || 'Cancel', style: 'cancel' },
        {
          text: t('common.disconnect') || 'Disconnect',
          onPress: async () => {
            try {
              setLoading(true);
              await api.post('/wallet/disconnect');
              
              setWalletStatus({ connected: false });
              setTokenBalance(null);
              
              Alert.alert(
                t('common.success') || 'Success',
                t('solana.disconnected') || 'Wallet disconnected successfully'
              );
            } catch (error) {
              console.error('Error disconnecting wallet:', error);
              Alert.alert(
                t('common.error') || 'Error',
                t('solana.disconnectError') || 'Failed to disconnect wallet'
              );
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWalletStatus();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="wallet" size={48} color="#9C27B0" />
        <Text style={styles.headerTitle}>
          {t('solana.title') || 'Solana Wallet'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {t('solana.subtitle') || 'Connect your wallet to view WIN token balance'}
        </Text>
      </View>

      {/* Wallet Status Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons
            name={walletStatus?.connected ? 'checkmark-circle' : 'close-circle'}
            size={24}
            color={walletStatus?.connected ? '#4CAF50' : '#666'}
          />
          <Text style={styles.cardTitle}>
            {walletStatus?.connected
              ? t('solana.connected') || 'Connected'
              : t('solana.notConnected') || 'Not Connected'}
          </Text>
        </View>

        {walletStatus?.connected && (
          <>
            <View style={styles.walletAddressContainer}>
              <Text style={styles.label}>
                {t('solana.walletAddress') || 'Wallet Address'}
              </Text>
              <Text style={styles.walletAddress}>
                {walletStatus.wallet_address?.slice(0, 8)}...
                {walletStatus.wallet_address?.slice(-8)}
              </Text>
            </View>

            <View style={styles.connectedAtContainer}>
              <Text style={styles.connectedAtLabel}>
                {t('solana.connectedAt') || 'Connected at'}
              </Text>
              <Text style={styles.connectedAtValue}>
                {walletStatus.connected_at
                  ? new Date(walletStatus.connected_at).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Token Balance Card */}
      {walletStatus?.connected && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="logo-bitcoin" size={24} color="#FF9800" />
            <Text style={styles.cardTitle}>
              {t('solana.tokenBalance') || 'WIN Token Balance'}
            </Text>
          </View>

          {tokenBalance ? (
            <>
              <Text style={styles.balanceAmount}>
                {tokenBalance.ui_amount.toFixed(4)} {tokenBalance.symbol}
              </Text>
              <View style={styles.balanceDetails}>
                <Text style={styles.balanceDetailLabel}>
                  {t('solana.rawAmount') || 'Raw Amount'}:
                </Text>
                <Text style={styles.balanceDetailValue}>
                  {tokenBalance.balance}
                </Text>
              </View>
              <View style={styles.balanceDetails}>
                <Text style={styles.balanceDetailLabel}>
                  {t('solana.decimals') || 'Decimals'}:
                </Text>
                <Text style={styles.balanceDetailValue}>
                  {tokenBalance.decimals}
                </Text>
              </View>
            </>
          ) : (
            <ActivityIndicator size="large" color="#9C27B0" style={{ marginTop: 20 }} />
          )}
        </View>
      )}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color="#2196F3" />
        <Text style={styles.infoText}>
          {t('solana.infoMessage') ||
            'This is the MVP for Solana integration. Connect your Phantom wallet to view your WIN token balance. More features coming soon!'}
        </Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          walletStatus?.connected ? styles.disconnectButton : styles.connectButton,
          loading && styles.actionButtonDisabled,
        ]}
        onPress={
          walletStatus?.connected ? handleDisconnectWallet : handleConnectWallet
        }
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons
              name={walletStatus?.connected ? 'power' : 'wallet'}
              size={24}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.actionButtonText}>
              {walletStatus?.connected
                ? t('solana.disconnect') || 'Disconnect Wallet'
                : t('solana.connect') || 'Connect Wallet'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Manual Wallet Address Input Modal */}
      <Modal
        visible={showManualInput}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowManualInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('solana.enterWalletAddress') || 'Enter Wallet Address'}
              </Text>
              <TouchableOpacity onPress={() => setShowManualInput(false)}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalInstructions}>
              {t('solana.copyFromPhantom') || 'Copy your Solana wallet address from Phantom and paste it here:'}
            </Text>

            <TextInput
              style={styles.walletInput}
              value={manualAddress}
              onChangeText={setManualAddress}
              placeholder="e.g., 7xKX...9zYb"
              placeholderTextColor="#666"
              autoCapitalize="none"
              autoCorrect={false}
              multiline={true}
              numberOfLines={2}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowManualInput(false);
                  setManualAddress('');
                }}
              >
                <Text style={styles.modalButtonText}>
                  {t('common.cancel') || 'Cancel'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, loading && styles.buttonDisabled]}
                onPress={handleManualConnect}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalButtonText}>
                    {t('common.confirm') || 'Connect'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Coming Soon Features */}
      <View style={styles.comingSoonCard}>
        <Text style={styles.comingSoonTitle}>
          {t('solana.comingSoon') || '🚀 Coming Soon'}
        </Text>
        <View style={styles.featureItem}>
          <Ionicons name="swap-horizontal" size={20} color="#4CAF50" />
          <Text style={styles.featureText}>
            {t('solana.feature1') || 'Swap WIN for SOL/USDC'}
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="send" size={20} color="#4CAF50" />
          <Text style={styles.featureText}>
            {t('solana.feature2') || 'Transfer WIN tokens'}
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="stats-chart" size={20} color="#4CAF50" />
          <Text style={styles.featureText}>
            {t('solana.feature3') || 'View transaction history'}
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="finger-print" size={20} color="#4CAF50" />
          <Text style={styles.featureText}>
            {t('solana.feature4') || 'KYC with face recognition'}
          </Text>
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
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  walletAddressContainer: {
    marginTop: 12,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  walletAddress: {
    fontSize: 16,
    color: '#4CAF50',
    fontFamily: 'monospace',
  },
  connectedAtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  connectedAtLabel: {
    fontSize: 12,
    color: '#999',
  },
  connectedAtValue: {
    fontSize: 12,
    color: '#fff',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF9800',
    marginVertical: 16,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  balanceDetailLabel: {
    fontSize: 14,
    color: '#999',
  },
  balanceDetailValue: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'monospace',
  },
  infoCard: {
    backgroundColor: '#1a237e',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    marginLeft: 12,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  connectButton: {
    backgroundColor: '#9C27B0',
  },
  disconnectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  comingSoonCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 12,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalInstructions: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
    lineHeight: 20,
  },
  walletInput: {
    backgroundColor: '#0c0c0c',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 24,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  confirmButton: {
    backgroundColor: '#9C27B0',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
