// Platform-specific storage utility
// Uses localStorage for web, AsyncStorage for mobile

import { Platform } from 'react-native';

// Conditional import for AsyncStorage (only for mobile)
let AsyncStorage: any = null;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.clear();
      } else {
        await AsyncStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export default storage;
