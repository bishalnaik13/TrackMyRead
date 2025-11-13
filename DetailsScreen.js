import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getStyles, getColors } from './styles';

export default function DetailsScreen({ route, navigation, books = [], setBooks, theme }) {
  const { bookId } = route.params || {};
  const book = books.find(b => b.id === bookId) || null;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(book ? book.title : '');
  const styles = getStyles(theme);
  const colors = getColors(theme);

  if (!book) {
    return (
      <View style={styles.screen}>
        <Text style={{ padding: 12, color: colors.tint }}>Book not found.</Text>
      </View>
    );
  }

  function toggleFavorite() {
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, favorite: !b.favorite } : b));
  }

  function removeBook() {
    Alert.alert('Delete', 'Delete this book?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { setBooks(prev => prev.filter(b => b.id !== bookId)); navigation.goBack(); } }
    ]);
  }

  function saveEdit() {
    if (!title.trim()) return;
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, title: title.trim() } : b));
    setEditing(false);
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.screen, { padding: 12 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>{book.title}</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          <Ionicons name={book.favorite ? 'heart' : 'heart-outline'} size={24} color={book.favorite ? colors.accent : colors.tint} />
        </TouchableOpacity>
      </View>

      <Text style={{ color: colors.tint, marginTop: 8 }}>{book.author}</Text>

      {editing ? (
        <>
          <TextInput value={title} onChangeText={setTitle} placeholderTextColor={colors.tint} style={[styles.input, { marginTop: 12 }]} />
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={saveEdit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonNeutral}
              onPress={() => {
                setEditing(false);
                setTitle(book.title);
                setAuthor(book.author);
                setNotes(book.notes);
              }}>
              <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={{ marginTop: 12, color: colors.text }}>{book.notes}</Text>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={() => setEditing(true)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonDestructive} onPress={removeBook}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}