# TrackMyRead Navigation & Functionality Audit Report

---

## Part 1 — Navigation Audit

### 1.1 Navigation Structure (Tree)

```
Drawer.Navigator (root navigator)
├── [Screen: Main] → Tab.Navigator
│   ├── [Tab: Home] → HomeStack (Stack.Navigator)
│   │   ├── [Screen: HomeList] → HomeScreen
│   │   └── [Screen: Details] → DetailsScreen
│   └── [Tab: Favorites] → FavoritesScreen
├── [Screen: Settings] → SettingsScreen
├── [Screen: Stats] → StatsScreen
├── [Screen: Collections] → Stack.Navigator
│   ├── [Screen: CollectionsList] → CollectionsScreen
│   ├── [Screen: CollectionDetail] → CollectionDetailScreen
│   └── [Screen: Details] → DetailsScreen
└── [Screen: About] → AboutScreen
```

---

### 1.2 Navigation Options Per Screen

| Screen | Title | Header | Custom Header | Tab Icon | Drawer |
|--------|-------|--------|---------------|---------|--------|
| HomeScreen | "My Books" | Shown | Hamburger menu (left) opens drawer | N/A (in Stack) | N/A |
| DetailsScreen | "Details" | Shown | None | N/A | N/A |
| FavoritesScreen | N/A (not set) | **Hidden** (in Tab, but tab shows header: true in App.js:173) | N/A | Heart (filled when selected) | Uses "Favorites" label in drawer |
| SettingsScreen | "Settings" | Shown | None | N/A | Uses "Settings" label |
| StatsScreen | "Statistics" | Shown | None | N/A | Uses "Stats" label |
| CollectionsScreen | N/A | Not explicitly set | None | N/A | Uses "Collections" label |
| CollectionDetailScreen | "Collection" / dynamic from params | Shown | Title set via setOptions | N/A | N/A |
| AboutScreen | "About" | Shown | None | N/A | Uses "About" label |

---

### 1.3 Navigation Actions Used

#### HomeScreen.js
- `navigation.navigate('Details', { bookId })` — navigates to DetailsScreen

#### DetailsScreen.js
- `navigation.goBack()` — returns to previous screen

#### FavoritesScreen.js
- `navigation.navigate('Home', { screen: 'Details', params: { bookId } })` — ⚠️ ROUTING BUG: navigates to Home tab, then to Details screen within HomeStack. This works but is an indirect route.

#### CollectionsScreen.js
- `navigation.navigate('CollectionDetail', { collectionId, collectionName })` — navigates to CollectionDetailScreen

#### CollectionDetailScreen.js
- `navigation.navigate('HomeStack', { screen: 'Details', params: { bookId } })` — ⚠️ ROUTING BUG: uses 'HomeStack' as route name, but HomeStack is not a named route in the navigator tree. Should be 'Home' or 'Details'.

#### App.js (HomeStack)
- `parentNav?.getParent()?.openDrawer()` — opens drawer from hamburger icon

---

### 1.4 Parameter Passing

| Sender Screen | Receiver Screen | Parameters |
|--------------|-----------------|------------|
| HomeScreen | DetailsScreen | `{ bookId: string }` |
| FavoritesScreen | DetailsScreen (via Home tab) | `{ bookId: string }` |
| CollectionsScreen | CollectionDetailScreen | `{ collectionId: string, collectionName: string }` |
| CollectionDetailScreen | DetailsScreen | `{ bookId: string }` |
| App.js | HomeStack | **⚠️ UNUSED**: `parentNav` passed but never accessed in HomeScreen |

---

## Part 2 — Functionality Audit

### 2.1 Per-Screen Functionality

#### HomeScreen
- **Interactions**: Tap book card → go to Details; swipe left/right on card for delete/favorite; tap sort/filter chip; tap view toggle (list/grid); tap collection chip; tap FAB → add book
- **Inputs**: Search text field (debounced); title/author in Add Book modal; cover URL
- **Visible Data**: Book list (filtered, sorted), filter chips, sort chips, collection chips, empty state
- **Actions that modify state**: addBook, removeBook, toggleFavorite, setFilter, setSort, setCollectionFilter
- **Actions that trigger navigation**: navigation.navigate to Details
- **API calls**: fetchBookCover (Google Books API)

#### DetailsScreen
- **Interactions**: Tap book card for details; tap edit/save/delete buttons; tap status buttons; tap star rating; tap share; tap favorite heart; tap cover actions; tap collections; tap "Go Back" if book not found
- **Inputs**: Title, author, notes (editable fields); current page, total pages; cover picker; collection picker
- **Visible Data**: Cover image, title, author, notes, status, rating, reading progress, collections
- **Actions that modify state**: updateBook, removeBook, toggleFavorite, setStatus, setRating, setProgress, updateBookCover, addBookToCollection, removeBookFromCollection, undoDelete
- **Actions that trigger navigation**: navigation.goBack()
- **API calls**: fetchBookCover (Google Books API)

#### FavoritesScreen
- **Interactions**: Tap book card → go to Details; tap heart to unfavorite
- **Visible Data**: List of favorite books
- **Actions that modify state**: toggleFavorite
- **Actions that trigger navigation**: navigation.navigate (to Home → Details)

#### SettingsScreen
- **Interactions**: Toggle dark mode switch; tap Export (JSON); tap Export (CSV); tap Import (JSON)
- **Visible Data**: Dark mode toggle; export options; import option
- **Actions that modify state**: setTheme, setBooks (via import)
- **No direct navigation actions**

#### StatsScreen
- **Interactions**: Tap "Set a reading goal" / "Edit Goal"; tap "Edit Goal" button; tap "Remove Goal"; scroll through stats
- **Visible Data**: Reading goal (circular progress), yearly goal stat, monthly progress, top rated books, currently reading books, recent completed books, total books, books read, currently reading, favorites, avg rating, pages read
- **Actions that modify state**: saveReadingGoal
- **No direct navigation actions**

#### AboutScreen
- **Interactions**: Tap "Send an Email"; tap "View the code on GitHub"; tap "Privacy Policy"; tap "Close" in privacy modal
- **Visible Data**: App logo, app name, version, description, credits, contact options, privacy info
- **Actions that modify state**: None
- **External links**: mailto:, https://github.com/

#### CollectionsScreen
- **Interactions**: Tap collection → go to CollectionDetail; tap delete icon; tap FAB to create collection; tap "Create" button in modal; tap "Cancel" button
- **Inputs**: Collection name (text input)
- **Visible Data**: List of collections with book counts, empty state, create modal
- **Actions that modify state**: addCollection, deleteCollection
- **Actions that trigger navigation**: navigation.navigate to CollectionDetail

#### CollectionDetailScreen
- **Interactions**: Tap book card → go to Details; tap heart to favorite
- **Visible Data**: Books in the collection
- **Actions that modify state**: toggleFavorite
- **Actions that trigger navigation**: navigation.navigate (with ⚠️ routing bug - see 1.3)

---

### 2.2 BooksContext — Available Functions

| Function | Parameters | What it does | Called By |
|----------|-------------|-------------|-----------|
| addBook | title, author?, coverUrl? | Adds new book to library | HomeScreen |
| updateBook | id, updates | Updates book fields | DetailsScreen |
| removeBook | id | Soft-deletes book (moves to trash, auto-clears after 5s) | HomeScreen, DetailsScreen |
| undoDelete | — | Restores last deleted book | DetailsScreen |
| toggleFavorite | id | Toggles book's favorite flag | HomeScreen, DetailsScreen, FavoritesScreen, CollectionDetailScreen |
| setStatus | id, status | Sets book reading status | DetailsScreen |
| setRating | id, rating | Sets star rating (1-5 or null) | DetailsScreen |
| setProgress | id, currentPage, totalPages | Sets reading progress | DetailsScreen |
| fetchBookCover | title, author, isbn? | Fetches cover from Google Books API | HomeScreen, DetailsScreen |
| fetchMultipleCovers | title, author | Fetches multiple cover options | ⚠️ **NOT CALLED** |
| updateBookCover | id, coverUrl | Updates book's cover URL | DetailsScreen |
| getBookById | id | Returns book object or null | DetailsScreen |
| getFavorites | — | Returns array of favorite books | App.js, FavoritesScreen |
| searchBooks | query | Returns books matching title/author | HomeScreen |
| sortBooks | bookList, sortBy | Returns sorted book array | HomeScreen |
| filterBooks | bookList, filterBy | Returns filtered book array | HomeScreen |
| calculateProgress | currentPage, totalPages | Returns progress percentage | HomeScreen, DetailsScreen, StatsScreen |
| collections | — | Array of collection objects | CollectionsScreen, DetailsScreen, CollectionDetailScreen |
| addCollection | name | Creates new collection | CollectionsScreen |
| deleteCollection | id | Deletes collection & removes from all books | CollectionsScreen |
| renameCollection | id, name | Renames collection | ⚠️ **NOT CALLED** |
| addBookToCollection | bookId, collectionId | Adds book to collection | DetailsScreen |
| removeBookFromCollection | bookId, collectionId | Removes book from collection | DetailsScreen |
| getBooksInCollection | collectionId | Returns books in collection | CollectionDetailScreen |
| getBookCollections | bookId | Returns collections for a book | DetailsScreen |

---

### 2.3 Features That Feel Incomplete or Disconnected

| Issue | Location | Details |
|-------|----------|---------|
| ⚠️ Unused function | BooksContext | `fetchMultipleCovers` is defined but never called by any screen |
| ⚠️ Unused function | BooksContext | `renameCollection` is defined but never called by any screen |
| ⚠️ Routing bug | CollectionDetailScreen:33 | Uses `navigation.navigate('HomeStack', ...)` but HomeStack is not a named route |
| ⚠️ Inefficient routing | FavoritesScreen:23 | Routes through Home tab to get to DetailsScreen |
| ⚠️ Unused prop | HomeScreen | Receives `parentNav` prop but never uses it (hamburger is handled in App.js) |
| ⚠️ Inconsistent header | CollectionsScreen | Doesn't set header title explicitly; relies on NavigationContainer default |
| ⚠️ Import disabled | SettingsScreen:60 | doImport() shows alert "JSON import is temporarily unavailable" |
| ⚠️ Hardcoded colors | Multiple files | Uses `#007AFF`, `#FFD700`, `#fff` hardcoded instead of theme colors |

---

## Part 3 — Quick Facts

| Question | Answer |
|---|---|
| Total number of screens | 8 |
| Total number of navigators | 4 (Drawer, Tab, HomeStack, CollectionsStack) |
| Does the app have a dedicated onboarding / welcome flow? | No |
| Is there any authentication or user profile system? | No |
| How many bottom tabs are there and what are they? | 2: "Home", "Favorites" |
| What is accessible from the Drawer that is NOT in the bottom tabs? | Settings, Stats, Collections, About |
| Is there any deep linking configured? | No |
| Are there any modals? If yes, list them and which screen triggers them | Yes: Add Book modal (HomeScreen), Cover picker modal (HomeScreen, DetailsScreen), Collection picker modal (DetailsScreen), Goal modal (StatsScreen), Create collection modal (CollectionsScreen), Privacy modal (AboutScreen) |
| What is the initial/home route when the app first opens? | "Main" (Drawer) → "Home" (Tab) → "HomeList" (Stack) |

---

*Report generated from codebase audit of TrackMyRead app.*