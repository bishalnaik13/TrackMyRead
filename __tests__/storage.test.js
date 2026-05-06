import {
  loadBooks,
  saveBooks,
  loadTheme,
  saveTheme,
  validateImportData,
  mergeBooks,
  exportBooks,
} from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('loadBooks', () => {
    it('should return empty array when no data', async () => {
      const books = await loadBooks();
      expect(books).toEqual([]);
    });

    it('should return books when valid data exists', async () => {
      const testBooks = [
        { id: '1', title: 'Test Book', favorite: false, status: 'To Read' },
      ];
      await AsyncStorage.setItem('@books', JSON.stringify(testBooks));
      const books = await loadBooks();
      expect(books).toEqual(testBooks);
    });

    it('should return empty array when invalid data', async () => {
      await AsyncStorage.setItem('@books', 'invalid json');
      const books = await loadBooks();
      expect(books).toEqual([]);
    });

    it('should return empty array when invalid book structure', async () => {
      await AsyncStorage.setItem('@books', JSON.stringify([{ id: '1' }]));
      const books = await loadBooks();
      expect(books).toEqual([]);
    });
  });

  describe('saveBooks', () => {
    it('should save books to storage', async () => {
      const testBooks = [
        { id: '1', title: 'Test Book', favorite: false, status: 'To Read' },
      ];
      const result = await saveBooks(testBooks);
      expect(result).toBe(true);
      const stored = await AsyncStorage.getItem('@books');
      expect(JSON.parse(stored)).toEqual(testBooks);
    });

    it('should return false for invalid data', async () => {
      const result = await saveBooks('not an array');
      expect(result).toBe(false);
    });

    it('preserves all fields including rating, currentPage, totalPages, collections', async () => {
      const testBooks = [
        { 
          id: '1', 
          title: 'Test Book', 
          favorite: false, 
          status: 'Reading',
          rating: 4,
          currentPage: 50,
          totalPages: 200,
          collections: ['collection1', 'collection2'],
        },
      ];
      await saveBooks(testBooks);
      const stored = await AsyncStorage.getItem('@books');
      const parsed = JSON.parse(stored);
      expect(parsed[0].rating).toBe(4);
      expect(parsed[0].currentPage).toBe(50);
      expect(parsed[0].totalPages).toBe(200);
      expect(parsed[0].collections).toEqual(['collection1', 'collection2']);
    });
  });

  describe('loadTheme', () => {
    it('should return light by default', async () => {
      const theme = await loadTheme();
      expect(theme).toBe('light');
    });

    it('should return dark when saved', async () => {
      await AsyncStorage.setItem('@theme', 'dark');
      const theme = await loadTheme();
      expect(theme).toBe('dark');
    });
  });

  describe('saveTheme', () => {
    it('should save theme to storage', async () => {
      await saveTheme('dark');
      const stored = await AsyncStorage.getItem('@theme');
      expect(stored).toBe('dark');
    });
  });

  describe('validateImportData', () => {
    it('should validate correct JSON', () => {
      const data = JSON.stringify({ books: [{ id: '1', title: 'Test' }] });
      const result = validateImportData(data);
      expect(result.valid).toBe(true);
      expect(result.books).toHaveLength(1);
    });

    it('should reject missing books array', () => {
      const data = JSON.stringify({ version: 1 });
      const result = validateImportData(data);
      expect(result.valid).toBe(false);
    });

    it('should reject invalid JSON', () => {
      const result = validateImportData('not json');
      expect(result.valid).toBe(false);
    });

    it('should reject books without id or title', () => {
      const data = JSON.stringify({ books: [{ id: '1' }] });
      const result = validateImportData(data);
      expect(result.valid).toBe(false);
    });
  });

  describe('mergeBooks', () => {
    it('should replace when mode is replace', () => {
      const existing = [{ id: '1', title: 'Existing' }];
      const newBooks = [{ id: '2', title: 'New' }];
      const result = mergeBooks(existing, newBooks, 'replace');
      expect(result).toEqual(newBooks);
    });

    it('should merge when mode is merge', () => {
      const existing = [{ id: '1', title: 'Existing' }];
      const newBooks = [{ id: '2', title: 'New' }];
      const result = mergeBooks(existing, newBooks, 'merge');
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(existing[0]);
      expect(result).toContainEqual(newBooks[0]);
    });

    it('should skip duplicates in merge mode', () => {
      const existing = [{ id: '1', title: 'Existing' }];
      const newBooks = [{ id: '1', title: 'Duplicate' }];
      const result = mergeBooks(existing, newBooks, 'merge');
      expect(result).toHaveLength(1);
    });
  });

  describe('exportBooks', () => {
    it('should export books with version and timestamp', async () => {
      const books = [{ id: '1', title: 'Test' }];
      const result = await exportBooks(books);
      const parsed = JSON.parse(result);
      expect(parsed.books).toEqual(books);
      expect(parsed.version).toBeDefined();
      expect(parsed.exportedAt).toBeDefined();
    });
  });
});