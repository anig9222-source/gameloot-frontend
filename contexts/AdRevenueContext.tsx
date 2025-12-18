/**
 * AdRevenue Context - Track WIN Tokens from AdSense
 * 
 * WIN Token System:
 * - Backend generates USD revenue from ads ($0.40 - $1.20 per ad)
 * - 60% of USD revenue is converted to WIN tokens (60 WIN per $1 USD)
 * - WIN tokens are locked until KYC verification (15 days, $0.40/day avg, 10 referrals)
 * 
 * Example: User earns $1.00 from ad → receives 60 WIN tokens → locked until KYC
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import storage from './../utils/storage';

interface AdRevenueContextType {
  totalWinTokens: number;
  todayWinTokens: number;
  adsWatched: number;
  totalUSD: number;
  todayUSD: number;
  isLoading: boolean;
  addWinTokens: (tokens: number, type: 'banner' | 'native' | 'modal') => void;
  resetDaily: () => void;
  refreshFromBackend: () => Promise<void>;
}

const AdRevenueContext = createContext<AdRevenueContextType | undefined>(undefined);

export const AdRevenueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [totalWinTokens, setTotalWinTokens] = useState(0.0);
  const [todayWinTokens, setTodayWinTokens] = useState(0.0);
  const [adsWatched, setAdsWatched] = useState(0);
  const [lastResetDate, setLastResetDate] = useState<string>('');
  const [totalUSD, setTotalUSD] = useState(0);
  const [todayUSD, setTodayUSD] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [isRefreshing, setIsRefreshing] = useState(false); // Track if currently refreshing from backend

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await loadRevenue();
      await checkDailyReset();
      await refreshFromBackend(); // Fetch real data from backend
      setIsLoading(false);
    };
    init();
  }, []);

  const loadRevenue = async () => {
    try {
      const total = await storage.getItem('win_tokens_total');
      const today = await storage.getItem('win_tokens_today');
      const watched = await storage.getItem('ads_watched');
      const resetDate = await storage.getItem('last_reset_date');

      if (total) setTotalWinTokens(parseFloat(total));
      if (today) setTodayWinTokens(parseFloat(today));
      if (watched) setAdsWatched(parseInt(watched));
      if (resetDate) setLastResetDate(resetDate);
    } catch (error) {
      console.error('Error loading WIN tokens:', error);
    }
  };

  const checkDailyReset = async () => {
    const today = new Date().toDateString();
    const lastReset = await storage.getItem('last_reset_date');

    if (lastReset !== today) {
      resetDaily();
    }
  };

  const addWinTokens = async (tokens: number, type: 'banner' | 'native' | 'modal') => {
    try {
      const newTotal = totalWinTokens + tokens;
      const newToday = todayWinTokens + tokens;
      const newWatched = type === 'modal' ? adsWatched + 1 : adsWatched;

      setTotalWinTokens(newTotal);
      setTodayWinTokens(newToday);
      setAdsWatched(newWatched);

      await storage.setItem('win_tokens_total', newTotal.toString());
      await storage.setItem('win_tokens_today', newToday.toString());
      await storage.setItem('ads_watched', newWatched.toString());

      console.log(`💰 [WIN] +${tokens} WIN (${type}) | Total: ${newTotal} WIN`);
    } catch (error) {
      console.error('Error adding WIN tokens:', error);
    }
  };

  const resetDaily = async () => {
    try {
      const today = new Date().toDateString();
      setTodayWinTokens(0);
      setLastResetDate(today);

      await storage.setItem('win_tokens_today', '0');
      await storage.setItem('last_reset_date', today);

      console.log('🔄 [WIN] Daily stats reset');
    } catch (error) {
      console.error('Error resetting daily:', error);
    }
  };

  const refreshFromBackend = async () => {
    if (isRefreshing) {
      console.log('⏭️ [WIN] Already refreshing, skipping...');
      return;
    }
    
    try {
      setIsRefreshing(true);
      console.log('🔄 [WIN] Refreshing from backend...');
      
      // Import API instance
      const { default: api } = await import('../utils/api');
      
      // Fetch dashboard data from backend
      const response = await api.get('/user/dashboard');
      const data = response.data;
      
      console.log('📥 [WIN] Backend response:', data);
      
      if (data) {
        // Update USD values from backend
        const totalUSDValue = data.pending_revenue_usd || 0;
        const todayUSDValue = data.today_earnings_usd || 0;
        
        console.log('💰 [WIN] Setting USD values:', {
          totalUSDValue,
          todayUSDValue,
        });
        
        setTotalUSD(totalUSDValue);
        setTodayUSD(todayUSDValue);
        
        // Calculate WIN tokens (60 WIN per $1 USD)
        // Use Math.round to avoid floating point issues
        const totalTokens = Math.round(totalUSDValue * 60 * 100) / 100;
        const todayTokens = Math.round(todayUSDValue * 60 * 100) / 100;
        
        console.log('🪙 [WIN] Setting WIN tokens:', {
          totalTokens,
          todayTokens,
        });
        
        // Only update if different to prevent flickering
        setTotalWinTokens(prev => totalTokens !== prev ? totalTokens : prev);
        setTodayWinTokens(prev => todayTokens !== prev ? todayTokens : prev);
        
        // Update ads watched count if available
        if (data.ads_watched_today !== undefined) {
          setAdsWatched(data.ads_watched_today);
        }
        
        // Save to storage
        await storage.setItem('win_tokens_total', totalTokens.toString());
        await storage.setItem('win_tokens_today', todayTokens.toString());
        
        console.log('✅ [WIN] Refreshed from backend successfully!');
      } else {
        console.warn('⚠️ [WIN] No data received from backend');
      }
    } catch (error) {
      console.error('❌ [WIN] Error refreshing from backend:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <AdRevenueContext.Provider
      value={{
        totalWinTokens,
        todayWinTokens,
        adsWatched,
        totalUSD,
        todayUSD,
        isLoading,
        addWinTokens,
        resetDaily,
        refreshFromBackend,
      }}
    >
      {children}
    </AdRevenueContext.Provider>
  );
};

export const useAdRevenue = () => {
  const context = useContext(AdRevenueContext);
  if (!context) {
    throw new Error('useAdRevenue must be used within AdRevenueProvider');
  }
  return context;
};
