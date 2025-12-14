/**
 * AdSense Placeholder - DEMO ADS për Preview
 * 
 * Tregon si do të duken reklamat reale në production
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AdPlaceholderProps {
  type: 'banner' | 'native' | 'multiplex' | 'infeed';
  format?: string;
  style?: any;
}

export default function AdSensePlaceholder({ type, format = 'responsive', style }: AdPlaceholderProps) {
  // Nëse është web dhe jo production, trego placeholder
  const isPreview = Platform.OS === 'web' && (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
  
  if (!isPreview) {
    return null; // Në production, real ads do të shfaqen
  }
  
  const renderPlaceholder = () => {
    switch (type) {
      case 'banner':
        return (
          <View style={[styles.bannerContainer, style]}>
            <View style={styles.adHeader}>
              <Ionicons name="megaphone" size={16} color="#666" />
              <Text style={styles.adLabel}>REKLAMA GOOGLE ADSENSE</Text>
            </View>
            <View style={styles.bannerContent}>
              <Ionicons name="image-outline" size={48} color="#999" />
              <Text style={styles.bannerText}>728 x 90 Banner Ad</Text>
              <Text style={styles.subText}>Reklama e vërtetë do të shfaqet këtu pas deploy</Text>
            </View>
            <View style={styles.revenueTag}>
              <Text style={styles.revenueText}>💰 $0.10 - $5 / 1000 views</Text>
            </View>
          </View>
        );
      
      case 'native':
        return (
          <View style={[styles.nativeContainer, style]}>
            <View style={styles.adHeader}>
              <Ionicons name="megaphone" size={14} color="#666" />
              <Text style={styles.adLabelSmall}>NATIVE AD</Text>
            </View>
            <View style={styles.nativeContent}>
              <View style={styles.nativeImage}>
                <Ionicons name="images-outline" size={32} color="#999" />
              </View>
              <View style={styles.nativeTextArea}>
                <Text style={styles.nativeTitle}>Reklama Native - Duket Organike</Text>
                <Text style={styles.nativeDesc}>Kjo reklama do të përshtatet me dizajnin e app-it dhe ka CTR më të lartë</Text>
                <Text style={styles.nativeRevenue}>💰 $1 - $10 / 1000 views (MË E LARTA)</Text>
              </View>
            </View>
          </View>
        );
      
      case 'multiplex':
        return (
          <View style={[styles.multiplexContainer, style]}>
            <View style={styles.adHeader}>
              <Ionicons name="megaphone" size={14} color="#666" />
              <Text style={styles.adLabelSmall}>MULTIPLEX ADS (4 ADS NJËHERËSH)</Text>
            </View>
            <View style={styles.multiplexGrid}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.multiplexCard}>
                  <View style={styles.multiplexImage}>
                    <Ionicons name="image" size={24} color="#999" />
                  </View>
                  <Text style={styles.multiplexText}>Ad {i}</Text>
                </View>
              ))}
            </View>
            <View style={styles.revenueTag}>
              <Text style={styles.revenueText}>💰 $2 - $15 / 1000 views (4x revenue)</Text>
            </View>
          </View>
        );
      
      case 'infeed':
        return (
          <View style={[styles.infeedContainer, style]}>
            <View style={styles.adHeader}>
              <Ionicons name="megaphone" size={14} color="#666" />
              <Text style={styles.adLabelSmall}>IN-FEED AD</Text>
            </View>
            <View style={styles.infeedContent}>
              <View style={styles.infeedImage}>
                <Ionicons name="images-outline" size={32} color="#999" />
              </View>
              <Text style={styles.infeedTitle}>Reklama In-Feed</Text>
              <Text style={styles.infeedDesc}>Shfaqet midis përmbajtjes si pjesë e listës</Text>
            </View>
            <View style={styles.revenueTag}>
              <Text style={styles.revenueText}>💰 $0.50 - $7 / 1000 views</Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      {renderPlaceholder()}
      <View style={styles.demoNotice}>
        <Ionicons name="information-circle" size={16} color="#FF9800" />
        <Text style={styles.demoText}>DEMO - Reklama reale do të shfaqen pas deploy në production</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  bannerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    minHeight: 120,
  },
  nativeContainer: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
    marginVertical: 10,
  },
  multiplexContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: '#FF9800',
    borderStyle: 'dashed',
    marginVertical: 15,
  },
  infeedContainer: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: '#9C27B0',
    borderStyle: 'dashed',
    marginVertical: 10,
  },
  adHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  adLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 0.5,
  },
  adLabelSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 0.5,
  },
  bannerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  nativeContent: {
    flexDirection: 'row',
    gap: 12,
  },
  nativeImage: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeTextArea: {
    flex: 1,
  },
  nativeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  nativeDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  nativeRevenue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  multiplexGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  multiplexCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  multiplexImage: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  multiplexText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  infeedContent: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  infeedImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  infeedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  infeedDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  revenueTag: {
    marginTop: 10,
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  revenueText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    gap: 6,
  },
  demoText: {
    fontSize: 11,
    color: '#E65100',
    flex: 1,
  },
});
