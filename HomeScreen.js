import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator, Alert, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import PropTypes from 'prop-types';
import { getStyles, getColors } from './styles';
import { ThemeContext } from './ThemeContext';
import { useBooks } from './BooksContext';
import { UI_CONFIG, SORT_OPTIONS, FILTER_OPTIONS } from './constants';
import { navigationShape } from './types';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';

function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [fetchingCover, setFetchingCover] = useState(false);
  const [coverOptions, setCoverOptions] = useState([]);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DATE_NEWEST);
  const [filterBy, setFilterBy] = useState(FILTER_OPTIONS.ALL);
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const debounceTimeout = useRef(null);

  const { theme } = useContext(ThemeContext);
  const { books, addBook, toggleFavorite, searchBooks, fetchBookCover, fetchMultipleCovers, sortBooks, filterBooks, removeBook } = useBooks();

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

  function resetForm() { setTitle(''); setAuthor(''); setCoverUrl(''); }

  const filteredBooks = useMemo(() => {
    let result = searchBooks(debouncedQuery);
    result = filterBooks(result, filterBy);
    result = sortBooks(result, sortBy);
    return result;
  }, [debouncedQuery, filterBy, sortBy, searchBooks, filterBooks, sortBooks]);

  async function handleSearchCover() {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a book title first');
      return;
    }
    setFetchingCover(true);
    try {
      const result = await fetchBookCover(title, author);
      if (result?.multiple) {
        setCoverOptions(result.multiple);
        setShowCoverPicker(true);
      } else if (result?.single) {
        setCoverUrl(result.single);
        Alert.alert('Success', 'Book cover found!');
      } else if (result) {
        setCoverUrl(result);
        Alert.alert('Success', 'Book cover found!');
      } else {
        Alert.alert('Not Found', 'Could not find a cover for this book');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search for cover');
    }
    setFetchingCover(false);
  }

  async function handlePickFromGallery() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library to select cover images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCoverUrl(result.assets[0].uri);
      setCoverOptions([]);
      setShowCoverPicker(false);
    }
  }

  function handleSelectCover(selectedUrl) {
    setCoverUrl(selectedUrl);
    setCoverOptions([]);
    setShowCoverPicker(false);
  }

  function handleAddBook() {
    if (!title.trim()) return;
    addBook(title.trim(), author.trim(), coverUrl);
    resetForm();
    setModalVisible(false);
  }

  function SwipeableRow({ item, children, onDelete, onToggleFavorite }) {
    const translateX = useRef(new Animated.Value(0)).current;
    const [isOpen, setIsOpen] = useState(false);

    function handleSwipe(direction) {
      if (direction === 'left') {
        Animated.spring(translateX, {
          toValue: -100,
          useNativeDriver: true,
        }).start();
        setIsOpen(true);
      } else if (direction === 'right') {
        if (isOpen) {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          setIsOpen(false);
        } else {
          onToggleFavorite();
        }
      }
    }

    function handleActionPress(action) {
      if (action === 'delete') {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        onDelete();
      } else if (action === 'favorite') {
        onToggleFavorite();
      }
      setIsOpen(false);
    }

    return (
      <View style={{ marginBottom: 10 }}>
        <View style={styles.swipeActions}>
          <TouchableOpacity
            style={[styles.swipeAction, { backgroundColor: colors.destructive }]}
            onPress={() => handleActionPress('delete')}
            accessibilityLabel={`Delete ${item.title}`}
            accessibilityRole="button"
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 10, marginTop: 2 }}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.swipeAction, { backgroundColor: colors.accent }]}
            onPress={() => handleActionPress('favorite')}
            accessibilityLabel={`Toggle favorite for ${item.title}`}
            accessibilityRole="button"
          >
            <Ionicons name={item.favorite ? 'heart' : 'heart-outline'} size={20} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 10, marginTop: 2 }}>{item.favorite ? 'Unfavorite' : 'Favorite'}</Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={{ transform: [{ translateX }] }}>
          {children}
        </Animated.View>
      </View>
    );
  }

  function renderItem({ item }) {
    return (
      <SwipeableRow
        item={item}
        onDelete={() => removeBook(item.id)}
        onToggleFavorite={() => toggleFavorite(item.id)}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('Details', { bookId: item.id })}
          style={styles.card}
          accessibilityLabel={`Book: ${item.title} by ${item.author || 'unknown author'}`}
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
      </SwipeableRow>
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

      <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 8 }}>
        <TouchableOpacity
          onPress={() => setShowSortFilter(!showSortFilter)}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, backgroundColor: colors.card, borderRadius: 6 }}
          accessibilityLabel="Sort and filter options"
          accessibilityRole="button"
        >
          <Ionicons name="options" size={16} color={colors.text} />
          <Text style={{ color: colors.text, marginLeft: 6, fontSize: 14 }}>Sort/Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          style={{ marginLeft: 8, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: colors.card, borderRadius: 6 }}
          accessibilityLabel={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
          accessibilityRole="button"
        >
          <Ionicons name={viewMode === 'list' ? 'grid-outline' : 'list-outline'} size={16} color={colors.text} />
        </TouchableOpacity>
        {(filterBy !== FILTER_OPTIONS.ALL || sortBy !== SORT_OPTIONS.DATE_NEWEST) && (
          <TouchableOpacity
            onPress={() => { setFilterBy(FILTER_OPTIONS.ALL); setSortBy(SORT_OPTIONS.DATE_NEWEST); }}
            style={{ marginLeft: 8, paddingVertical: 6, paddingHorizontal: 10 }}
          >
            <Text style={{ color: colors.destructive, fontSize: 14 }}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {showSortFilter && (
        <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: colors.tint, fontSize: 12, marginBottom: 4 }}>Sort by:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {[
                { value: SORT_OPTIONS.DATE_NEWEST, label: 'Newest' },
                { value: SORT_OPTIONS.DATE_OLDEST, label: 'Oldest' },
                { value: SORT_OPTIONS.TITLE_ASC, label: 'A-Z' },
                { value: SORT_OPTIONS.TITLE_DESC, label: 'Z-A' },
                { value: SORT_OPTIONS.STATUS, label: 'Status' },
              ].map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setSortBy(opt.value)}
                  style={{ paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, marginBottom: 4, borderRadius: 16, backgroundColor: sortBy === opt.value ? colors.primary : colors.card }}
                >
                  <Text style={{ color: sortBy === opt.value ? colors.buttonText : colors.text, fontSize: 12 }}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View>
            <Text style={{ color: colors.tint, fontSize: 12, marginBottom: 4 }}>Filter by status:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {[
                { value: FILTER_OPTIONS.ALL, label: 'All' },
                { value: FILTER_OPTIONS.TO_READ, label: 'To Read' },
                { value: FILTER_OPTIONS.READING, label: 'Reading' },
                { value: FILTER_OPTIONS.READ, label: 'Read' },
              ].map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setFilterBy(opt.value)}
                  style={{ paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, marginBottom: 4, borderRadius: 16, backgroundColor: filterBy === opt.value ? colors.primary : colors.card }}
                >
                  <Text style={{ color: filterBy === opt.value ? colors.buttonText : colors.text, fontSize: 12 }}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {books.length === 0 ? (
        <EmptyState
          icon="library-outline"
          title="No books yet"
          subtitle="Tap + to add your first book"
          actionLabel="Add Book"
          onAction={() => setModalVisible(true)}
          theme={theme}
        />
      ) : (
        <>
          {filteredBooks.length === 0 ? (
            <EmptyState
              icon="search-outline"
              title="No results"
              subtitle="Try a different search term"
              theme={theme}
            />
          ) : viewMode === 'grid' ? (
            <FlatList
              data={filteredBooks}
              keyExtractor={i => i.id}
              numColumns={2}
              contentContainerStyle={{ padding: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Details', { bookId: item.id })}
                  style={{ flex: 1, margin: 6, borderRadius: 10, overflow: 'hidden', backgroundColor: colors.card }}
                  accessibilityLabel={`Book: ${item.title}`}
                  accessibilityRole="button"
                >
                  {item.coverUrl ? (
                    <Image source={{ uri: item.coverUrl }} style={{ width: '100%', height: 140 }} resizeMode="cover" />
                  ) : (
                    <View style={{ width: '100%', height: 140, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="book" size={32} color="#fff" />
                    </View>
                  )}
                  <View style={{ padding: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }} numberOfLines={2}>{item.title}</Text>
                    <Text style={{ fontSize: 10, color: colors.tint }} numberOfLines={1}>{item.author || 'Unknown'}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
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
              {coverUrl ? (
                <View style={{ alignItems: 'center', marginVertical: 10 }}>
                  <Image source={{ uri: coverUrl }} style={{ width: 80, height: 120, borderRadius: 4 }} />
                  <TouchableOpacity onPress={() => setCoverUrl('')} style={{ marginTop: 4 }}>
                    <Text style={{ color: colors.destructive, fontSize: 12 }}>Remove cover</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ marginTop: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 }}>
                    <TouchableOpacity
                      style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginRight: 4, backgroundColor: colors.card, borderRadius: 8 }}
                      onPress={handleSearchCover}
                      disabled={fetchingCover}
                      accessibilityLabel="Search for book cover"
                      accessibilityRole="button"
                    >
                      {fetchingCover ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                      ) : (
                        <>
                          <Ionicons name="search" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                          <Text style={{ color: colors.primary, fontSize: 13 }}>Search Google</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginLeft: 4, backgroundColor: colors.card, borderRadius: 8 }}
                      onPress={handlePickFromGallery}
                      accessibilityLabel="Pick cover from gallery"
                      accessibilityRole="button"
                    >
                      <Ionicons name="images-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                      <Text style={{ color: colors.primary, fontSize: 13 }}>From Gallery</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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

      <Modal visible={showCoverPicker} transparent animationType="fade" onRequestClose={() => setShowCoverPicker(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>Select Cover</Text>
              <TouchableOpacity onPress={() => setShowCoverPicker(false)}>
                <Ionicons name="close" size={24} color={colors.tint} />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row' }}>
                {coverOptions.map((cover, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelectCover(cover.url)}
                    style={{ marginRight: 12 }}
                  >
                    <Image source={{ uri: cover.url }} style={{ width: 100, height: 150, borderRadius: 8 }} />
                    <Text style={{ color: colors.tint, fontSize: 10, marginTop: 4, textAlign: 'center' }} numberOfLines={1}>
                      {cover.publishedDate ? cover.publishedDate.substring(0, 4) : 'Unknown'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

HomeScreen.propTypes = {
  navigation: navigationShape,
};

export default HomeScreen;