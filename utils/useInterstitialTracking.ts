/**
 * Custom Hook for Interstitial Ad Tracking
 * 
 * Add this to any screen that should contribute to interstitial ad counter
 * Usage: useInterstitialTracking() in component
 */

import { useEffect } from 'react';
import { interstitialAdManager } from './interstitialAdManager';

export function useInterstitialTracking() {
  useEffect(() => {
    // Track screen view when component mounts
    interstitialAdManager.trackScreenView();
  }, []);
}
