import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PropTypes from 'prop-types';
import { getStyles, getColors, getGlassTokens } from '../styles';
import { ThemeContext } from '../context/ThemeContext';
import { useBooks } from '../context/BooksContext';
import { navigationShape } from '../types';
import EmptyState from '../components/EmptyState';

function FavoritesScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { getFavorites, toggleFavorite } = useBooks();

  const styles = getStyles(theme);
  const colors = getColors(theme);
  const glassTokens = getGlassTokens(theme);
  const favs = getFavorites();

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Library', { screen: 'Details', params: { bookId: item.id } })}
        style={[styles.card, { backgroundColor: glassTokens.cardBg, borderColor: glassTokens.cardBorder, borderWidth: 1 }]}
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
      edges={["top", "left", "right"]}
      style={styles.screen}
    >
      <LinearGradient colors={glassTokens.screenGradient} style={StyleSheet.absoluteFill} />
      {favs.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="No favorites yet"
          subtitle="Mark a book as favorite from Home"
          theme={theme}
        />
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