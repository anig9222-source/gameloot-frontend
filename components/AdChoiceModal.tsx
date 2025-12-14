import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AdChoiceModalProps {
  visible: boolean;
  gameType: string;
  onWatch: () => void;
  onSkip: () => void;
}

export default function AdChoiceModal({ visible, gameType, onWatch, onSkip }: AdChoiceModalProps) {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onSkip}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="cash" size={48} color="#4CAF50" />
            <Text style={styles.title}>Earn Real Money!</Text>
          </View>

          {/* Message */}
          <View style={styles.content}>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color="#FFD700" />
              <Text style={styles.infoText}>15-30 seconds</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={20} color="#4CAF50" />
              <Text style={styles.infoText}>Real AdMob earnings</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#2196F3" />
              <Text style={styles.infoText}>Based on your location</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.watchButton]}
              onPress={onWatch}
              activeOpacity={0.8}
            >
              <Ionicons name="play-circle" size={24} color="#fff" />
              <Text style={styles.watchButtonText}>Watch Ad</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.skipButton]}
              onPress={onSkip}
              activeOpacity={0.8}
            >
              <Ionicons name="play-skip-forward" size={20} color="#999" />
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  content: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    color: '#ccc',
    fontSize: 16,
    marginLeft: 12,
  },
  buttons: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  watchButton: {
    backgroundColor: '#4CAF50',
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: '#2a2a2a',
  },
  skipButtonText: {
    color: '#999',
    fontSize: 16,
  },
});
