import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import uuid from 'react-native-uuid';
import { initializeStorage, saveBooks } from './utils/storage';
import { BOOK_STATUS } from './constants';

const BooksContext = createContext(null);

export function BooksProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trash, setTrash] = useState(null);
  const [trashTimer, setTrashTimer] = useState(null);

  useEffect(() => {
    (async () => {
      const loadedBooks = await initializeStorage();
      setBooks(loadedBooks);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveBooks(books);
    }
  }, [books, loading]);

  const addBook = useCallback((title, author = '', coverUrl = '') => {
    const newBook = {
      id: uuid.v4(),
      title: title.trim(),
      author: author.trim(),
      coverUrl: coverUrl || '',
      favorite: false,
      status: BOOK_STATUS.TO_READ,
      notes: '',
      createdAt: Date.now(),
    };
    setBooks(prev => [newBook, ...prev]);
    return newBook;
  }, []);

  const fetchBookCover = useCallback(async (title, author) => {
    try {
      const query = encodeURIComponent(`${title} ${author}`.trim());
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
      );
      const data = await response.json();
      if (data.items && data.items[0]?.volumeInfo?.imageLinks?.thumbnail) {
        let coverUrl = data.items[0].volumeInfo.imageLinks.thumbnail;
        if (coverUrl.startsWith('http://')) {
          coverUrl = coverUrl.replace('http://', 'https://');
        }
        return coverUrl;
      }
    } catch (error) {
      console.error('Error fetching book cover:', error);
    }
    return null;
  }, []);

  const updateBookCover = useCallback((id, coverUrl) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === id ? { ...book, coverUrl } : book
      )
    );
  }, []);

  const updateBook = useCallback((id, updates) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === id ? { ...book, ...updates } : book
      )
    );
  }, []);

  const removeBook = useCallback((id) => {
    const bookToDelete = books.find(b => b.id === id);
    if (bookToDelete) {
      setTrash(bookToDelete);

      if (trashTimer) {
        clearTimeout(trashTimer);
      }

      setBooks(prev => prev.filter(book => book.id !== id));

      const timer = setTimeout(() => {
        setTrash(null);
        setTrashTimer(null);
      }, 5000);

      setTrashTimer(timer);
    }
    return bookToDelete;
  }, [books, trashTimer]);

  const undoDelete = useCallback(() => {
    if (trash) {
      setBooks(prev => [trash, ...prev]);
      if (trashTimer) {
        clearTimeout(trashTimer);
      }
      setTrash(null);
      setTrashTimer(null);
    }
  }, [trash, trashTimer]);

  const toggleFavorite = useCallback((id) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === id ? { ...book, favorite: !book.favorite } : book
      )
    );
  }, []);

  const setStatus = useCallback((id, status) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === id ? { ...book, status } : book
      )
    );
  }, []);

  const getBookById = useCallback((id) => {
    return books.find(b => b.id === id) || null;
  }, [books]);

  const getFavorites = useCallback(() => {
    return books.filter(b => b.favorite);
  }, [books]);

  const searchBooks = useCallback((query) => {
    if (!query.trim()) return books;
    const q = query.toLowerCase();
    return books.filter(b =>
      (b.title || '').toLowerCase().includes(q) ||
      (b.author || '').toLowerCase().includes(q)
    );
  }, [books]);

  const sortBooks = useCallback((bookList, sortBy) => {
    const sorted = [...bookList];
    switch (sortBy) {
      case 'title_asc':
        return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'title_desc':
        return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      case 'date_newest':
        return sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      case 'date_oldest':
        return sorted.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      case 'status':
        return sorted.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
      default:
        return sorted;
    }
  }, []);

  const filterBooks = useCallback((bookList, filterBy) => {
    if (!filterBy || filterBy === 'all') return bookList;
    return bookList.filter(b => b.status === filterBy);
  }, []);

  const value = {
    books,
    loading,
    addBook,
    updateBook,
    removeBook,
    undoDelete,
    toggleFavorite,
    setStatus,
    getBookById,
    getFavorites,
    searchBooks,
    sortBooks,
    filterBooks,
    trash,
    fetchBookCover,
    updateBookCover,
  };

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
}

export default BooksContext;