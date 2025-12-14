/**
 * In-Feed Ad Component - Appears between content items
 * 
 * Blends naturally with your content for higher CTR
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ADSENSE_CONFIG, pushAd, trackAdImpression } from '../services/adsenseService';

interface AdSenseInFeedProps {
  slot: string;
  layoutKey?: string; // Custom layout for native look
  style?: any;
}

export default function AdSenseInFeed({ slot, layoutKey = '-6g+5c+b7-4u', style }: AdSenseInFeedProps) {
  useEffect(() => {
    if (Platform.OS === 'web') {
      const timer = setTimeout(() => {
        pushAd();
        trackAdImpression();
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  if (Platform.OS !== 'web') {
    return null;
  }
  
  return (
    <View style={[styles.container, style]}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
        }}
        data-ad-format="fluid"
        data-ad-layout-key={layoutKey}
        data-ad-client={`ca-${ADSENSE_CONFIG.publisherId}`}
        data-ad-slot={slot}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
});
