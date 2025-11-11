import React from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemeContext} from './ThemeContext';
import {getStyles, getColors} from './styles';

export default function SettingsScreen(){
    const {theme, setTheme} = React.useContext(ThemeContext);
    const styles = getStyles(theme);
    const colors = getColors(theme);

    return(
        <SafeAreaView style={[styles.screen, { padding: 20 }]}>
      <Text style={{ color: colors.text, fontSize: 18, marginBottom: 12 }}>Settings</Text>
      <View style={{ 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
         }}>
        <Text style={{ color: colors.text }}>Dark Mode</Text>
        <Switch value={theme === 'dark'} onValueChange={(v) => setTheme(v ? 'dark' : 'light')} />
      </View>

      {/* add more settings rows here later */}
    </SafeAreaView>
    );
}