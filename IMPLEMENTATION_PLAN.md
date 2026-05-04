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
- **Add dependency:** `uuid`
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
- **Add dependency:** `expo-image-picker` or Google Books API
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
- **Files to create:** `__tests__/BooksContext.test.js`, `__tests__/storage.test.js`
- **Add dependency:** `jest`, `@testing-library/react-native`
- **Description:** Write unit tests for core logic
- **Acceptance:** Core functions have test coverage

### Task 4.2: Set Up GitHub Actions CI
- **Files to create:** `.github/workflows/ci.yml`
- **Description:** Run tests and lint on every PR
- **Acceptance:** CI checks appear on PRs

### Task 4.3: Add PropTypes or TypeScript
- **Files to modify:** Multiple files
- **Description:** Add type safety to components
- **Acceptance:** Code has type checking

---

## Implementation Notes

### Dependencies to Add
- `uuid` - for unique ID generation
- `jest` + `@testing-library/react-native` - for testing
- `expo-image-picker` - for cover images
- `expo-sharing` + `expo-file-system` - for export/import

### Git Commit Strategy
- One logical commit per task
- Commit message format: `PhaseX: Task description`
- Push to GitHub after each phase completion

### Testing Strategy
- Run tests locally before committing
- Ensure app still works after each change