import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function LiquidTabBarBackground({ theme = 'light', children }) {
  const isDark = theme === 'dark';
  
  return (
    <View style={styles.container}>
      <BlurView
        intensity={isDark ? 70 : 90}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={[
        styles.glassOverlay,
        { backgroundColor: isDark ? 'rgba(20,20,22,0.58)' : 'rgba(255,255,255,0.42)' }
      ]} />
      <View style={[
        styles.topBorder,
        { borderTopColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.55)' }
      ]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 32,
    overflow: 'hidden',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderRadius: 32,
  },
});