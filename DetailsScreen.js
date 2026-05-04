import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getStyles, getColors } from './styles';
import { ThemeContext } from './ThemeContext';
import { useBooks } from './BooksContext';
import { BOOK_STATUS } from './constants';

export default function DetailsScreen({ route, navigation }) {
  const { bookId } = route.params || {};
  const { getBookById, updateBook, removeBook, toggleFavorite, setStatus, undoDelete, trash, fetchBookCover, updateBookCover } = useBooks();
  const book = getBookById(bookId);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(book ? book.title : '');
  const [author, setAuthor] = useState(book ? book.author : '');
  const [notes, setNotes] = useState(book ? book.notes : '');
  const [fetchingCover, setFetchingCover] = useState(false);

  const { theme } = useContext(ThemeContext);

  const styles = getStyles(theme);
  const colors = getColors(theme);

  if (!book) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} style={[styles.screen, { padding: 12 }]}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="book-outline" size={64} color={colors.tint} />
          <Text style={{ fontSize: 18, color: colors.text, marginTop: 16 }}>Book not found</Text>
          <Text style={{ color: colors.tint, marginTop: 8 }}>This book may have been deleted</Text>
          <TouchableOpacity
            style={[styles.buttonPrimary, { marginTop: 20 }]}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back to book list"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
          {trash && (
            <TouchableOpacity
              style={[styles.buttonNeutral, { marginTop: 12 }]}
              onPress={undoDelete}
              accessibilityLabel="Undo delete and restore book"
              accessibilityRole="button"
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Undo Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  function handleToggleFavorite() {
    toggleFavorite(bookId);
  }

  function handleRemoveBook() {
    removeBook(bookId);
    navigation.goBack();
  }

  function handleSaveEdit() {
    if (!title.trim()) return;
    updateBook(bookId, {
      title: title.trim(),
      author: author.trim(),
      notes: notes.trim()
    });
    setEditing(false);
  }

  function handleStatusChange(newStatus) {
    setStatus(bookId, newStatus);
  }

  async function handleSearchCover() {
    setFetchingCover(true);
    try {
      const cover = await fetchBookCover(book.title, book.author);
      if (cover) {
        updateBookCover(bookId, cover);
        Alert.alert('Success', 'Book cover found!');
      } else {
        Alert.alert('Not Found', 'Could not find a cover for this book');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search for cover');
    }
    setFetchingCover(false);
  }

  function handleRemoveCover() {
    updateBookCover(bookId, '');
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.screen, { padding: 12 }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {book.coverUrl ? (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Image source={{ uri: book.coverUrl }} style={{ width: 120, height: 180, borderRadius: 8 }} />
            {!editing && (
              <TouchableOpacity onPress={handleRemoveCover} style={{ marginTop: 8 }}>
                <Text style={{ color: colors.destructive, fontSize: 12 }}>Remove cover</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          !editing && (
            <TouchableOpacity
              onPress={handleSearchCover}
              disabled={fetchingCover}
              style={{ alignItems: 'center', paddingVertical: 12 }}
              accessibilityLabel="Search for book cover"
              accessibilityRole="button"
            >
              {fetchingCover ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="image-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
                  <Text style={{ color: colors.primary }}>Search cover</Text>
                </View>
              )}
            </TouchableOpacity>
          )
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>{book.title}</Text>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            accessibilityLabel={book.favorite ? `Remove ${book.title} from favorites` : `Add ${book.title} to favorites`}
            accessibilityRole="button"
          >
            <Ionicons name={book.favorite ? 'heart' : 'heart-outline'} size={24} color={book.favorite ? colors.accent : colors.tint} />
          </TouchableOpacity>
        </View>

        <Text style={{ color: colors.tint, marginTop: 8 }}>{book.author}</Text>

        {editing ? (
          <>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={colors.tint}
              style={[styles.input, { marginTop: 12 }]}
              accessibilityLabel="Edit book title"
            />
            <TextInput
              value={author}
              onChangeText={setAuthor}
              placeholderTextColor={colors.tint}
              style={[styles.input, { marginTop: 12 }]}
              accessibilityLabel="Edit author name"
            />
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Notes"
              placeholderTextColor={colors.tint}
              style={[styles.input, { marginTop: 12 }]}
              accessibilityLabel="Edit notes"
            />
            <View style={{ flexDirection: 'row', marginTop: 12 }}>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleSaveEdit}
                accessibilityLabel="Save book changes"
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonNeutral}
                onPress={() => {
                  setEditing(false);
                  setTitle(book.title);
                  setAuthor(book.author);
                  setNotes(book.notes);
                }}
                accessibilityLabel="Cancel editing"
                accessibilityRole="button"
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={{ marginTop: 12, color: colors.text }}>{book.notes}</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => setEditing(true)}
                accessibilityLabel="Edit book details"
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonDestructive}
                onPress={handleRemoveBook}
                accessibilityLabel={`Delete ${book.title}`}
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>

            <View style={{ borderTopWidth: 1, borderColor: colors.neutral, marginTop: 20, paddingTop: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                Status: <Text style={{ color: colors.primary, fontWeight: 'normal' }}> {book.status || BOOK_STATUS.TO_READ} </Text>
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: book.status === BOOK_STATUS.TO_READ ? colors.primary : colors.card, flex: 1 }]}
                  onPress={() => handleStatusChange(BOOK_STATUS.TO_READ)}
                  accessibilityLabel="Mark as To Read"
                  accessibilityRole="button"
                >
                  <Text style={[styles.buttonText, { color: book.status === BOOK_STATUS.TO_READ ? colors.buttonText : colors.text }]}>To Read</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: book.status === BOOK_STATUS.READING ? colors.primary : colors.card, flex: 1 }]}
                  onPress={() => handleStatusChange(BOOK_STATUS.READING)}
                  accessibilityLabel="Mark as Reading"
                  accessibilityRole="button"
                >
                  <Text style={[styles.buttonText, { color: book.status === BOOK_STATUS.READING ? colors.buttonText : colors.text }]}>Reading</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: book.status === BOOK_STATUS.READ ? colors.primary : colors.card, flex: 1 }]}
                  onPress={() => handleStatusChange(BOOK_STATUS.READ)}
                  accessibilityLabel="Mark as Read"
                  accessibilityRole="button"
                >
                  <Text style={[styles.buttonText, { color: book.status === BOOK_STATUS.READ ? colors.buttonText : colors.text }]}>Read</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}