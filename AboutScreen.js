import React from 'react';
import { View, Text } from 'react-native';
import { getStyles, getColors } from './styles';
import { ThemeContext } from './ThemeContext';

export default function AboutScreen() {
  const { theme } = React.useContext(ThemeContext);
  const styles = getStyles(theme);
  const colors = getColors(theme);

  return (
    <View style={[styles.screen, { padding: 16 }]}>
      <Text style={{ color: colors.text, fontSize: 18, marginBottom: 8 }}>About</Text>
      <Text style={{ color: colors.text }}>Simple Book tracker — demo app.</Text>
    </View>
  );
}