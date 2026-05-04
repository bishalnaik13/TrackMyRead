import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getStyles, getColors } from './styles';
import { ThemeContext } from './ThemeContext';
import { useBooks } from './BooksContext';
import { UI_CONFIG } from './constants';

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceTimeout = useRef(null);

  const { theme } = useContext(ThemeContext);
  const { books, addBook, toggleFavorite, searchBooks } = useBooks();

  const styles = getStyles(theme);
  const colors = getColors(theme);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, UI_CONFIG.DEBOUNCE_DELAY);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  function resetForm() { setTitle(''); setAuthor(''); }

  const filteredBooks = searchBooks(debouncedQuery);

  function handleAddBook() {
    if (!title.trim()) return;
    addBook(title.trim(), author.trim());
    resetForm();
    setModalVisible(false);
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { bookId: item.id })}
        style={styles.card}
        accessibilityLabel={`Book: ${item.title} by ${item.author || 'unknown author'}`}
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
          accessibilityLabel={item.favorite ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
          accessibilityRole="button"
        >
          <Ionicons name={item.favorite ? 'heart' : 'heart-outline'} size={22} color={item.favorite ? colors.accent : colors.tint} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.screen}>
      <View style={[styles.searchWrapper, { margin: 12 }]}>
        <TextInput
          placeholder="Search by title or author"
          placeholderTextColor={colors.tint}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          accessibilityLabel="Search books by title or author"
          accessibilityHint="Enter book title or author name to search"
        />
      </View>

      {books.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No books yet</Text>
          <Text style={styles.emptySubtitle}>Tap + to add</Text>
        </View>
      ) : (
        <>
          {filteredBooks.length === 0 ? (
            <View style={[styles.empty, { paddingTop: 20 }]}>
              <Text style={styles.emptyTitle}>No results</Text>
              <Text style={styles.emptySubtitle}>Try a different search term</Text>
            </View>
          ) : (
            <FlatList data={filteredBooks} keyExtractor={i => i.id} renderItem={renderItem} contentContainerStyle={{ padding: 12 }} />
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Add new book"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={28} color={colors.buttonText} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalWrapper}>
          <View style={styles.modal}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Book</Text>
                <TouchableOpacity
                  onPress={() => { setModalVisible(false); resetForm(); }}
                  accessibilityLabel="Close add book dialog"
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={24} color={colors.tint} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Title *"
                placeholderTextColor={colors.tint}
                value={title}
                onChangeText={setTitle}
                accessibilityLabel="Book title input"
              />
              <TextInput
                style={styles.input}
                placeholder="Author"
                placeholderTextColor={colors.tint}
                value={author}
                onChangeText={setAuthor}
                accessibilityLabel="Author name input"
              />
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={handleAddBook}
                  accessibilityLabel="Save new book"
                  accessibilityRole="button"
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonNeutral}
                  onPress={() => { setModalVisible(false); resetForm(); }}
                  accessibilityLabel="Cancel adding book"
                  accessibilityRole="button"
                >
                  <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}