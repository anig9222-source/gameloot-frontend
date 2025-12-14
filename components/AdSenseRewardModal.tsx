/**
 * AdSense Reward Modal - Tregon pas çdo loje
 * 
 * User zgjedh: Shiko Reklamën ose Skip
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AdSenseRewardModalProps {
  visible: boolean;
  gameType: string;
  onWatchAd: () => void;
  onSkip: () => void;
  rewardAmount?: string;
}

export default function AdSenseRewardModal({
  visible,
  gameType,
  onWatchAd,
  onSkip,
  rewardAmount = '$0.10 - $5.00'
}: AdSenseRewardModalProps) {
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onSkip}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="tv" size={64} color="#4CAF50" />
          </View>
          
          {/* Title */}
          <Text style={styles.title}>Shiko Reklamën për të Fituar!</Text>
          
          {/* Description */}
          <Text style={styles.description}>
            Shiko një reklamë prej 15-30 sekondash dhe fito të ardhura reale!
          </Text>
          
          {/* Reward Info */}
          <View style={styles.rewardBox}>
            <Ionicons name="cash" size={32} color="#FFD700" />
            <Text style={styles.rewardText}>Fito: {rewardAmount}</Text>
            <Text style={styles.rewardSubtext}>Të ardhura të vërteta në USD</Text>
          </View>
          
          {/* Buttons */}
          <TouchableOpacity 
            style={[styles.button, styles.watchButton]}
            onPress={onWatchAd}
          >
            <Ionicons name="play-circle" size={24} color="#fff" />
            <Text style={styles.watchButtonText}>Shiko Reklamën (15-30s)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.skipButton]}
            onPress={onSkip}
          >
            <Text style={styles.skipButtonText}>Skip - Vazhdoni pa reklama</Text>
          </TouchableOpacity>
          
          {/* Info */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={16} color="#666" />
            <Text style={styles.infoText}>
              Reklamat na ndihmojnë të mbajmë aplikacionin falas për ju!
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0a2a0a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  rewardBox: {
    backgroundColor: '#2a2a0a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  rewardText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 8,
  },
  rewardSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  watchButton: {
    backgroundColor: '#4CAF50',
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
  },
  skipButtonText: {
    color: '#999',
    fontSize: 14,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 11,
    color: '#666',
    flex: 1,
    lineHeight: 16,
  },
});
