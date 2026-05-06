import {
  BOOK_STATUS,
  SORT_OPTIONS,
  FILTER_OPTIONS,
  NAVIGATION_NAMES,
  STORAGE_KEYS,
  UI_CONFIG,
} from '../src/constants';

describe('Constants', () => {
  describe('BOOK_STATUS', () => {
    it('should have correct status values', () => {
      expect(BOOK_STATUS.TO_READ).toBe('To Read');
      expect(BOOK_STATUS.READING).toBe('Reading');
      expect(BOOK_STATUS.READ).toBe('Read');
    });
  });

  describe('SORT_OPTIONS', () => {
    it('should have all sort options defined', () => {
      expect(SORT_OPTIONS.TITLE_ASC).toBe('title_asc');
      expect(SORT_OPTIONS.TITLE_DESC).toBe('title_desc');
      expect(SORT_OPTIONS.DATE_NEWEST).toBe('date_newest');
      expect(SORT_OPTIONS.DATE_OLDEST).toBe('date_oldest');
      expect(SORT_OPTIONS.STATUS).toBe('status');
    });
  });

  describe('FILTER_OPTIONS', () => {
    it('should have all filter options defined', () => {
      expect(FILTER_OPTIONS.ALL).toBe('all');
      expect(FILTER_OPTIONS.TO_READ).toBe('To Read');
      expect(FILTER_OPTIONS.READING).toBe('Reading');
      expect(FILTER_OPTIONS.READ).toBe('Read');
    });
  });

  describe('NAVIGATION_NAMES', () => {
    it('should have navigation names defined', () => {
      expect(NAVIGATION_NAMES.HOME).toBe('Home');
      expect(NAVIGATION_NAMES.FAVORITES).toBe('Favorites');
      expect(NAVIGATION_NAMES.SETTINGS).toBe('Settings');
      expect(NAVIGATION_NAMES.ABOUT).toBe('About');
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have storage keys defined', () => {
      expect(STORAGE_KEYS.BOOKS).toBe('@books');
      expect(STORAGE_KEYS.THEME).toBe('@theme');
      expect(STORAGE_KEYS.SCHEMA_VERSION).toBe('@schema_version');
    });
  });

  describe('UI_CONFIG', () => {
    it('should have UI config values', () => {
      expect(UI_CONFIG.DEBOUNCE_DELAY).toBe(300);
      expect(UI_CONFIG.UNDO_TIMEOUT).toBe(5000);
      expect(UI_CONFIG.FONT_SIZES).toBeDefined();
      expect(UI_CONFIG.FONT_SIZES.SMALL).toBe(12);
      expect(UI_CONFIG.FONT_SIZES.MEDIUM).toBe(14);
      expect(UI_CONFIG.FONT_SIZES.LARGE).toBe(16);
    });
  });
});