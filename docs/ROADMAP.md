# TrackMyRead — Development Roadmap (Phase 7 Onwards)

> Phases 1–6 are complete. This document picks up from Phase 7.
> Execute one phase at a time. Mark each phase complete before moving to the next.

---

## Phase 7 — Book Ratings

**Goal:** Let users rate books on a 1–5 star scale, and surface that data meaningfully.

### Data Model Change
Add one field to the Book object:
```
rating: number | null   // 1–5, default: null (unrated)
```

### BooksContext Changes (`BooksContext.js`)
- Add `setRating(id, rating)` function — wraps `updateBook`
- Update `sortBooks()` to support a new `SORT_OPTIONS.RATING_HIGH` and `SORT_OPTIONS.RATING_LOW` case

### Constants Changes (`constants.js`)
- Add to `SORT_OPTIONS`:
  - `RATING_HIGH: 'rating_high'`
  - `RATING_LOW: 'rating_low'`

### UI Changes
- **DetailsScreen:** Add a 5-star tappable rating row below the status selector
- **HomeScreen (cards):** Show filled/empty star icons (small, subtle) on each book card
- **HomeScreen (sort):** Add "Rating (High → Low)" and "Rating (Low → High)" to sort options
- **StatsScreen:** Add "Average Rating" stat and "Top Rated Books" (top 3) section

### Storage
- No new keys needed — ratings persist as part of the existing `@books` array

### Accessibility
- Each star button: `accessibilityLabel="Rate {n} stars"` and `accessibilityRole="button"`
- Rating row: `accessibilityLabel="Current rating: {n} out of 5 stars"`

---

## Phase 8 — Reading Progress Tracking

**Goal:** Allow users actively reading a book to track their page-level progress.

### Data Model Change
Add two fields to the Book object:
```
currentPage: number | null   // default: null
totalPages:  number | null   // default: null
```

### BooksContext Changes (`BooksContext.js`)
- Add `setProgress(id, currentPage, totalPages)` function — wraps `updateBook`
- Derive `progressPercent` as a computed helper (not stored): `Math.round((currentPage / totalPages) * 100)`

### UI Changes
- **DetailsScreen:** 
  - Show a "Progress" section only when `status === BOOK_STATUS.READING`
  - Two numeric inputs: "Current Page" and "Total Pages"
  - A visual progress bar below the inputs showing percentage
  - Auto-hides section when status changes away from "Reading"
- **HomeScreen (cards):**
  - Show a thin progress bar at the bottom of cards for books with `status === Reading` and valid progress data
- **StatsScreen:**
  - Add "Pages Read" total (sum of `currentPage` across all Reading/Read books)
  - Add "Currently Reading" section showing progress bars for in-progress books

### Storage
- No new keys needed — progress persists as part of the existing `@books` array

### Notes
- Never block adding a book if `totalPages` is missing — progress tracking is always optional
- If `currentPage > totalPages`, clamp at 100% visually but allow the input (user may have miscounted pages)

---

## Phase 9 — BooksContext Unit Tests

**Goal:** Establish a safety net for all core business logic before adding more complex features.

### Why Now
Phases 10+ (Goals, Collections) will modify the context significantly. Tests here prevent regressions.

### Test File
Create: `__tests__/BooksContext.test.js`

### Functions to Test
| Function | Test Cases |
|---|---|
| `addBook` | Adds book with correct defaults; requires title; generates unique ID |
| `updateBook` | Updates only specified fields; does not mutate other fields |
| `removeBook` | Moves book to trash; removes from books array |
| `undoDelete` | Restores book from trash; clears trash |
| `toggleFavorite` | Flips favorite boolean correctly |
| `setStatus` | Updates status to valid values |
| `setRating` | Sets rating 1–5; rejects out-of-range values |
| `setProgress` | Updates currentPage/totalPages; clamps percent display at 100 |
| `searchBooks` | Matches on title; matches on author; case-insensitive; empty query returns all |
| `sortBooks` | Correctly sorts by each SORT_OPTIONS value including new rating sorts |
| `filterBooks` | Filters correctly for each FILTER_OPTIONS value; 'all' returns full list |

### Utilities to Test
Extend existing `__tests__/storage.test.js`:
- `saveBooks` → `loadBooks` round-trip preserves all fields including `rating`, `currentPage`, `totalPages`
- Schema version check does not drop new fields

---

## Phase 10 — Reading Goals & Enhanced Stats

**Goal:** Make the StatsScreen motivating with a yearly reading goal and progress tracking.

### New Storage Key (`utils/storage.js`)
```
@reading_goal   // number — user's target books for the current year
```
Add functions: `saveReadingGoal(goal)`, `loadReadingGoal()`

### UI Changes
- **StatsScreen:**
  - "Reading Goal" card at the top
    - Circular progress ring showing books read this year vs. goal
    - "X of Y books" label inside the ring
    - "Set Goal" / "Edit Goal" button
    - If no goal set, show a prompt card: "Set a reading goal for the year"
  - "Books Read This Year" — filtered by `createdAt` (or a future `completedAt` field)
  - Existing stats (total, by status, favorites) move below the goal section
  - "Average Rating" and "Pages Read" from Phase 7–8 displayed here

### BooksContext or StatsScreen Logic
- `getBooksReadThisYear()` — filter `status === Read` and `createdAt` within current calendar year
- No new context state needed — derived on render

### Notes
- Goal is per-year, per-device — no sync needed
- Do not roll over goals automatically; prompt user at year start

---

## Phase 11 — Collections / Shelves

**Goal:** Let users create custom named groupings for books (e.g., "Sci-Fi", "Book Club", "Gifts").

> ⚠️ This is the most architecturally significant phase. Do not start until Phase 9 tests pass.

### Data Model Change
Add one field to the Book object:
```
collections: string[]   // Array of collection IDs, default: []
```

Add a new top-level data structure (stored separately):
```javascript
Collection: {
  id: string,       // UUID
  name: string,     // e.g. "Sci-Fi"
  createdAt: number
}
```

### New Storage Key (`utils/storage.js`)
```
@collections   // JSON stringified Collection array
```
Add functions: `saveCollections(collections)`, `loadCollections()`

### BooksContext Changes (`BooksContext.js`)
New state: `collections`
New functions:
- `addCollection(name)` — creates new Collection
- `deleteCollection(id)` — removes collection; strips ID from all books
- `renameCollection(id, name)`
- `addBookToCollection(bookId, collectionId)`
- `removeBookFromCollection(bookId, collectionId)`
- `getBooksInCollection(collectionId)` — derived filter

### Navigation Change
Add a new Drawer item: **Collections** → `CollectionsScreen`

### New Screens
- **CollectionsScreen** — lists all collections with book count; tap to view; FAB to create new
- **CollectionDetailScreen** (stack inside CollectionsScreen) — shows books in that collection with same card UI as HomeScreen

### UI Changes
- **DetailsScreen:** Add a "Collections" row — tappable chips showing current collections, plus an "Add to Collection" button opening a modal picker
- **HomeScreen (filter):** Add optional "Collection" filter row (horizontal scroll of collection chips)

### Constants Changes (`constants.js`)
No new BOOK_STATUS/SORT changes needed. Add:
```
MAX_COLLECTION_NAME_LENGTH: 30
```

---

## Phase 12 — Export & Share

**Goal:** Let users share their library or individual book cards outside the app.

### Features
- **Export Library as CSV** — all books with all fields, downloadable file
- **Share Book Card** — generate a styled summary card image for a single book and share via native share sheet

### Dependencies Required
| Package | Purpose | Expo-compatible? |
|---|---|---|
| `expo-sharing` | Native share sheet | ✅ Yes |
| `expo-file-system` | Write CSV to temp file | ✅ Yes |
| `react-native-view-shot` | Capture book card as image | ✅ Yes (requires config plugin) |

> Flag: `react-native-view-shot` needs an `app.json` plugin entry. No ejecting required with Expo SDK 50+.

### UI Changes
- **SettingsScreen:** Add "Export Library (CSV)" option — generates and shares file
- **DetailsScreen:** Add share icon button in the header — shares book card image
- **Book Card Image:** Designed component (`components/ShareCard.js`) — cover, title, author, rating, status. Not rendered in the normal UI, only captured for sharing.

### utils/export.js (new file)
- `generateCSV(books)` — serializes book array to CSV string
- `writeAndShareCSV(books)` — writes to `FileSystem.cacheDirectory`, triggers share sheet

---

## Summary Table

| Phase | Feature | Effort | Key Files Touched |
|---|---|---|---|
| 7 | Book Ratings | Low | `constants.js`, `BooksContext.js`, `DetailsScreen.js`, `HomeScreen.js`, `StatsScreen.js` |
| 8 | Reading Progress | Low–Med | `BooksContext.js`, `DetailsScreen.js`, `HomeScreen.js`, `StatsScreen.js` |
| 9 | BooksContext Tests | Med | `__tests__/BooksContext.test.js`, `__tests__/storage.test.js` |
| 10 | Reading Goals & Stats | Med | `utils/storage.js`, `StatsScreen.js`, `BooksContext.js` |
| 11 | Collections / Shelves | High | `BooksContext.js`, `utils/storage.js`, `App.js`, new screens, `DetailsScreen.js` |
| 12 | Export & Share | Med | `utils/export.js`, `SettingsScreen.js`, `DetailsScreen.js`, new `ShareCard.js` component |

---

> **Working agreement:** Complete and test each phase fully before beginning the next.
> Phases 7 and 8 share a data model migration — coordinate their `Book` object changes together even if implemented separately.
