import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKS_KEY = '@books';
const THEME_KEY = '@theme';
const SCHEMA_VERSION_KEY = '@schema_version';

const CURRENT_SCHEMA_VERSION = 1;

function isValidBook(book) {
  return (
    book &&
    typeof book.id === 'string' &&
    typeof book.title === 'string' &&
    typeof book.favorite === 'boolean' &&
    typeof book.status === 'string'
  );
}

function isValidBooksArray(data) {
  return Array.isArray(data) && data.every(isValidBook);
}

export async function loadBooks() {
  try {
    const raw = await AsyncStorage.getItem(BOOKS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!isValidBooksArray(parsed)) {
      console.warn('Invalid books data in storage, returning empty array');
      return [];
    }

    return parsed;
  } catch (error) {
    console.error('Error loading books from storage:', error);
    return [];
  }
}

export async function saveBooks(books) {
  try {
    if (!Array.isArray(books)) {
      console.warn('Invalid books data, not saving');
      return false;
    }
    await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    return true;
  } catch (error) {
    console.error('Error saving books to storage:', error);
    return false;
  }
}

export async function loadTheme() {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return theme === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.error('Error loading theme:', error);
    return 'light';
  }
}

export async function saveTheme(theme) {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
    return true;
  } catch (error) {
    console.error('Error saving theme:', error);
    return false;
  }
}

export async function getSchemaVersion() {
  try {
    const version = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);
    return version ? parseInt(version, 10) : 0;
  } catch (error) {
    console.error('Error getting schema version:', error);
    return 0;
  }
}

export async function setSchemaVersion(version) {
  try {
    await AsyncStorage.setItem(SCHEMA_VERSION_KEY, version.toString());
    return true;
  } catch (error) {
    console.error('Error setting schema version:', error);
    return false;
  }
}

export async function runMigrations(books) {
  const version = await getSchemaVersion();

  if (version < 1) {
    console.log('Running migration v1: ensuring all books have required fields');
    return books.map(book => ({
      id: book.id,
      title: book.title || 'Untitled',
      author: book.author || '',
      favorite: book.favorite || false,
      status: book.status || 'To Read',
      notes: book.notes || '',
      createdAt: book.createdAt || Date.now(),
    }));
  }

  return books;
}

export async function initializeStorage() {
  try {
    let books = await loadBooks();
    const version = await getSchemaVersion();

    if (version < CURRENT_SCHEMA_VERSION) {
      books = await runMigrations(books);
      await saveBooks(books);
      await setSchemaVersion(CURRENT_SCHEMA_VERSION);
    }

    return books;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return [];
  }
}