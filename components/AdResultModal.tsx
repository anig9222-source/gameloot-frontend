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

interface AdResultModalProps {
  visible: boolean;
  earned_usd: number;
  pending_revenue_usd: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export default function AdResultModal({ 
  visible, 
  earned_usd, 
  pending_revenue_usd, 
  onPlayAgain, 
  onClose 
}: AdResultModalProps) {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const [canPlayAgain] = React.useState(true); // Always true for unlimited ads

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
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
          {/* Success Header */}
          <View style={styles.header}>
            <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            <Text style={styles.title}>Urime! 🎉</Text>
          </View>

          {/* Earnings Display */}
          <View style={styles.earningsBox}>
            <Text style={styles.earningsLabel}>Fitove</Text>
            <Text style={styles.earningsValue}>${earned_usd.toFixed(6)}</Text>
            <Text style={styles.earningsSubtext}>
              Total duke pritur: ${pending_revenue_usd.toFixed(4)}
            </Text>
          </View>

          {/* Info */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Ionicons name="infinite" size={20} color="#FFD700" />
              <Text style={styles.infoText}>Reklama të pakufizuara!</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cash" size={20} color="#4CAF50" />
              <Text style={styles.infoText}>Google paguan për çdo ad</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color="#2196F3" />
              <Text style={styles.infoText}>Konvertohet në mesnate</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            {canPlayAgain && (
              <TouchableOpacity
                style={[styles.button, styles.playAgainButton]}
                onPress={onPlayAgain}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={24} color="#fff" />
                <Text style={styles.playAgainButtonText}>Play Again & Earn More</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Ionicons name="home" size={20} color="#999" />
              <Text style={styles.closeButtonText}>Kthehu në Dashboard</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  earningsBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  earningsLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  earningsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  earningsSubtext: {
    fontSize: 14,
    color: '#FFD700',
  },
  infoBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    color: '#ccc',
    fontSize: 14,
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
  playAgainButton: {
    backgroundColor: '#4CAF50',
  },
  playAgainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#2a2a2a',
  },
  closeButtonText: {
    color: '#999',
    fontSize: 16,
  },
});
