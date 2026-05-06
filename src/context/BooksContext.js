import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import uuid from 'react-native-uuid';
import { initializeStorage, saveBooks, loadCollections, saveCollections } from '../utils/storage';
import { BOOK_STATUS } from '../constants';

export const calculateProgress = (currentPage, totalPages) => {
  if (!currentPage || !totalPages || totalPages === 0) return 0;
  return Math.min(100, Math.round((currentPage / totalPages) * 100));
};

const BooksContext = createContext(null);

export function BooksProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trash, setTrash] = useState(null);
  const [trashTimer, setTrashTimer] = useState(null);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    (async () => {
      const loadedBooks = await initializeStorage();
      const loadedCollections = await loadCollections();
      setBooks(loadedBooks);
      setCollections(loadedCollections);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveCollections(collections);
    }
  }, [collections, loading]);

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
      rating: null,
      currentPage: null,
      totalPages: null,
      collections: [],
      createdAt: Date.now(),
    };
    setBooks(prev => [newBook, ...prev]);
    return newBook;
  }, []);

  const fetchBookCover = useCallback(async (title, author, isbn = '') => {
    try {
      let query;
      if (isbn && isbn.length >= 10) {
        query = encodeURIComponent(`isbn:${isbn.replace(/[-\s]/g, '')}`);
      } else {
        query = encodeURIComponent(`${title} ${author}`.trim());
      }

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const covers = [];
        for (const item of data.items) {
          const volumeInfo = item.volumeInfo;
          if (volumeInfo.imageLinks?.thumbnail) {
            let coverUrl = volumeInfo.imageLinks.thumbnail;
            if (coverUrl.startsWith('http://')) {
              coverUrl = coverUrl.replace('http://', 'https://');
            }
            covers.push({
              url: coverUrl,
              title: volumeInfo.title || title,
              authors: volumeInfo.authors || [],
              publishedDate: volumeInfo.publishedDate || '',
              description: volumeInfo.description || '',
            });
          }
          if (covers.length >= 5) break;
        }

        if (covers.length === 1) {
          return { single: covers[0].url };
        } else if (covers.length > 1) {
          return { multiple: covers };
        }
      }
    } catch (error) {
      console.error('Error fetching book cover:', error);
    }
    return null;
  }, []);

  const fetchMultipleCovers = useCallback(async (title, author) => {
    try {
      const query = encodeURIComponent(`${title} ${author}`.trim());
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const covers = [];
        for (const item of data.items) {
          const volumeInfo = item.volumeInfo;
          if (volumeInfo.imageLinks?.thumbnail) {
            let coverUrl = volumeInfo.imageLinks.thumbnail;
            if (coverUrl.startsWith('http://')) {
              coverUrl = coverUrl.replace('http://', 'https://');
            }
            covers.push({
              url: coverUrl,
              title: volumeInfo.title || title,
              authors: volumeInfo.authors || [],
              publishedDate: volumeInfo.publishedDate || '',
            });
          }
          if (covers.length >= 6) break;
        }
        return covers.length > 0 ? covers : null;
      }
    } catch (error) {
      console.error('Error fetching multiple covers:', error);
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

  const setRating = useCallback((id, rating) => {
    if (rating === null || (rating >= 1 && rating <= 5)) {
      setBooks(prev =>
        prev.map(book =>
          book.id === id ? { ...book, rating } : book
        )
      );
    }
  }, []);

  const setProgress = useCallback((id, currentPage, totalPages) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === id ? { ...book, currentPage, totalPages } : book
      )
    );
  }, []);

  const addCollection = useCallback((name) => {
    const newCollection = {
      id: uuid.v4(),
      name: name.trim(),
      createdAt: Date.now(),
    };
    setCollections(prev => [...prev, newCollection]);
    return newCollection;
  }, []);

  const deleteCollection = useCallback((id) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    setBooks(prev =>
      prev.map(book => ({
        ...book,
        collections: (book.collections || []).filter(cid => cid !== id),
      }))
    );
  }, []);

  const renameCollection = useCallback((id, name) => {
    setCollections(prev =>
      prev.map(c => c.id === id ? { ...c, name: name.trim() } : c)
    );
  }, []);

  const addBookToCollection = useCallback((bookId, collectionId) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === bookId
          ? { ...book, collections: [...new Set([...(book.collections || []), collectionId])] }
          : book
      )
    );
  }, []);

  const removeBookFromCollection = useCallback((bookId, collectionId) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === bookId
          ? { ...book, collections: (book.collections || []).filter(cid => cid !== collectionId) }
          : book
      )
    );
  }, []);

  const getBooksInCollection = useCallback((collectionId) => {
    return books.filter(b => (b.collections || []).includes(collectionId));
  }, [books]);

  const getBookCollections = useCallback((bookId) => {
    const book = books.find(b => b.id === bookId);
    if (!book || !book.collections) return [];
    return book.collections.map(cid => collections.find(c => c.id === cid)).filter(Boolean);
  }, [books, collections]);

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
      case 'rating_high':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'rating_low':
        return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
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
    setRating,
    setProgress,
    calculateProgress,
    getBookById,
    getFavorites,
    searchBooks,
    sortBooks,
    filterBooks,
    trash,
    fetchBookCover,
    fetchMultipleCovers,
    updateBookCover,
    collections,
    addCollection,
    deleteCollection,
    renameCollection,
    addBookToCollection,
    removeBookFromCollection,
    getBooksInCollection,
    getBookCollections,
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