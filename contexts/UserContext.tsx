/**
 * User Context - Global State Management
 * 
 * Centralized state for:
 * - User coins/tokens
 * - Ad viewing progress
 * - User dashboard data
 * - Persistent storage with AsyncStorage
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import storage from './../utils/storage';
import api from '../services/api';

interface UserState {
  coins: number;
  winTokens: number;
  pendingRevenue: number;
  adViewCount: number;
  screenViewCount: number;
  lastAdViewDate: string | null;
  isLoading: boolean;
}

interface UserContextType extends UserState {
  updateCoins: (amount: number) => void;
  updateWinTokens: (amount: number) => void;
  updateRevenue: (amount: number) => void;
  incrementAdView: () => void;
  incrementScreenView: () => void;
  refreshUserData: () => Promise<void>;
  resetAdCount: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COINS: '@user_coins',
  WIN_TOKENS: '@user_win_tokens',
  PENDING_REVENUE: '@user_pending_revenue',
  AD_VIEW_COUNT: '@user_ad_view_count',
  SCREEN_VIEW_COUNT: '@user_screen_view_count',
  LAST_AD_DATE: '@user_last_ad_date',
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>({
    coins: 0,
    winTokens: 0,
    pendingRevenue: 0,
    adViewCount: 0,
    screenViewCount: 0,
    lastAdViewDate: null,
    isLoading: true,
  });

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const [coins, winTokens, revenue, adCount, screenCount, lastAdDate] = await Promise.all([
        storage.getItem(STORAGE_KEYS.COINS),
        storage.getItem(STORAGE_KEYS.WIN_TOKENS),
        storage.getItem(STORAGE_KEYS.PENDING_REVENUE),
        storage.getItem(STORAGE_KEYS.AD_VIEW_COUNT),
        storage.getItem(STORAGE_KEYS.SCREEN_VIEW_COUNT),
        storage.getItem(STORAGE_KEYS.LAST_AD_DATE),
      ]);

      setState(prev => ({
        ...prev,
        coins: coins ? parseFloat(coins) : 0,
        winTokens: winTokens ? parseFloat(winTokens) : 0,
        pendingRevenue: revenue ? parseFloat(revenue) : 0,
        adViewCount: adCount ? parseInt(adCount) : 0,
        screenViewCount: screenCount ? parseInt(screenCount) : 0,
        lastAdViewDate: lastAdDate,
        isLoading: false,
      }));
    } catch (error) {
      console.error('[UserContext] Error loading data:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const updateCoins = async (amount: number) => {
    const newCoins = state.coins + amount;
    setState(prev => ({ ...prev, coins: newCoins }));
    await storage.setItem(STORAGE_KEYS.COINS, newCoins.toString());
  };

  const updateWinTokens = async (amount: number) => {
    const newTokens = state.winTokens + amount;
    setState(prev => ({ ...prev, winTokens: newTokens }));
    await storage.setItem(STORAGE_KEYS.WIN_TOKENS, newTokens.toString());
  };

  const updateRevenue = async (amount: number) => {
    setState(prev => ({ ...prev, pendingRevenue: amount }));
    await storage.setItem(STORAGE_KEYS.PENDING_REVENUE, amount.toString());
  };

  const incrementAdView = async () => {
    const newCount = state.adViewCount + 1;
    const today = new Date().toISOString().split('T')[0];
    
    setState(prev => ({
      ...prev,
      adViewCount: newCount,
      lastAdViewDate: today,
    }));
    
    await Promise.all([
      storage.setItem(STORAGE_KEYS.AD_VIEW_COUNT, newCount.toString()),
      storage.setItem(STORAGE_KEYS.LAST_AD_DATE, today),
    ]);
  };

  const incrementScreenView = async () => {
    const newCount = state.screenViewCount + 1;
    setState(prev => ({ ...prev, screenViewCount: newCount }));
    await storage.setItem(STORAGE_KEYS.SCREEN_VIEW_COUNT, newCount.toString());
  };

  const resetAdCount = async () => {
    setState(prev => ({ ...prev, adViewCount: 0 }));
    await storage.setItem(STORAGE_KEYS.AD_VIEW_COUNT, '0');
  };

  const refreshUserData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Fetch latest data from backend
      const response = await api.get('/user/dashboard');
      const data = response.data;
      
      const newState = {
        coins: data.coins || 0,
        winTokens: data.win_tokens || 0,
        pendingRevenue: data.pending_revenue_usd || 0,
        adViewCount: state.adViewCount,
        screenViewCount: state.screenViewCount,
        lastAdViewDate: state.lastAdViewDate,
        isLoading: false,
      };
      
      setState(newState);
      
      // Persist to storage
      await Promise.all([
        storage.setItem(STORAGE_KEYS.COINS, newState.coins.toString()),
        storage.setItem(STORAGE_KEYS.WIN_TOKENS, newState.winTokens.toString()),
        storage.setItem(STORAGE_KEYS.PENDING_REVENUE, newState.pendingRevenue.toString()),
      ]);
    } catch (error) {
      console.error('[UserContext] Error refreshing data:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const value: UserContextType = {
    ...state,
    updateCoins,
    updateWinTokens,
    updateRevenue,
    incrementAdView,
    incrementScreenView,
    refreshUserData,
    resetAdCount,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
