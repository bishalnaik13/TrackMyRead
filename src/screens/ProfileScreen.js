import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles, getColors } from '../styles';
import { ThemeContext } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { theme } = React.useContext(ThemeContext);
  const styles = getStyles(theme);
  const colors = getColors(theme);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
          Profile
        </Text>
        <Text style={{ color: colors.tint, textAlign: 'center' }}>
          This screen is coming in Phase 17
        </Text>
      </View>
    </SafeAreaView>
  );
}