import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AudioContextType {
  isMusicEnabled: boolean;
  toggleMusic: () => Promise<void>;
  playSlotSpin: () => Promise<void>;
  playWin: () => Promise<void>;
  playLoss: () => Promise<void>;
  playJackpot: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const backgroundMusicRef = useRef<Audio.Sound | null>(null);
  const soundEffectsRef = useRef<{ [key: string]: Audio.Sound }>({});

  useEffect(() => {
    loadMusicPreference();
    setupAudio();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    console.log('[AUDIO] Music enabled state changed:', isMusicEnabled);
    if (isMusicEnabled) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  }, [isMusicEnabled]);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const loadMusicPreference = async () => {
    try {
      const preference = await AsyncStorage.getItem('musicEnabled');
      if (preference !== null) {
        setIsMusicEnabled(preference === 'true');
      }
    } catch (error) {
      console.error('Error loading music preference:', error);
    }
  };

  const toggleMusic = async () => {
    const newValue = !isMusicEnabled;
    setIsMusicEnabled(newValue);
    try {
      await AsyncStorage.setItem('musicEnabled', newValue.toString());
    } catch (error) {
      console.error('Error saving music preference:', error);
    }
  };

  const playBackgroundMusic = async () => {
    try {
      console.log('[AUDIO] Attempting to play background music...');
      
      if (backgroundMusicRef.current) {
        console.log('[AUDIO] Background music already loaded, playing...');
        await backgroundMusicRef.current.playAsync();
        return;
      }

      console.log('[AUDIO] Loading background music from URL...');
      
      // TODO: Add your own relaxing background music here
      // Recommended: Soft piano, ambient, lofi beats
      // For now, using online royalty-free music URL
      // You can replace with local file: require('../assets/audio/background.mp3')
      
      const { sound } = await Audio.Sound.createAsync(
        { 
          uri: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_4a191d3d28.mp3'
        },
        { 
          isLooping: true, 
          volume: 0.3,
          shouldPlay: true
        }
      );
      
      backgroundMusicRef.current = sound;
      console.log('[AUDIO] Background music loaded and playing!');
      
      // Check if actually playing
      const status = await sound.getStatusAsync();
      console.log('[AUDIO] Music status:', status.isLoaded ? 'Loaded' : 'Not loaded', status.isPlaying ? 'Playing' : 'Not playing');
    } catch (error) {
      console.error('[AUDIO] Background music error:', error);
      // Gracefully handle missing audio files
    }
  };

  const stopBackgroundMusic = async () => {
    try {
      if (backgroundMusicRef.current) {
        await backgroundMusicRef.current.pauseAsync();
      }
    } catch (error) {
      console.error('Error stopping background music:', error);
    }
  };

  const playSoundEffect = async (soundKey: string, source: any, volume: number = 1.0) => {
    if (!isMusicEnabled) return;

    try {
      // Check if sound is already loaded
      if (soundEffectsRef.current[soundKey]) {
        const sound = soundEffectsRef.current[soundKey];
        await sound.replayAsync();
        return;
      }

      // Load and play new sound
      const { sound } = await Audio.Sound.createAsync(source, {
        volume,
        shouldPlay: true,
      });

      soundEffectsRef.current[soundKey] = sound;

      // Unload after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          delete soundEffectsRef.current[soundKey];
        }
      });
    } catch (error) {
      console.log(`Sound effect ${soundKey} not available:`, error);
    }
  };

  const playSlotSpin = async () => {
    // Slot spin sound
    await playSoundEffect('spin', { 
      uri: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3'
    }, 0.4);
  };

  const playWin = async () => {
    // Win celebration sound
    await playSoundEffect('win', { 
      uri: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_4a5a0e35a5.mp3'
    }, 0.6);
  };

  const playLoss = async () => {
    // Loss sound (subtle)
    await playSoundEffect('loss', { 
      uri: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_0625c1539c.mp3'
    }, 0.3);
  };

  const playJackpot = async () => {
    // Jackpot celebration sound
    await playSoundEffect('jackpot', { 
      uri: 'https://cdn.pixabay.com/download/audio/2022/03/20/audio_c6c4593109.mp3'
    }, 0.8);
  };

  const cleanup = async () => {
    try {
      if (backgroundMusicRef.current) {
        await backgroundMusicRef.current.unloadAsync();
        backgroundMusicRef.current = null;
      }

      // Unload all sound effects
      for (const key in soundEffectsRef.current) {
        await soundEffectsRef.current[key].unloadAsync();
      }
      soundEffectsRef.current = {};
    } catch (error) {
      console.error('Error cleaning up audio:', error);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isMusicEnabled,
        toggleMusic,
        playSlotSpin,
        playWin,
        playLoss,
        playJackpot,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
