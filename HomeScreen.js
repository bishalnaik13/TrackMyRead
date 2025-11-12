// ...existing code...
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getStyles, getColors } from './styles';

export default function HomeScreen({ navigation, books = [], setBooks, theme }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [query, setQuery] = useState('');

  const styles = getStyles(theme);
  const colors = getColors(theme);

  function resetForm() { setTitle(''); setAuthor(''); }

  const filteredBooks = books.filter(b => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (b.title || '').toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q);
  });

  function addBook() {
    if (!title.trim()) return;
    const newBook = { id: Date.now().toString(), title: title.trim(), author: author.trim(), favorite: false };
    setBooks(prev => [newBook, ...prev]);
    resetForm();
    setModalVisible(false);
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Details', { bookId: item.id })} style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={styles.coverPlaceholder}>
            <Ionicons name="book" size={28} color="#fff" />
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardMeta}>{item.author || 'Unknown author'}</Text>
        </View>
        <TouchableOpacity onPress={() => setBooks(prev => prev.map(b => b.id === item.id ? { ...b, favorite: !b.favorite } : b))} style={{ padding: 8 }}>
          <Ionicons name={item.favorite ? 'heart' : 'heart-outline'} size={22} color={item.favorite ? colors.accent : colors.tint} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.screen}>
      {/* Search box */}
      <View style={[styles.searchWrapper, { margin: 12 }]}>
        <TextInput
          placeholder="Search by title or author"
          placeholderTextColor={colors.tint}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      {books.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No books yet</Text>
          <Text style={styles.emptySubtitle}>Tap + to add</Text>
        </View>
      ) : (
        // Single list driven by filteredBooks
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

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color={colors.buttonText} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalWrapper}>
          <View style={styles.modal}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Book</Text>
                <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                  <Ionicons name="close" size={24} color={colors.tint} />
                </TouchableOpacity>
              </View>
              <TextInput style={styles.input} placeholder="Title *" placeholderTextColor={colors.tint} value={title} onChangeText={setTitle} />
              <TextInput style={styles.input} placeholder="Author" placeholderTextColor={colors.tint} value={author} onChangeText={setAuthor} />
              <View style={styles.row}>
                <TouchableOpacity style={styles.buttonPrimary} onPress={addBook}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonNeutral} onPress={() => { setModalVisible(false); resetForm(); }}>
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