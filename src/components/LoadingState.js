import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

export default function LoadingState({ theme = 'light', message = 'Loading...' }) {
  const colors = {
    background: theme === 'dark' ? '#282828' : '#FFFFFF',
    text: theme === 'dark' ? '#e6e6e6' : '#121212',
    tint: theme === 'dark' ? '#9ca3af' : '#666666',
    shimmer: theme === 'dark' ? '#3a3a3a' : '#f0f0f0',
    primary: theme === 'dark' ? '#0A84FF' : '#007aff',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.spinnerContainer}>
        <View style={[styles.spinner, { borderTopColor: colors.primary }]} />
        <Text style={[styles.message, { color: colors.tint }]}>{message}</Text>
      </View>
    </View>
  );
}

function SkeletonLoader({ theme = 'light' }) {
  const colors = {
    shimmer: theme === 'dark' ? '#3a3a3a' : '#f0f0f0',
  };

  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5].map(i => (
        <Animated.View
          key={i}
          style={[
            styles.skeletonItem,
            { backgroundColor: colors.shimmer, opacity }
          ]}
        />
      ))}
    </View>
  );
}

LoadingState.Skeleton = SkeletonLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    alignItems: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonItem: {
    height: 80,
    borderRadius: 10,
    marginBottom: 12,
  },
});