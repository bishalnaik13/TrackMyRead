import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
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

  const addBook = useCallback((title, author = '') => {
    const newBook = {
      id: uuidv4(),
      title: title.trim(),
      author: author.trim(),
      favorite: false,
      status: BOOK_STATUS.TO_READ,
      notes: '',
      createdAt: Date.now(),
    };
    setBooks(prev => [newBook, ...prev]);
    return newBook;
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

      const timer = setTimeout(() => {
        setBooks(prev => prev.filter(book => book.id !== id));
        setTrash(null);
        setTrashTimer(null);
      }, 5000);

      setTrashTimer(timer);
    }

    setBooks(prev => prev.filter(book => book.id !== id));
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
    trash,
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