import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getStyles, getColors } from '../styles';
import { ThemeContext } from '../context/ThemeContext';
import { useBooks } from '../context/BooksContext';
import { BOOK_STATUS } from '../constants';
import EmptyState from '../components/EmptyState';
import ProgressBottomSheet from '../components/ProgressBottomSheet';

export default function ReadingNowScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { 
    getCurrentlyReading, 
    calculateProgress, 
    setProgress, 
    calculateStreak,
    setStatus,
  } = useBooks();
  
  const styles = getStyles(theme);
  const colors = getColors(theme);
  
  const currentlyReading = getCurrentlyReading();
  const streak = calculateStreak();
  const [selectedBook, setSelectedBook] = useState(null);
  const [showProgressSheet, setShowProgressSheet] = useState(false);

  const handleUpdateProgress = (book) => {
    setSelectedBook(book);
    setShowProgressSheet(true);
  };

  const handleSaveProgress = (bookId, currentPage, totalPages) => {
    setProgress(bookId, currentPage, totalPages);
    setShowProgressSheet(false);
    setSelectedBook(null);
  };

  const handleStartReading = (bookId) => {
    setStatus(bookId, BOOK_STATUS.READING);
  };

  const renderBookCard = ({ item }) => {
    const progress = calculateProgress(item.currentPage, item.totalPages);
    const lastUpdated = item.updatedAt 
      ? new Date(item.updatedAt).toLocaleDateString() 
      : 'Never';

    return (
      <View style={[styles.card, { marginBottom: 12, flexDirection: 'column', alignItems: 'stretch' }]}>
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
            <Text style={{ fontSize: 11, color: colors.tint, marginTop: 4 }}>
              Last updated: {lastUpdated}
            </Text>
          </View>
        </View>
        
        {item.currentPage && item.totalPages && (
          <View style={{ marginTop: 12 }}>
            <View style={{ height: 6, backgroundColor: colors.neutral, borderRadius: 3, overflow: 'hidden' }}>
              <View 
                style={{ 
                  height: 6, 
                  width: `${progress}%`, 
                  backgroundColor: colors.primary, 
                  borderRadius: 3 
                }} 
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
              <Text style={{ fontSize: 12, color: colors.tint }}>
                {item.currentPage} / {item.totalPages} pages ({progress}%)
              </Text>
            </View>
          </View>
        )}
        
        <TouchableOpacity
          onPress={() => handleUpdateProgress(item)}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <Text style={{ color: colors.buttonText, fontWeight: '600' }}>
            Update Progress
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {streak > 0 && (
          <View style={{ 
            backgroundColor: colors.card, 
            padding: 16, 
            borderRadius: 12, 
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="flame" size={24} color="#FF6B35" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginLeft: 8 }}>
              {streak} day{streak !== 1 ? 's' : ''} reading streak
            </Text>
          </View>
        )}

        {currentlyReading.length === 0 ? (
          <EmptyState
            icon="book-outline"
            title="No books in progress"
            subtitle="Start reading a book from your Discover list"
            actionLabel="Go to Discover"
            onAction={() => navigation.navigate('Discover')}
            theme={theme}
          />
        ) : (
          <>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
              Currently Reading ({currentlyReading.length})
            </Text>
            <FlatList
              data={currentlyReading}
              keyExtractor={item => item.id}
              renderItem={renderBookCard}
              scrollEnabled={false}
            />
          </>
        )}
      </ScrollView>

      <ProgressBottomSheet
        visible={showProgressSheet}
        book={selectedBook}
        onClose={() => {
          setShowProgressSheet(false);
          setSelectedBook(null);
        }}
        onSave={handleSaveProgress}
        calculateProgress={calculateProgress}
        colors={colors}
      />
    </SafeAreaView>
  );
}