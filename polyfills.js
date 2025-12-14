// Polyfills for @solana/web3.js in React Native
import 'react-native-get-random-values';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

// Process polyfill
if (typeof global.process === 'undefined') {
  global.process = {
    env: { NODE_ENV: 'production' },
    version: 'v16.0.0',
    nextTick: setImmediate
  };
}

// Crypto polyfill - needed for Solana
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (arr) => {
      if (arr) {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
      }
      return arr;
    }
  };
}
