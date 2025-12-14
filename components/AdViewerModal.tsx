/**
 * Ad Viewer Modal - Simulates ad viewing experience
 * Shows a visual ad screen for better UX
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AdViewerModalProps {
  visible: boolean;
  gameType: string;
  onAdComplete: () => void;
}

export default function AdViewerModal({ visible, gameType, onAdComplete }: AdViewerModalProps) {
  const [countdown, setCountdown] = useState(3);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Reset countdown
      setCountdown(3);
      
      // Start countdown timer
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            // Complete ad after countdown
            setTimeout(() => {
              onAdComplete();
            }, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start progress animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();

      return () => {
        clearInterval(interval);
        progressAnim.setValue(0);
      };
    }
  }, [visible]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Fake Ad Content */}
        <View style={styles.adContent}>
          <View style={styles.adBanner}>
            <Ionicons name="play-circle" size={80} color="#FF6B6B" />
            <Text style={styles.adTitle}>Po shikon reklamë...</Text>
            <Text style={styles.adSubtitle}>Faleminderit për mbështetjen!</Text>
          </View>

          {/* Countdown Timer */}
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>{countdown}</Text>
            <Text style={styles.countdownLabel}>sekonda</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                { width: progressWidth }
              ]} 
            />
          </View>

          {/* Info Text */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={20} color="#888" />
            <Text style={styles.infoText}>
              Reklama po ngarkohet... Ju lutem prisni.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🎮 {gameType.toUpperCase()}</Text>
          <Text style={styles.footerSubtext}>Powered by AdMob</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adContent: {
    width: '90%',
    alignItems: 'center',
  },
  adBanner: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  adTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
    textAlign: 'center',
  },
  adSubtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  countdownLabel: {
    fontSize: 18,
    color: '#888',
    marginTop: -10,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#666',
  },
});
