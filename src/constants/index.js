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
  // New tab routes
  LIBRARY: 'Library',
  LIBRARY_STACK: 'LibraryStack',
  READING: 'Reading',
  READING_STACK: 'ReadingStack',
  DISCOVER: 'Discover',
  DISCOVER_STACK: 'DiscoverStack',
  PROFILE: 'Profile',
  PROFILE_STACK: 'ProfileStack',
  COLLECTIONS: 'Collections',
  STATS: 'Stats',
  ONBOARDING: 'Onboarding',
};

export const STORAGE_KEYS = {
  BOOKS: '@books',
  THEME: '@theme',
  SCHEMA_VERSION: '@schema_version',
  COLLECTIONS: '@collections',
  READING_GOAL: '@reading_goal',
  ONBOARDING: '@onboarding_complete',
};

export const MAX_COLLECTION_NAME_LENGTH = 30;

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
    TINY:    10,
    SMALL:   12,
    MEDIUM:  14,
    LARGE:   17,
    XLARGE:  22,
    XXLARGE: 28,
    DISPLAY: 34,
  },
};