# TrackMyRead - Complete Application Documentation

## Overview

**TrackMyRead** is a React Native (Expo) mobile application for tracking your book collection. Users can add books, mark them as favorites, track reading status (To Read, Reading, Read), search/filter/sort their collection, and view statistics.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Navigation Architecture](#navigation-architecture)
3. [Screens](#screens)
4. [Features](#features)
5. [State Management](#state-management)
6. [API Usage](#api-usage)
7. [Components](#components)
8. [Theme System](#theme-system)
9. [Storage](#storage)
10. [Constants & Types](#constants--types)
11. [Dependencies](#dependencies)

---

## Project Structure

```
TrackMyRead/
├── App.js                    # Main entry point & navigation setup
├── HomeScreen.js             # Book list with search, add, filter, sort
├── DetailsScreen.js          # Book detail view & editing
├── FavoritesScreen.js        # Favorited books list
├── SettingsScreen.js         # App settings (theme toggle)
├── StatsScreen.js            # Reading statistics
├── AboutScreen.js            # App information
├── BooksContext.js           # Global state management
├── ThemeContext.js           # Theme state provider
├── constants.js               # App constants & enums
├── types.js                  # PropTypes definitions
├── styles.js                 # Shared styles & color themes
├── index.js                  # App registration
├── babel.config.js           # Babel configuration
├── jest.config.js            # Jest testing configuration
├── utils/
│   └── storage.js            # AsyncStorage utilities
├── components/
│   ├── EmptyState.js         # Reusable empty state component
│   ├── LoadingState.js       # Loading spinner component
│   └── Snackbar.js           # Toast notification component
├── __tests__/
│   ├── constants.test.js
│   └── storage.test.js
└── package.json
```

---

## Navigation Architecture

### Hierarchy
```
Drawer Navigator
├── Main (Tab Navigator)
│   ├── Home Tab → HomeStack
│   │   ├── HomeList (HomeScreen)
│   │   └── Details (DetailsScreen)
│   └── Favorites Tab (FavoritesScreen)
├── Settings (SettingsScreen)
├── Stats (StatsScreen)
└── About (AboutScreen)
```

### Navigation Flow
1. **Drawer** - Primary navigation menu (accessible via hamburger menu or swipe from left)
2. **Tab Navigator** - Bottom tabs for main sections (Home, Favorites)
3. **Stack Navigator** - Within Home tab for navigation between list and details

### Route Names
| Screen | Route Name | Parent |
|--------|-----------|--------|
| Home List | `HomeList` | HomeStack |
| Details | `Details` | HomeStack |
| Favorites | `Favorites` | Tab |
| Settings | `Settings` | Drawer |
| Stats | `Stats` | Drawer |
| About | `About` | Drawer |
| Main | `Main` | Drawer |

---

## Screens

### 1. HomeScreen (`HomeList`)
**File:** `HomeScreen.js`

**Features:**
- Search bar with debounced search (300ms delay)
- Grid/List view toggle button
- Sort options: Title (A-Z, Z-A), Date (Newest, Oldest), Status
- Filter by reading status: All, To Read, Reading, Read
- Clear filter button (appears when filter/sort active)
- Book cards showing: cover image, title, author, status, favorite icon
- Swipe-to-delete with 5-second undo via Snackbar
- Floating Action Button (FAB) to add new book
- Empty states: No books, No search results

**Add Book Modal:**
- Title input (required)
- Author input (optional)
- Cover URL input with auto-fetch from Google Books API
- "Choose Cover" button for manual selection
- Cover picker showing multiple options from API

### 2. DetailsScreen
**File:** `DetailsScreen.js`

**Features:**
- Large cover image display
- Title and author display/edit
- Reading status selector (To Read, Reading, Read)
- Favorite toggle button (heart icon)
- Notes section (multiline text input)
- Delete book button with confirmation

### 3. FavoritesScreen
**File:** `FavoritesScreen.js`

**Features:**
- List of all favorited books
- Card view with cover, title, author, status
- Tap to navigate to Details
- Empty state when no favorites

### 4. SettingsScreen
**File:** `SettingsScreen.js`

**Features:**
- Theme toggle (Light/Dark mode)
- Persists preference to AsyncStorage

### 5. StatsScreen
**File:** `StatsScreen.js`

**Features:**
- Total books count
- Books by status (To Read, Reading, Read)
- Favorite books count
- Visual statistics display

### 6. AboutScreen
**File:** `AboutScreen.js`

**Features:**
- App name and version
- Brief description
- Developer info

---

## Features

### Core Features
| Feature | Description |
|---------|-------------|
| Add Book | Add new book with title, author, optional cover |
| Edit Book | Modify title, author, status, notes |
| Delete Book | Remove book with 5-second undo |
| Search | Search by title or author |
| Sort | Sort by title, date added, or status |
| Filter | Filter by reading status |
| Favorites | Mark/unmark books as favorites |
| Cover Fetch | Auto-fetch covers from Google Books API |
| Manual Cover | Pick cover from gallery or enter URL |
| Dark Mode | Toggle between light/dark themes |
| Statistics | View reading statistics |

### UI/UX Features
| Feature | Description |
|---------|-------------|
| Empty States | Reusable EmptyState component with icon, title, subtitle |
| Loading States | LoadingState component with spinner |
| Tab Badge | Favorites count badge on bottom tab |
| Grid/List View | Toggle between grid and list layouts |
| Swipe Actions | Swipe to delete books |
| Snackbar | Toast notification for delete undo |

---

## State Management

### BooksContext (`BooksContext.js`)
Centralized state for all book data using React Context API.

**State Variables:**
```javascript
books          // Array of book objects
loading        // Boolean for initial load state
trash           // Recently deleted book for undo
trashTimer      // Timer ID for undo timeout
```

**Provider Functions:**
| Function | Description |
|----------|-------------|
| `addBook(title, author, coverUrl)` | Add new book to collection |
| `updateBook(id, updates)` | Update book properties |
| `removeBook(id)` | Delete book (moves to trash) |
| `undoDelete()` | Restore deleted book from trash |
| `toggleFavorite(id)` | Toggle favorite status |
| `setStatus(id, status)` | Update reading status |
| `getBookById(id)` | Get single book by ID |
| `getFavorites()` | Get all favorite books |
| `searchBooks(query)` | Search books by title/author |
| `sortBooks(books, sortBy)` | Sort book array |
| `filterBooks(books, filterBy)` | Filter books by status |
| `fetchBookCover(title, author, isbn)` | Fetch cover from Google Books |
| `fetchMultipleCovers(title, author)` | Fetch multiple cover options |
| `updateBookCover(id, coverUrl)` | Update book's cover URL |

### ThemeContext (`ThemeContext.js`)
Theme state management.

**State Variables:**
```javascript
theme          // 'light' or 'dark'
setTheme       // Function to change theme
```

---

## API Usage

### Google Books API
**Endpoint:** `https://www.googleapis.com/books/v1/volumes`

**Used for:**
1. **Single Cover Fetch** (`fetchBookCover`)
   - Query: Book title + author or ISBN
   - Returns: Single cover URL or multiple options

2. **Multiple Covers** (`fetchMultipleCovers`)
   - Query: Book title + author
   - Returns: Up to 6 cover options for user selection

**Request Format:**
```
GET https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=10
```

**Query Construction:**
- ISBN search: `isbn:{isbn}`
- Title/Author search: `{title} {author}` (URL encoded)

**Response Processing:**
- Extract `volumeInfo.imageLinks.thumbnail`
- Convert `http://` to `https://`
- Return up to 5-6 cover options

---

## Components

### 1. EmptyState (`components/EmptyState.js`)
Reusable empty state display.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| icon | string | Ionicons icon name |
| title | string | Title text |
| subtitle | string | Subtitle/description text |
| actionLabel | string | Button label (optional) |
| onAction | function | Button press handler (optional) |
| theme | string | 'light' or 'dark' |

### 2. LoadingState (`components/LoadingState.js`)
Loading indicator component.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| message | string | Loading message (optional) |
| theme | string | 'light' or 'dark' |

### 3. Snackbar (`components/Snackbar.js`)
Toast notification with action button.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| visible | boolean | Show/hide snackbar |
| message | string | Message to display |
| actionLabel | string | Action button label |
| onAction | function | Action button handler |
| duration | number | Auto-hide timeout (ms) |

### 4. TabIconWithBadge (in App.js)
Custom tab bar icon with favorites count badge.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| routeName | string | Tab route name |
| focused | boolean | Tab active state |
| favoritesCount | number | Number of favorites |

---

## Theme System

### Color Palette (`styles.js`)

**Light Theme:**
| Color | Hex | Usage |
|-------|-----|-------|
| background | #ffffff | Screen backgrounds |
| text | #121212 | Primary text |
| card | #FFFFFF | Card backgrounds |
| placeholder | #FAFAFA | Input backgrounds |
| primary | #007aff | Buttons, links, accents |
| tint | #666666 | Secondary text |
| accent | #E91E63 | Highlights, badges |
| destructive | #E53935 | Delete buttons |
| neutral | #EEEEEE | Borders, dividers |
| buttonText | #ffffff | Text on buttons |

**Dark Theme:**
| Color | Hex | Usage |
|-------|-----|-------|
| background | #121212 | Screen backgrounds |
| text | #e6e6e6 | Primary text |
| card | #282828 | Card backgrounds |
| placeholder | #2a2a2a | Input backgrounds |
| primary | #0A84FF | Buttons, links, accents |
| tint | #9ca3af | Secondary text |
| accent | #E91E63 | Highlights, badges |
| destructive | #E53935 | Delete buttons |
| neutral | #2a2a2a | Borders, dividers |
| buttonText | #ffffff | Text on buttons |

### Theme Switching
- Controlled via Settings screen toggle
- Persisted to AsyncStorage
- Applied to all screens including navigation

---

## Storage

### AsyncStorage (`utils/storage.js`)

**Keys:**
| Key | Description |
|-----|-------------|
| `@books` | JSON stringified book array |
| `@theme` | Theme preference ('light' or 'dark') |
| `@schema_version` | Data schema version |

**Functions:**
```javascript
initializeStorage()     // Load books on app start
saveBooks(books)        // Persist books array
loadTheme()             // Load saved theme
saveTheme(theme)        // Persist theme preference
```

---

## Constants & Types

### Constants (`constants.js`)

**Book Status:**
```javascript
BOOK_STATUS.TO_READ   // 'To Read'
BOOK_STATUS.READING   // 'Reading'
BOOK_STATUS.READ     // 'Read'
```

**Sort Options:**
```javascript
SORT_OPTIONS.TITLE_ASC     // 'title_asc'
SORT_OPTIONS.TITLE_DESC    // 'title_desc'
SORT_OPTIONS.DATE_NEWEST  // 'date_newest'
SORT_OPTIONS.DATE_OLDEST  // 'date_oldest'
SORT_OPTIONS.STATUS       // 'status'
```

**Filter Options:**
```javascript
FILTER_OPTIONS.ALL       // 'all'
FILTER_OPTIONS.TO_READ   // 'To Read'
FILTER_OPTIONS.READING   // 'Reading'
FILTER_OPTIONS.READ      // 'Read'
```

**UI Config:**
```javascript
UI_CONFIG.DEBOUNCE_DELAY   // 300ms
UI_CONFIG.UNDO_TIMEOUT     // 5000ms
UI_CONFIG.FONT_SIZES       // { SMALL: 12, MEDIUM: 14, LARGE: 16, XLARGE: 20, XXLARGE: 22 }
```

### Types (`types.js`)

**PropTypes:**
- `bookShape` - Single book object validation
- `booksArrayShape` - Array of books validation
- `navigationShape` - Navigation prop validation
- `routeShape` - Route params validation

---

## Dependencies

### Core Dependencies
| Package | Purpose |
|---------|---------|
| react-native | Core framework |
| expo | Development platform |
| @react-navigation/native | Navigation core |
| @react-navigation/bottom-tabs | Bottom tab navigator |
| @react-navigation/native-stack | Stack navigator |
| @react-navigation/drawer | Drawer navigator |
| react-native-gesture-handler | Gesture handling |
| react-native-safe-area-context | Safe area handling |
| @react-native-async-storage/async-storage | Local storage |
| expo-image-picker | Image picker for covers |
| expo-status-bar | Status bar control |
| @expo/vector-icons | Ionicons icons |
| react-native-uuid | UUID generation |

### Development Dependencies
| Package | Purpose |
|---------|---------|
| jest | Testing framework |
| @testing-library/react-native | React Native testing |

---

## Implementation Phases

### Phase 1: Core Features
- Book CRUD operations
- Basic navigation
- Local storage persistence

### Phase 2: Search & Filter
- Search by title/author
- Filter by status
- Sort options

### Phase 3: UI/UX Improvements
- Swipe-to-delete
- Undo functionality
- Snackbar notifications

### Phase 4: Cover Images
- Google Books API integration
- Manual image picker
- Multiple cover options

### Phase 5: Settings & Stats
- Theme toggle
- Reading statistics
- About screen

### Phase 6: UI/UX Polish
- Empty/Loading states
- Tab badge
- Grid/List view
- Theme mode support

---

## Data Model

### Book Object
```javascript
{
  id: string,           // UUID
  title: string,        // Required
  author: string,       // Optional
  coverUrl: string,     // Optional URL
  favorite: boolean,    // Default: false
  status: string,       // 'To Read' | 'Reading' | 'Read'
  notes: string,        // Optional user notes
  createdAt: number,    // Unix timestamp
}
```

---

## Key Implementation Notes

1. **Debounced Search** - 300ms delay to prevent excessive filtering
2. **Undo Delete** - 5-second window to restore deleted books
3. **Auto-save** - Books auto-persist to AsyncStorage on every change
4. **Theme Persistence** - Theme preference saved and restored on app launch
5. **Schema Version** - Version tracking for future data migrations
6. **Accessibility** - All interactive elements have accessibilityLabel and accessibilityRole