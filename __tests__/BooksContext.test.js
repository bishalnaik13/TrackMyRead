import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { BooksProvider, useBooks } from '../BooksContext';
import { BOOK_STATUS, SORT_OPTIONS, FILTER_OPTIONS } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../utils/storage', () => ({
  initializeStorage: jest.fn().mockResolvedValue([]),
  saveBooks: jest.fn().mockResolvedValue(true),
}));

const renderWithProvider = () => {
  let contextValue;
  const TestComponent = () => {
    contextValue = useBooks();
    return null;
  };
  
  render(
    <BooksProvider>
      <TestComponent />
    </BooksProvider>
  );
  
  return contextValue;
};

describe('BooksContext', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('addBook', () => {
    it('adds book with correct defaults', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let addedBook;
      await act(async () => {
        addedBook = booksContext.addBook('Test Title', 'Test Author');
      });
      
      expect(addedBook.title).toBe('Test Title');
      expect(addedBook.author).toBe('Test Author');
      expect(addedBook.rating).toBeNull();
      expect(addedBook.currentPage).toBeNull();
      expect(addedBook.totalPages).toBeNull();
      expect(addedBook.collections).toEqual([]);
      expect(addedBook.favorite).toBe(false);
      expect(addedBook.status).toBe(BOOK_STATUS.TO_READ);
      expect(addedBook.notes).toBe('');
      expect(addedBook.id).toBeDefined();
    });

    it('requires title', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let addedBook;
      await act(async () => {
        addedBook = booksContext.addBook('', 'Test Author');
      });
      
      expect(addedBook.title).toBe('');
    });

    it('generates unique IDs', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let book1, book2;
      await act(async () => {
        book1 = booksContext.addBook('Book 1');
        book2 = booksContext.addBook('Book 2');
      });
      
      expect(book1.id).not.toBe(book2.id);
    });
  });

  describe('updateBook', () => {
    it('updates only specified fields', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let book;
      await act(async () => {
        book = booksContext.addBook('Original Title', 'Original Author');
        booksContext.updateBook(book.id, { title: 'New Title' });
      });
      
      await act(async () => {
        const updated = booksContext.getBookById(book.id);
        expect(updated.title).toBe('New Title');
        expect(updated.author).toBe('Original Author');
      });
    });
  });

  describe('removeBook', () => {
    it('removes book from books array', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let book;
      await act(async () => {
        book = booksContext.addBook('To Delete');
        booksContext.removeBook(book.id);
      });
      
      await act(async () => {
        const result = booksContext.getBookById(book.id);
        expect(result).toBeNull();
      });
    });

    it('moves book to trash', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let book;
      await act(async () => {
        book = booksContext.addBook('To Delete');
        booksContext.removeBook(book.id);
      });
      
      await waitFor(() => {
        expect(booksContext.trash).not.toBeNull();
        expect(booksContext.trash.title).toBe('To Delete');
      });
    });
  });

  describe('undoDelete', () => {
    it('restores book from trash', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let book;
      await act(async () => {
        book = booksContext.addBook('To Restore');
        booksContext.removeBook(book.id);
      });
      
      await act(async () => {
        booksContext.undoDelete();
      });
      
      await waitFor(() => {
        const restored = booksContext.getBookById(book.id);
        expect(restored).not.toBeNull();
        expect(restored.title).toBe('To Restore');
        expect(booksContext.trash).toBeNull();
      });
    });
  });

  describe('toggleFavorite', () => {
    it('flips favorite boolean correctly', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let book;
      await act(async () => {
        book = booksContext.addBook('Test Book');
        expect(book.favorite).toBe(false);
        
        booksContext.toggleFavorite(book.id);
      });
      
      await act(async () => {
        const updated = booksContext.getBookById(book.id);
        expect(updated.favorite).toBe(true);
      });
      
      await act(async () => {
        booksContext.toggleFavorite(book.id);
      });
      
      await act(async () => {
        const updated = booksContext.getBookById(book.id);
        expect(updated.favorite).toBe(false);
      });
    });
  });

  describe('setStatus', () => {
    it('updates status to valid values', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let book;
      await act(async () => {
        book = booksContext.addBook('Test Book');
        booksContext.setStatus(book.id, BOOK_STATUS.READING);
      });
      
      await act(async () => {
        const updated = booksContext.getBookById(book.id);
        expect(updated.status).toBe(BOOK_STATUS.READING);
      });
      
      await act(async () => {
        booksContext.setStatus(book.id, BOOK_STATUS.READ);
      });
      
      await act(async () => {
        const updated = booksContext.getBookById(book.id);
        expect(updated.status).toBe(BOOK_STATUS.READ);
      });
    });
  });

  describe('setRating', () => {
    it('sets rating 1-5', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let book;
      await act(async () => {
        book = booksContext.addBook('Test Book');
        
        booksContext.setRating(book.id, 3);
      });
      
      await act(async () => {
        const updated = booksContext.getBookById(book.id);
        expect(updated.rating).toBe(3);
      });
      
      await act(async () => {
        booksContext.setRating(book.id, 5);
      });
      
      await act(async () => {
        const updated = booksContext.getBookById(book.id);
        expect(updated.rating).toBe(5);
      });
    });

    it('rejects out-of-range values', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let book;
      await act(async () => {
        book = booksContext.addBook('Test Book');
        
        booksContext.setRating(book.id, 0);
      });
      
      await act(async () => {
        const updated = booksContext.getBookById(book.id);
        expect(updated.rating).toBeNull();
      });
      
      await act(async () => {
        booksContext.setRating(book.id, 6);
      });
      
      await act(async () => {
        const updated = booksContext.getBookById(book.id);
        expect(updated.rating).toBeNull();
      });
    });

    it('allows null to clear rating', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let book;
      await act(async () => {
        book = booksContext.addBook('Test Book');
        booksContext.setRating(book.id, 4);
      });
      
      await act(async () => {
        booksContext.setRating(book.id, null);
      });
      
      await act(async () => {
        const updated = booksContext.getBookById(book.id);
        expect(updated.rating).toBeNull();
      });
    });
  });

  describe('setProgress', () => {
    it('updates currentPage and totalPages', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let book;
      await act(async () => {
        book = booksContext.addBook('Test Book');
        booksContext.setProgress(book.id, 50, 200);
      });
      
      await act(async () => {
        const updated = booksContext.getBookById(book.id);
        expect(updated.currentPage).toBe(50);
        expect(updated.totalPages).toBe(200);
      });
    });
  });

  describe('searchBooks', () => {
    it('matches on title', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      await act(async () => {
        booksContext.addBook('Harry Potter', 'J.K. Rowling');
        booksContext.addBook('Lord of the Rings', 'Tolkien');
      });
      
      const results = booksContext.searchBooks('Harry');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Harry Potter');
    });

    it('matches on author', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      await act(async () => {
        booksContext.addBook('Book 1', 'George R.R. Martin');
        booksContext.addBook('Book 2', 'Stephen King');
      });
      
      const results = booksContext.searchBooks('Martin');
      expect(results).toHaveLength(1);
      expect(results[0].author).toContain('Martin');
    });

    it('case-insensitive', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      await act(async () => {
        booksContext.addBook('Test Book', 'Test Author');
      });
      
      const results = booksContext.searchBooks('TEST');
      expect(results).toHaveLength(1);
    });

    it('empty query returns all', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      await act(async () => {
        booksContext.addBook('Book 1');
        booksContext.addBook('Book 2');
      });
      
      const results = booksContext.searchBooks('');
      expect(results).toHaveLength(2);
    });
  });

  describe('sortBooks', () => {
    it('sorts by title_asc', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      await act(async () => {
        booksContext.addBook('Zebra Book');
        booksContext.addBook('Apple Book');
        booksContext.addBook('Banana Book');
      });
      
      const sorted = booksContext.sortBooks(booksContext.books, SORT_OPTIONS.TITLE_ASC);
      expect(sorted[0].title).toBe('Apple Book');
      expect(sorted[1].title).toBe('Banana Book');
      expect(sorted[2].title).toBe('Zebra Book');
    });

    it('sorts by date_newest', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      let book1, book2;
      await act(async () => {
        book1 = booksContext.addBook('First');
        book2 = booksContext.addBook('Second');
      });
      
      const sorted = booksContext.sortBooks(booksContext.books, SORT_OPTIONS.DATE_NEWEST);
      expect(sorted[0].id).toBe(book2.id);
      expect(sorted[1].id).toBe(book1.id);
    });

    it('sorts by rating_high', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      await act(async () => {
        const b1 = booksContext.addBook('Low Rated');
        const b2 = booksContext.addBook('High Rated');
        const b3 = booksContext.addBook('Unrated');
        booksContext.setRating(b1.id, 2);
        booksContext.setRating(b2.id, 5);
      });
      
      const sorted = booksContext.sortBooks(booksContext.books, SORT_OPTIONS.RATING_HIGH);
      expect(sorted[0].rating).toBe(5);
    });

    it('sorts by rating_low', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      await act(async () => {
        const b1 = booksContext.addBook('High Rated');
        const b2 = booksContext.addBook('Low Rated');
        booksContext.setRating(b1.id, 5);
        booksContext.setRating(b2.id, 1);
      });
      
      const sorted = booksContext.sortBooks(booksContext.books, SORT_OPTIONS.RATING_LOW);
      expect(sorted[0].rating).toBe(1);
    });
  });

  describe('filterBooks', () => {
    it('filters by reading status', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      await act(async () => {
        const b1 = booksContext.addBook('To Read Book');
        const b2 = booksContext.addBook('Reading Book');
        const b3 = booksContext.addBook('Read Book');
        booksContext.setStatus(b2.id, BOOK_STATUS.READING);
        booksContext.setStatus(b3.id, BOOK_STATUS.READ);
      });
      
      const filtered = booksContext.filterBooks(booksContext.books, BOOK_STATUS.READING);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe(BOOK_STATUS.READING);
    });

    it('all returns full list', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      await act(async () => {
        booksContext.addBook('Book 1');
        booksContext.addBook('Book 2');
      });
      
      const filtered = booksContext.filterBooks(booksContext.books, FILTER_OPTIONS.ALL);
      expect(filtered).toHaveLength(2);
    });
  });

  describe('getFavorites', () => {
    it('returns only favorite books', async () => {
      let booksContext;
      await act(async () => {
        booksContext = renderWithProvider();
      });
      
      await act(async () => {
        const b1 = booksContext.addBook('Fav Book');
        const b2 = booksContext.addBook('Non-fav Book');
        booksContext.toggleFavorite(b1.id);
      });
      
      const favorites = booksContext.getFavorites();
      expect(favorites).toHaveLength(1);
      expect(favorites[0].favorite).toBe(true);
    });
  });
});