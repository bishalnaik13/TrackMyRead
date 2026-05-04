import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { getStyles, getColors } from './styles';
import { ThemeContext } from './ThemeContext';
import { useBooks } from './BooksContext';
import { navigationShape } from './types';

function FavoritesScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { getFavorites, toggleFavorite } = useBooks();

  const styles = getStyles(theme);
  const colors = getColors(theme);
  const favs = getFavorites();

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Home', { screen: 'Details', params: { bookId: item.id } })}
        style={styles.card}
        accessibilityLabel={`Favorite book: ${item.title} by ${item.author || 'unknown author'}`}
        accessibilityRole="button"
      >
        <View style={styles.cardLeft}>
          <View style={styles.coverPlaceholder}>
            <Ionicons name="book" size={28} color="#fff" />
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardMeta}>{item.author || 'Unknown author'}</Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          style={{ padding: 8 }}
          accessibilityLabel={`Remove ${item.title} from favorites`}
          accessibilityRole="button"
        >
          <Ionicons name="heart" size={22} color={item.favorite ? colors.accent : colors.tint} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={styles.screen}
    >
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
          renderItem = { renderItem }
        />
      )}
    </SafeAreaView>
  );
}

FavoritesScreen.propTypes = {
  navigation: navigationShape,
};

export default FavoritesScreen;