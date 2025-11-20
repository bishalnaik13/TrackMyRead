import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getStyles, getColors } from './styles';
import { ThemeContext } from './ThemeContext';

export default function DetailsScreen({ route, navigation, books = [], setBooks }) {
  const { bookId } = route.params || {};
  const book = books.find(b => b.id === bookId) || null;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(book ? book.title : '');
  const [author, setAuthor] = useState(book ? book.author : '');
  const [notes, setNotes] = useState(book ? book.notes : '');

  const { theme } = useContext(ThemeContext);

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
    setBooks(prev => prev.map(b =>
      b.id === bookId
        ? {
          ...b,
          title: title.trim(),
          author: author.trim(),
          notes: notes.trim()
        }
        : b));
    setEditing(false);
  }

  function setStatus(newStatus){
    setBooks(prev =>prev.map( b => 
      b.id === bookId
        ? { ...b, status: newStatus }
        : b
    ));
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.screen, { padding: 12 }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>{book.title}</Text>
        <TouchableOpacity onPress={toggleFavorite}>
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
          />
          <TextInput
            value={author}
            onChangeText={setAuthor}
            placeholderTextColor={colors.tint}
            style={[styles.input, { marginTop: 12 }]}
          />
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes"
            placeholderTextColor={colors.tint}
            style={[styles.input, { marginTop: 12 }]}
          />
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
          
          <View style={{ borderTopWidth: 1, borderColor: colors.neutral, marginTop: 20, paddingTop: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              Status: <Text style={{ color: colors.primary, fontWeight: 'normal' }}> {book.status || 'To Read'} </Text>
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: book.status === 'To Read' ? colors.primary : colors.card, flex: 1 }]}
                onPress={() => setStatus('To Read')}>
                <Text style={[styles.buttonText, { color: book.status === 'To Read' ? colors.buttonText : colors.text }]}>To Read</Text>
                </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: book.status === 'Reading' ? colors.primary : colors.card, flex: 1 }]}
                onPress={() => setStatus('Reading')}>
                <Text style={[styles.buttonText, { color: book.status === 'Reading' ? colors.buttonText : colors.text }]}>Reading</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: book.status === 'Read' ? colors.primary : colors.card, flex: 1 }]}
                onPress={() => setStatus('Read')}>
                <Text style={[styles.buttonText, { color: book.status === 'Read' ? colors.buttonText : colors.text }]}>Read</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}