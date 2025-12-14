/**
 * Google AdSense Banner Component - AGGRESSIVE VERSION
 * 
 * Supports multiple ad formats and placements
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ADSENSE_CONFIG, pushAd, trackAdImpression } from '../services/adsenseService';

interface AdSenseBannerProps {
  slot: string;
  format?: 'leaderboard' | 'mediumRectangle' | 'largeRectangle' | 'halfPage' | 'responsive' | 'mobileBanner' | 'mobileLargeBanner';
  style?: any;
  sticky?: boolean; // Make ad stick to screen
}

export default function AdSenseBanner({ slot, format = 'responsive', style, sticky = false }: AdSenseBannerProps) {
  const adRef = useRef<any>(null);
  
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        pushAd();
        trackAdImpression();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Only render on web
  if (Platform.OS !== 'web') {
    return null;
  }
  
  const formatConfig = ADSENSE_CONFIG.formats[format];
  
  return (
    <View 
      style={[
        styles.container, 
        sticky && styles.sticky,
        style
      ]}
      ref={adRef}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: formatConfig.width,
          height: formatConfig.height,
          backgroundColor: '#f0f0f0',
        }}
        data-ad-client={`ca-${ADSENSE_CONFIG.publisherId}`}
        data-ad-slot={slot}
        data-ad-format={format === 'responsive' ? 'auto' : undefined}
        data-full-width-responsive={format === 'responsive' ? 'true' : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 10,
    minHeight: 60,
  },
  sticky: {
    // Sticky positioning for web
    ...(Platform.OS === 'web' ? {
      position: 'sticky' as any,
      bottom: 0,
      zIndex: 1000,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      marginVertical: 0,
    } : {}),
  },
});
