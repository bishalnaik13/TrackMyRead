import React from 'react';
import {View, Text, Switch} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getStyles, getColors} from './styles';

export default function SettingsScreen({ theme, setTheme }){
    const styles = getStyles(theme);
    const colors = getColors(theme);

    return(
        <SafeAreaView 
          edges={['left', 'right', 'bottom']} 
          style={[
            styles.screen, 
            { paddingHorizontal: 16, paddingTop: 8 }]}>
      {/* <Text style={{ color: colors.text, fontSize: 18, marginBottom: 12 }}>Settings</Text> */}
      <View style={{ 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
         }}>
        <Text style={{ color: colors.text }}>Dark Mode</Text>
        <Switch value={theme === 'dark'} onValueChange={(v) => setTheme(v ? 'dark' : 'light')} />
      </View>

      {/* add more settings rows here later */}
    </SafeAreaView>
    );
}