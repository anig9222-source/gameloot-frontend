/**
 * Multiplex Ad Component - Grid of recommended content
 * 
 * Shows multiple ads in a grid layout
 * Great for bottom of pages
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ADSENSE_CONFIG, pushAd, trackAdImpression } from '../services/adsenseService';

interface AdSenseMultiplexProps {
  slot: string;
  rows?: number; // Number of rows in grid
  columns?: number; // Number of columns
  style?: any;
}

export default function AdSenseMultiplex({ slot, rows = 2, columns = 4, style }: AdSenseMultiplexProps) {
  useEffect(() => {
    if (Platform.OS === 'web') {
      const timer = setTimeout(() => {
        pushAd();
        trackAdImpression();
      }, 250);
      
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
        data-ad-format="autorelaxed"
        data-ad-client={`ca-${ADSENSE_CONFIG.publisherId}`}
        data-ad-slot={slot}
        data-matched-content-ui-type="image_stacked,image_card_stacked"
        data-matched-content-rows-num={rows.toString()}
        data-matched-content-columns-num={columns.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginVertical: 15,
    backgroundColor: '#fafafa',
    borderRadius: 12,
  },
});
