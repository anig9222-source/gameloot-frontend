import React from 'react';
import { View, StyleSheet } from 'react-native';
import LanguageSelectorButton from './LanguageSelectorButton';

export default function LanguageSelectorGlobal() {
  return (
    <View style={styles.container}>
      <LanguageSelectorButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 16,
    zIndex: 9999,
  },
});
