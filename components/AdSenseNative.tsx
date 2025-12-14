/**
 * Native Ad Component - Matches your site design
 * 
 * Highest performing ad type - blends with content
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ADSENSE_CONFIG, pushAd, trackAdImpression } from '../services/adsenseService';

interface AdSenseNativeProps {
  slot: string;
  layout?: 'image-top' | 'image-middle' | 'image-side' | 'text-only';
  style?: any;
}

export default function AdSenseNative({ slot, layout = 'image-top', style }: AdSenseNativeProps) {
  useEffect(() => {
    if (Platform.OS === 'web') {
      const timer = setTimeout(() => {
        pushAd();
        trackAdImpression();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  if (Platform.OS !== 'web') {
    return null;
  }
  
  // Layout keys for different native ad styles
  const layoutKeys: Record<string, string> = {
    'image-top': '-fb+5w+4e-db+86',
    'image-middle': '-fa+5w+4e-db+86',
    'image-side': '-f9+5w+4e-db+86',
    'text-only': '-f8+5w+4e-db+86',
  };
  
  return (
    <View style={[styles.container, style]}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
        }}
        data-ad-format="autorelaxed"
        data-ad-client={`ca-${ADSENSE_CONFIG.publisherId}`}
        data-ad-slot={slot}
        data-ad-layout-key={layoutKeys[layout]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginVertical: 10,
  },
});
