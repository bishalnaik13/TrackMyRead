import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getStyles, getColors } from '../styles';
import { ThemeContext } from '../context/ThemeContext';
import { useBooks } from '../context/BooksContext';

export default function ProfileScreen({ navigation }) {
  const { theme } = React.useContext(ThemeContext);
  const { calculateStreak, getCurrentlyReading, books } = useBooks();
  const styles = getStyles(theme);
  const colors = getColors(theme);
  
  const streak = calculateStreak();
  const currentlyReading = getCurrentlyReading();
  const totalBooks = books.length;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 24 }}>
          Profile
        </Text>

        {streak > 0 && (
          <View style={{ 
            backgroundColor: colors.card, 
            padding: 16, 
            borderRadius: 12, 
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="flame" size={24} color="#FF6B35" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginLeft: 8 }}>
              {streak} day{streak !== 1 ? 's' : ''} reading streak
            </Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
          <TouchableOpacity 
            style={{ width: '50%', padding: 6 }}
            onPress={() => navigation.navigate('Stats')}
          >
            <View style={[styles.card, { alignItems: 'center', padding: 20 }]}>
              <Ionicons name="stats-chart" size={28} color={colors.primary} />
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginTop: 8 }}>
                {totalBooks}
              </Text>
              <Text style={{ fontSize: 12, color: colors.tint }}>Books</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ width: '50%', padding: 6 }}
            onPress={() => navigation.navigate('Collections')}
          >
            <View style={[styles.card, { alignItems: 'center', padding: 20 }]}>
              <Ionicons name="folder" size={28} color={colors.primary} />
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginTop: 8 }}>
                {currentlyReading.length}
              </Text>
              <Text style={{ fontSize: 12, color: colors.tint }}>Reading</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={{ marginTop: 16 }}
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', padding: 16 }]}>
            <Ionicons name="settings" size={24} color={colors.text} />
            <Text style={{ fontSize: 16, color: colors.text, marginLeft: 12 }}>Settings</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ marginTop: 8 }}
          onPress={() => navigation.navigate('About')}
        >
          <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', padding: 16 }]}>
            <Ionicons name="information-circle" size={24} color={colors.text} />
            <Text style={{ fontSize: 16, color: colors.text, marginLeft: 12 }}>About</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}