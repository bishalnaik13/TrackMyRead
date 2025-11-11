// ...existing code...
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getStyles, getColors } from './styles';
import { ThemeContext } from './ThemeContext';

export default function FavoritesScreen({ books = [], setBooks, navigation }) {
  const { theme } = React.useContext(ThemeContext);
  const styles = getStyles(theme);
  const colors = getColors(theme);
  const favs = books.filter(b => b.favorite);

  function toggleFavorite(id) {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, favorite: !b.favorite } : b));
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      {favs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>Mark a book as favorite from Home</Text>
        </View>
      ) : (
        <FlatList
          data={favs}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'Details', params: { bookId: item.id } })} style={styles.card}>
              <View style={styles.cardLeft}>
                <View style={styles.coverPlaceholder}>
                  <Ionicons name="book" size={28} color="#fff" />
                </View>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMeta}>{item.author || 'Unknown author'}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={{ padding: 8 }}>
                <Ionicons name="heart" size={22} color={item.favorite ? colors.accent : colors.tint} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}