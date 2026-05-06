import React, { useContext, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getStyles, getColors } from '../styles';
import { ThemeContext } from '../context/ThemeContext';
import { useBooks } from '../context/BooksContext';
import { SORT_OPTIONS } from '../constants';
import EmptyState from '../components/EmptyState';
import { BOOK_STATUS } from '../constants';

function CollectionDetailScreen({ route, navigation }) {
  const { collectionId } = route.params;
  const { theme } = useContext(ThemeContext);
  const { getBooksInCollection, toggleFavorite } = useBooks();

  const styles = getStyles(theme);
  const colors = getColors(theme);

  const books = useMemo(() => {
    return getBooksInCollection(collectionId);
  }, [collectionId, getBooksInCollection]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.collectionName || 'Collection',
    });
  }, [navigation, route.params.collectionName]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HomeStack', { screen: 'Details', params: { bookId: item.id } })}
      accessibilityLabel={`Book: ${item.title}`}
      accessibilityRole="button"
    >
      <View style={styles.cardLeft}>
        {item.coverUrl ? (
          <Image source={{ uri: item.coverUrl }} style={styles.coverImage} resizeMode="cover" />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name="book" size={28} color="#fff" />
          </View>
        )}
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardMeta}>{item.author || 'Unknown author'}</Text>
        <Text style={[styles.cardMetaSmall, { marginTop: 4 }]}>{item.status}</Text>
      </View>
      <TouchableOpacity
        onPress={() => toggleFavorite(item.id)}
        style={{ padding: 8 }}
        accessibilityLabel={item.favorite ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
        accessibilityRole="button"
      >
        <Ionicons name={item.favorite ? 'heart' : 'heart-outline'} size={22} color={item.favorite ? colors.accent : colors.tint} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.screen}>
      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={
          <EmptyState
            icon="book-outline"
            title="No books in this collection"
            subtitle="Add books to this collection from the book details page"
            theme={theme}
          />
        }
      />
    </SafeAreaView>
  );
}

export default CollectionDetailScreen;