export const BOOK_STATUS = {
  TO_READ: 'To Read',
  READING: 'Reading',
  READ: 'Read',
};

export const SORT_OPTIONS = {
  TITLE_ASC: 'title_asc',
  TITLE_DESC: 'title_desc',
  DATE_NEWEST: 'date_newest',
  DATE_OLDEST: 'date_oldest',
  STATUS: 'status',
  RATING_HIGH: 'rating_high',
  RATING_LOW: 'rating_low',
};

export const FILTER_OPTIONS = {
  ALL: 'all',
  TO_READ: 'To Read',
  READING: 'Reading',
  READ: 'Read',
};

export const NAVIGATION_NAMES = {
  HOME: 'Home',
  FAVORITES: 'Favorites',
  SETTINGS: 'Settings',
  ABOUT: 'About',
  HOME_STACK: 'HomeStack',
  HOME_LIST: 'HomeList',
  DETAILS: 'Details',
  MAIN: 'Main',
};

export const STORAGE_KEYS = {
  BOOKS: '@books',
  THEME: '@theme',
  SCHEMA_VERSION: '@schema_version',
};

export const DEFAULT_BOOK = {
  favorite: false,
  status: BOOK_STATUS.TO_READ,
  notes: '',
  author: '',
  rating: null,
  currentPage: null,
  totalPages: null,
  collections: [],
};

export const SCHEMA_VERSION = 1;

export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  UNDO_TIMEOUT: 5000,
  FONT_SIZES: {
    SMALL: 12,
    MEDIUM: 14,
    LARGE: 16,
    XLARGE: 20,
    XXLARGE: 22,
  },
};