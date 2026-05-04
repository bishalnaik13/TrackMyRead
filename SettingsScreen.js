import React, { useContext } from 'react';
import { View, Text, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles, getColors } from './styles';
import { ThemeContext } from './ThemeContext';

export default function SettingsScreen() {

  const { theme, setTheme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const colors = getColors(theme);



  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={[
        styles.screen,
        { paddingHorizontal: 16, paddingTop: 8 }]}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
      }}>
        <Text style={{ color: colors.text }} accessibilityRole="text">Dark Mode</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={(v) => setTheme(v ? 'dark' : 'light')}
          accessibilityLabel="Toggle dark mode"
          accessibilityRole="switch"
          accessibilityState={{ checked: theme === 'dark' }}
        />
      </View>
    </SafeAreaView>
  );
}