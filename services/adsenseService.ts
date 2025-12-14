/**
 * Google AdSense Service - AGGRESSIVE MONETIZATION STRATEGY
 * 
 * Publisher ID: pub-8345509178507577
 * 
 * MAXIMUM REVENUE STRATEGY:
 * - Auto Ads (AI-powered automatic ad placement)
 * - Multiple banner units per page (3x limit)
 * - Sticky/Anchor ads (always visible)
 * - In-Feed ads (between content)
 * - Native ads (match site design)
 * - Multiplex ads (grid of recommendations)
 * - High ad density for maximum impressions
 */

export const ADSENSE_CONFIG = {
  publisherId: 'pub-8345509178507577',
  
  // Enable Auto Ads for maximum coverage
  autoAdsEnabled: true,
  
  // Ad slot IDs - CREATE THESE IN YOUR ADSENSE ACCOUNT
  // For now using placeholder IDs - replace with real ones from AdSense
  slots: {
    // Dashboard ads (4 units for max revenue)
    dashboardTop: '1234567890',
    dashboardMiddle: '1234567891',
    dashboardBottom: '1234567892',
    dashboardSticky: '1234567893',
    
    // Games screen ads (5 units)
    gamesTop: '2234567890',
    gamesMiddle: '2234567891',
    gamesInFeed: '2234567892',
    gamesBottom: '2234567893',
    gamesSticky: '2234567894',
    
    // Opportunities ads (4 units)
    opportunitiesTop: '3234567890',
    opportunitiesInFeed: '3234567891',
    opportunitiesBottom: '3234567892',
    opportunitiesSticky: '3234567893',
    
    // Native ads (blend with content)
    nativeAd1: '4234567890',
    nativeAd2: '4234567891',
    
    // Multiplex ads (recommendation grid)
    multiplexAd: '5234567890',
  },
  
  // Ad formats for different placements
  formats: {
    // Standard banner sizes
    leaderboard: { width: '728', height: '90' },
    mediumRectangle: { width: '300', height: '250' },
    largeRectangle: { width: '336', height: '280' },
    halfPage: { width: '300', height: '600' },
    
    // Responsive (adapts to any size)
    responsive: { width: 'auto', height: 'auto' },
    
    // Mobile-optimized
    mobileBanner: { width: '320', height: '50' },
    mobileLargeBanner: { width: '320', height: '100' },
  },
  
  // Auto Ads configuration
  autoAdsConfig: {
    // Enable all auto ad types
    anchor: true,        // Sticky ads at screen edge
    vignette: true,      // Full-screen between pages
    multiplexHorizontal: true,
    textAds: true,
    displayAds: true,
    inFeedAds: true,
    inArticleAds: true,
  },
};

/**
 * Initialize AdSense with Auto Ads (MAXIMUM MONETIZATION)
 */
export function initializeAdSense(): void {
  if (typeof window === 'undefined') return;
  
  // Check if already loaded
  if (document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
    console.log('[AdSense] Already initialized');
    return;
  }
  
  // Load AdSense script with Auto Ads
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${ADSENSE_CONFIG.publisherId}`;
  script.crossOrigin = 'anonymous';
  
  // Enable Auto Ads (Google AI places ads automatically)
  script.setAttribute('data-ad-client', `ca-${ADSENSE_CONFIG.publisherId}`);
  
  if (ADSENSE_CONFIG.autoAdsEnabled) {
    // Auto ads configuration
    script.setAttribute('data-ad-frequency-hint', '30s'); // Show ads frequently
    script.setAttribute('data-adbreak-test', 'on'); // Test mode
  }
  
  document.head.appendChild(script);
  
  console.log('[AdSense] Initialized with Auto Ads ENABLED ✅');
  console.log('[AdSense] Maximum monetization mode activated 💰');
}

/**
 * Push ad for display
 */
export function pushAd(): void {
  if (typeof window === 'undefined') return;
  
  try {
    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    console.log('[AdSense] Ad pushed');
  } catch (error) {
    console.error('[AdSense] Error pushing ad:', error);
  }
}

/**
 * Push multiple ads at once
 */
export function pushMultipleAds(count: number): void {
  if (typeof window === 'undefined') return;
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => pushAd(), i * 100);
  }
}

/**
 * Refresh all ads on page
 */
export function refreshAds(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Get all ad elements
    const ads = document.querySelectorAll('.adsbygoogle');
    console.log(`[AdSense] Refreshing ${ads.length} ads`);
    
    ads.forEach((ad, index) => {
      setTimeout(() => {
        pushAd();
      }, index * 150);
    });
  } catch (error) {
    console.error('[AdSense] Error refreshing ads:', error);
  }
}

/**
 * Track ad impressions (for analytics)
 */
let adImpressions = 0;
export function trackAdImpression(): void {
  adImpressions++;
  console.log(`[AdSense] Total ad impressions: ${adImpressions}`);
}

/**
 * Get ad stats
 */
export function getAdStats() {
  return {
    impressions: adImpressions,
    autoAdsEnabled: ADSENSE_CONFIG.autoAdsEnabled,
  };
}
