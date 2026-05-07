import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getStyles, getColors, getGlassTokens } from '../styles';
import { ThemeContext } from '../context/ThemeContext';
import { useBooks } from '../context/BooksContext';
import { BOOK_STATUS } from '../constants';
import EmptyState from '../components/EmptyState';
import QuickAddModal from '../components/QuickAddModal';

export default function DiscoverScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { 
    getBooksByStatus, 
    addBook, 
    setStatus,
  } = useBooks();

  const styles = getStyles(theme);
  const colors = getColors(theme);
  const glassTokens = getGlassTokens(theme);

  const toReadBooks = getBooksByStatus(BOOK_STATUS.TO_READ);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleQuickAdd = (bookData) => {
    addBook({
      title: bookData.title,
      author: bookData.author,
      status: BOOK_STATUS.TO_READ,
    });
    setShowQuickAdd(false);
    Alert.alert('Success', `"${bookData.title}" added to your reading list`);
  };

  const handleStartReading = (bookId, bookTitle) => {
    Alert.alert(
      'Start Reading?',
      `Move "${bookTitle}" to your reading list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Reading', 
          onPress: () => setStatus(bookId, BOOK_STATUS.READING) 
        },
      ]
    );
  };

  const renderBookCard = ({ item }) => {
    return (
      <View style={[styles.card, { marginBottom: 12, backgroundColor: glassTokens.cardBg, borderColor: glassTokens.cardBorder, borderWidth: 1 }]}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.cardLeft}>
            {item.coverUrl ? (
              <Image source={{ uri: item.coverUrl }} style={styles.coverImage} resizeMode="cover" />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Ionicons name="book" size={28} color="#fff" />
              </View>
            )}
          </View>
          <View style={[styles.cardRight, { flex: 1 }]}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.cardMeta} numberOfLines={1}>{item.author || 'Unknown author'}</Text>
            <TouchableOpacity
              onPress={() => handleStartReading(item.id, item.title)}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
                alignItems: 'center',
                marginTop: 8,
                alignSelf: 'flex-start',
              }}
            >
              <Text style={{ color: colors.buttonText, fontWeight: '600', fontSize: 12 }}>
                Start Reading
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      <LinearGradient colors={glassTokens.screenGradient} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 16 }}>
          Discover
        </Text>

        {toReadBooks.length === 0 ? (
          <EmptyState
            icon="bookmarks-outline"
            title="No books to discover"
            subtitle="Add books to your reading list"
            actionLabel="Add Book"
            onAction={() => setShowQuickAdd(true)}
            theme={theme}
          />
        ) : (
          <>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
              To Read ({toReadBooks.length})
            </Text>
            <FlatList
              data={toReadBooks}
              keyExtractor={item => item.id}
              renderItem={renderBookCard}
              scrollEnabled={false}
            />
            <Text style={{ fontSize: 12, color: colors.tint, textAlign: 'center', marginTop: 16 }}>
              Tap "Start Reading" to move a book to your reading list
            </Text>
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowQuickAdd(true)}
      >
        <Ionicons name="add" size={28} color={colors.buttonText} />
      </TouchableOpacity>

      <QuickAddModal
        visible={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSave={handleQuickAdd}
        colors={colors}
      />
    </SafeAreaView>
  );
}