# TrackMyRead Implementation Plan

## Overview
This document outlines the phased development plan for the TrackMyRead app, a React Native/Expo application for tracking books.

---

## Phase 1: Foundation (Weeks 1-2)
**Goal:** Fix stability issues and improve code architecture

### Task 1.1: Add Error Handling for AsyncStorage
- **Files to modify:** `App.js`
- **Create:** `utils/storage.js`
- **Description:** Add try/catch for JSON.parse, validate data shape, prevent crashes on corrupted storage
- **Acceptance:** App loads without crash if storage contains bad JSON

### Task 1.2: Create BooksContext
- **Files to modify:** `App.js`, `HomeScreen.js`, `DetailsScreen.js`, `FavoritesScreen.js`
- **Create:** `BooksContext.js`
- **Description:** Centralize book state and actions (add, update, delete, toggle favorite, set status)
- **Acceptance:** Remove prop drilling, all screens use context

### Task 1.3: Create constants.js
- **Files to create:** `constants.js`
- **Description:** Centralize status values, navigation names to avoid magic strings
- **Acceptance:** Replace all hardcoded strings with constants

### Task 1.4: Replace Date.now() IDs with uuid
- **Files to modify:** `HomeScreen.js`, `BooksContext.js`
- **Add dependency:** `react-native-uuid`
- **Description:** Use uuid.v4() for book IDs instead of Date.now()
- **Acceptance:** No ID collisions possible

---

## Phase 2: UX Polish (Weeks 2-3)
**Goal:** Better user experience and accessibility

### Task 2.1: Add Undo Delete (Snackbar)
- **Files to modify:** `BooksContext.js`, `DetailsScreen.js`
- **Create:** `components/Snackbar.js`
- **Description:** Show snackbar after delete with undo option for 5-8 seconds
- **Acceptance:** Users can undo accidental deletions

### Task 2.2: Fix "Book not found" Handling
- **Files to modify:** `DetailsScreen.js`
- **Description:** Show helpful fallback UI with navigation back to Home
- **Acceptance:** Clear fallback shown when book not found

### Task 2.3: Add Accessibility Labels
- **Files to modify:** `HomeScreen.js`, `DetailsScreen.js`, `FavoritesScreen.js`, `AboutScreen.js`
- **Description:** Add accessibilityLabel and accessible props to interactive elements
- **Acceptance:** Screen reader can navigate app

### Task 2.4: Debounce Search Input
- **Files to modify:** `HomeScreen.js`
- **Description:** Debounce search input to improve performance
- **Acceptance:** Search only triggers after user stops typing

---

## Phase 3: Features (Weeks 3-5)
**Goal:** New functionality users have requested

### Task 3.1: Add Book Covers
- **Files to modify:** `HomeScreen.js`, `DetailsScreen.js`, `styles.js`
- **Add dependency:** Google Books API
- **Description:** Allow users to add cover images from gallery or fetch from API
- **Acceptance:** Books can display cover images

### Task 3.2: Add Sorting and Filtering
- **Files to modify:** `HomeScreen.js`, `styles.js`
- **Description:** Add sort options (A-Z, recent, status) and filter by reading status
- **Acceptance:** Users can sort and filter their book list

### Task 3.3: Export/Import Library
- **Files to modify:** `SettingsScreen.js`
- **Add dependency:** `expo-sharing`, `expo-file-system`
- **Description:** Allow users to export library as JSON and import from file
- **Acceptance:** Users can backup and restore their library

### Task 3.4: Swipe Actions on List Items
- **Files to modify:** `HomeScreen.js`
- **Add dependency:** `react-native-gesture-handler` (already installed)
- **Description:** Add swipe-to-delete and swipe-to-favorite actions
- **Acceptance:** Users can swipe on list items to perform actions

---

## Phase 4: Testing & CI (Weeks 5-6)
**Goal:** Reliability and maintainability

### Task 4.1: Add Jest Tests
- **Files to create:** `__tests__/storage.test.js`, `__tests__/constants.test.js`
- **Add dependency:** `jest`, `@testing-library/react-native`, `react-test-renderer`
- **Description:** Write unit tests for core logic
- **Acceptance:** Core functions have test coverage

### Task 4.2: Set Up GitHub Actions CI
- **Files to create:** `.github/workflows/ci.yml`
- **Description:** Run tests and lint on every PR
- **Acceptance:** CI checks appear on PRs

### Task 4.3: Add PropTypes
- **Files to modify:** `HomeScreen.js`, `DetailsScreen.js`, `FavoritesScreen.js`
- **Create:** `types.js`
- **Description:** Add type safety to components
- **Acceptance:** Code has PropTypes defined

---

## Phase 5: Enhancements & New Features (Current)
**Goal:** Enhance existing functionality and add new features

### Task 5.1: Improve Book Cover Matching
- **Files to modify:** `HomeScreen.js`, `DetailsScreen.js`, `BooksContext.js`
- **Add dependency:** `expo-image-picker`
- **Description:**
  - Add ISBN lookup support for more accurate results
  - Allow manual cover image upload from device gallery
  - Add edition/version selection when multiple covers found
  - Cache covers locally for offline use
- **Acceptance:** More precise book cover matching with manual override option
- **Note:** Current implementation needs improvement for precise matching by version/part

### Task 5.2: Reading Statistics & Progress
- **Files to create:** `StatsScreen.js`
- **Files to modify:** `App.js`, `BooksContext.js`, `constants.js`
- **Description:**
  - Add books read count (completed status)
  - Monthly/yearly reading stats
  - Visual progress dashboard
  - Average pages per book tracking
- **Acceptance:** Users can view their reading statistics and progress

### Task 5.3: Book Categories/Tags
- **Files to modify:** `BooksContext.js`, `HomeScreen.js`, `utils/storage.js`, `styles.js`
- **Description:**
  - Add custom tags to books
  - Filter books by multiple tags
  - Tag management (create, edit, delete)
  - Tag-based search
- **Acceptance:** Users can organize books with custom tags

### Task 5.4: Reading Goals
- **Files to modify:** `SettingsScreen.js`, `BooksContext.js`, `utils/storage.js`
- **Description:**
  - Set annual reading goal (number of books)
  - Track progress towards goal
  - Display goal progress on home screen
  - Yearly goal reset option
- **Acceptance:** Users can set and track reading goals

### Task 5.5: Performance & Polish
- **Files to modify:** Multiple files
- **Description:**
  - Optimize app startup time
  - Reduce bundle size with code splitting
  - Add error boundaries for graceful crash handling
  - Improve animations (useNativeDriver)
  - Optimize list rendering with FlatList optimizations
- **Acceptance:** Faster, smoother app experience

### Task 5.6: Search Enhancements
- **Files to modify:** `HomeScreen.js`, `BooksContext.js`
- **Description:**
  - Add ISBN/barcode scanning using camera
  - Advanced filtering options (favorites, date range, author)
  - Recent search history
  - Search within notes
- **Acceptance:** Enhanced search capabilities

---

## Implementation Notes

### Dependencies to Add (Phase 5)
- `expo-image-picker` - for manual cover upload
- `expo-camera` - for barcode scanning (optional)
- Additional testing libraries as needed

### Git Commit Strategy
- One logical commit per task
- Commit message format: `PhaseX: Task description`
- Push to GitHub after each phase completion

### Testing Strategy
- Run tests locally before committing
- Ensure app still works after each change

### Previous Cycles Completed
- Phase 1: Foundation (storage, context, constants, uuid) - COMMITTED
- Phase 2: UX Polish (snackbar, accessibility, debounce) - COMMITTED
- Phase 3: Features (covers, sorting, export/import, swipe) - COMMITTED
- Phase 4: Testing & CI (Jest tests, GitHub Actions, PropTypes) - COMMITTED