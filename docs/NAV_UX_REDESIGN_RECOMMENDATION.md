# TrackMyRead — Navigation & UX Redesign Recommendation

> Based on: Codebase audit + user profile analysis
> Target user: Mid-casual to heavy reader who captures books from social media,
>              tracks progress daily, and wants future social sharing.
> Design direction: Between Apple Liquid Glass and Material You — "Fluid Material"

---

## The Core Problem With The Current Structure

The current architecture has three fundamental UX conflicts:

**1. The drawer buries the most important things.**
Stats and Collections are hidden behind a hamburger menu. A user whose primary
daily action is updating reading progress has to: tap hamburger → tap Stats. That
is two taps to see something they check every day.

**2. The bottom tabs don't reflect the user's mental model.**
"Home" and "Favorites" are not how a reader thinks about their books. A reader
thinks in three modes: What am I reading now? What do I want to read next? What
have I already read? The current tab structure maps to none of these.

**3. DetailsScreen is a routing liability.**
Three different navigators try to reach DetailsScreen with three different
navigation paths, two of which are already broken. The screen needs to live at
the root level, shared across all tabs.

---

## Recommended Navigation Architecture

### New Structure

```
Root Stack Navigator
├── OnboardingScreen          ← NEW (shown only on first launch)
│
└── Main App
    └── Tab Navigator (4 tabs)
        │
        ├── [Tab 1] Library → LibraryStack
        │   ├── LibraryScreen          ← renamed + expanded from HomeScreen
        │   └── CollectionDetailScreen ← moved here from CollectionsStack
        │
        ├── [Tab 2] Reading → ReadingStack
        │   └── ReadingNowScreen       ← NEW screen (replaces nothing, fills a gap)
        │
        ├── [Tab 3] Discover → DiscoverStack
        │   └── DiscoverScreen         ← NEW screen (replaces nothing, fills a gap)
        │
        └── [Tab 4] Profile → ProfileStack
            ├── ProfileScreen          ← NEW screen (replaces About + wraps Settings)
            ├── CollectionsScreen      ← moved from Drawer
            ├── StatsScreen            ← moved from Drawer
            └── SettingsScreen         ← moved from Drawer
│
├── DetailsScreen              ← PROMOTED to Root Stack (shared across all tabs)
└── OnboardingScreen           ← Root level, conditionally shown
```

### Why This Works

- **DetailsScreen at root** eliminates all three routing bugs in one move.
  Any tab can call `navigation.navigate('Details', { bookId })` with no indirection.

- **Drawer is removed entirely.** Everything the drawer contained is now reachable
  in two taps maximum from any screen.

- **4 tabs instead of 2** maps to exactly how this user thinks:
  - Library → my full collection
  - Reading → what I am doing right now (primary daily action)
  - Discover → my backlog of "want to read" books from social media
  - Profile → everything about me as a reader

---

## Tab-by-Tab Breakdown

### Tab 1 — Library
**Screen: LibraryScreen** (evolved from HomeScreen)

What stays:
- Full book list with search, sort, filter
- Grid / list view toggle
- Swipe to delete with undo
- FAB to add book

What changes:
- Filter chips now include Collections as a horizontal scroll row
  (removing the need to navigate into CollectionsScreen just to see a filtered list)
- "All Books" is the default view
- CollectionDetailScreen is accessible from within LibraryScreen by tapping a collection
  chip, not by navigating to a separate Drawer-level screen

What gets removed:
- The hamburger icon (drawer is gone)
- The "Favorites" filter chip (Favorites now has no dedicated tab — explained below)

**Note on Favorites tab removal:**
The current Favorites tab only shows a filtered list and adds no new capability beyond
what the Library's existing filter does. Folding it into Library's filter chips gives
the same access without wasting a tab slot. The heart icon and toggling remain on every
card and on DetailsScreen.

---

### Tab 2 — Reading Now
**Screen: ReadingNowScreen** (new screen)

This is the primary daily action screen. It should open fast, feel focused, and let
the user update progress in the fewest taps possible.

What it shows:
- All books with status = "Reading", sorted by last-updated progress
- Each card shows: cover, title, progress bar, current/total pages, last updated date
- A prominent "Update Progress" button on each card (opens a quick bottom sheet —
  no need to go to DetailsScreen just to change a page number)
- A "Reading Streak" indicator at the top (days in a row with a progress update)
- If no books are currently reading: a CTA to move a book from Discover to Reading

What it does NOT do:
- Does not show To Read or Read books
- Does not have search or sort (focused screen, not a browser)

**New function needed in BooksContext:**
`getLastUpdated(bookId)` — returns timestamp of last progress update.
This requires adding `updatedAt: number` to the Book data model.

---

### Tab 3 — Discover
**Screen: DiscoverScreen** (new screen)

This maps directly to the user's stated behaviour: capturing books from social media
to read later. "To Read" is a backlog, not a library view — it deserves its own space.

What it shows:
- All books with status = "To Read"
- Sort options: Date Added (default, newest first), Title, Author
- A "Quick Add" FAB — stripped-down add modal optimised for speed
  (title only required, author and cover optional, status auto-set to "To Read")
- Each card shows: cover, title, author, date added
- Swipe right on a card → "Start Reading" (moves status to Reading, goes to ReadingNow)
- Swipe left on a card → Delete (same undo behaviour as Library)

What it does NOT do:
- No progress bars (these books haven't been started)
- No rating display (unread books have no rating yet)

---

### Tab 4 — Profile
**Screen: ProfileScreen** (new screen, replaces About)

This is the personal hub. It wraps Stats, Collections, Settings, and About into one
coherent "me as a reader" section.

What it shows (sections in order):
1. **Reader Identity block** — app name styled as a personal header, books read count
   this year, current reading streak
2. **Reading Goal** — the circular progress ring from StatsScreen, tappable to edit
3. **My Stats** → navigates to StatsScreen (full stats)
4. **My Collections** → navigates to CollectionsScreen
5. **App Settings** → navigates to SettingsScreen
6. **About & Export** → navigates to AboutScreen (or inline section)

---

## New Screens Summary

| Screen | Status | Replaces / Source |
|---|---|---|
| OnboardingScreen | New | Nothing (first launch only) |
| LibraryScreen | Evolved | HomeScreen |
| ReadingNowScreen | New | Gap in current app |
| DiscoverScreen | New | Gap in current app |
| ProfileScreen | New | Consolidates About + drawer entry |
| DetailsScreen | Unchanged | Promoted to root stack |
| StatsScreen | Unchanged | Moved from Drawer to Profile stack |
| CollectionsScreen | Unchanged | Moved from Drawer to Profile stack |
| CollectionDetailScreen | Unchanged | Moved from CollectionsStack to Library stack |
| SettingsScreen | Unchanged | Moved from Drawer to Profile stack |

---

## Bugs to Fix During Navigation Migration

Fix these as part of the navigation restructure — they are caused by the old architecture:

| Bug | Fix |
|---|---|
| `CollectionDetailScreen` uses `HomeStack` as route name | After migration: `navigation.navigate('Details', { bookId })` from root |
| `FavoritesScreen` routes through Home tab to reach Details | After migration: `navigation.navigate('Details', { bookId })` from root |
| `renameCollection` defined but never called | Wire to CollectionsScreen (long press on collection → rename option) |
| `fetchMultipleCovers` defined but never called | Wire to DetailsScreen cover picker (show multiple options, not just one) |
| JSON import disabled in SettingsScreen | Fix or remove the broken option — disabled features erode trust |
| Hardcoded colors in multiple files | Replace with theme tokens during UI redesign phase |

---

## Data Model Updates Required

Two additions to the Book object to support the new screens:

```javascript
{
  // ... existing fields ...
  updatedAt: number,    // Unix timestamp — updated on any field change
                        // Used by ReadingNow to sort by "last activity"
                        // Used by Stats for reading streak calculation
}
```

One addition to BooksContext:

```javascript
getRecentlyUpdated(limit?)   // Returns books sorted by updatedAt descending
                             // Used by ReadingNowScreen
```

---

## Onboarding Flow (Phase 13 — New)

Since the app has no onboarding and the user base may be new to book tracking apps,
a minimal 3-screen onboarding should be added.

### Screens
1. **Welcome** — App name, tagline, "Get Started" CTA
2. **Set Your Goal** — "How many books do you want to read this year?" with a number
   picker. Skippable.
3. **Add Your First Book** — Shortcut directly into the Quick Add modal. Skippable.

### Behaviour
- Shown only on first launch (controlled by a `@onboarding_complete` AsyncStorage key)
- After completion or skip, never shown again
- After Step 3 (or skip), lands on LibraryScreen

---

## Design Direction — Fluid Material

You described wanting something between Apple Liquid Glass and Material You.
Here is what that means concretely for TrackMyRead:

### What to take from Liquid Glass (Apple)
- Frosted, translucent tab bar (blurred background, not opaque)
- Cards with soft blur backgrounds, not hard white/dark boxes
- Spring-physics animations on tab switches and modal presentations
- Large, generous typography — the book title is the hero, not the UI chrome
- Thin, refined icon strokes (SF Symbols weight, not chunky Material icons)

### What to take from Material You
- Dynamic color — derive the accent color from the currently-reading book's cover
- Elevation through subtle shadows, not borders
- Filled/tonal button styles (not iOS-style text buttons)
- FAB (Floating Action Button) — already present, keep it
- Bottom sheets instead of modal screens for quick actions (progress update,
  quick add, cover picker)

### What to avoid from both
- Liquid Glass: avoid the extreme translucency that makes text hard to read on
  varied backgrounds (book covers are unpredictable)
- Material You: avoid the heavy color surface tinting that clashes with book cover art
  (book covers already bring their own color — let them breathe)

### Specific Recommendations
- **Tab bar:** Frosted glass, floating above content with rounded pill shape (not
  edge-to-edge bar). Think iOS 18 tab bar, not standard React Navigation bottom tabs.
- **Cards:** Soft shadow, 16px border radius, cover image bleeds to left edge.
  Thin progress bar at card bottom for Reading books.
- **Typography:** Display font for book titles (something with character — not Inter).
  Clean sans-serif for metadata. Size hierarchy: title 18px, author 13px, metadata 11px.
- **Color tokens to add:** `glass`, `glassBorder`, `dynamicAccent` (derived from cover)
- **Animations:** Spring transitions on tab switch. Cards animate in with a stagger on
  first load. Progress bar animates to value on mount.

---

## Implementation Phases (Continuing from Phase 12)

### Phase 13 — Navigation Architecture Migration
**Do this before any UI work. Everything else depends on this being stable.**

Tasks:
- Remove Drawer navigator entirely
- Implement 4-tab bottom navigator
- Promote DetailsScreen to root stack
- Create stub screens for ReadingNowScreen, DiscoverScreen, ProfileScreen
- Fix the three routing bugs
- Add `updatedAt` to data model and `getRecentlyUpdated` to context
- Add `@onboarding_complete` storage key to storage.js
- Update all navigation.navigate() calls across all screens
- Run full test suite — all existing tests must still pass

**Do not redesign any UI in this phase. Stubs are fine.**

---

### Phase 14 — Onboarding Flow
Tasks:
- Build 3-screen onboarding (Welcome, Goal, First Book)
- Wire `@onboarding_complete` flag
- Connect Goal screen to existing `saveReadingGoal` function
- Connect First Book screen to existing `addBook` function

---

### Phase 15 — ReadingNowScreen
Tasks:
- Build ReadingNowScreen with progress cards
- Build "Update Progress" bottom sheet (quick progress update without going to Details)
- Build reading streak logic in BooksContext using `updatedAt`
- Display streak on ReadingNow and Profile

---

### Phase 16 — DiscoverScreen
Tasks:
- Build DiscoverScreen with To Read book list
- Build Quick Add FAB (stripped-down modal, auto-status = To Read)
- Wire swipe-right "Start Reading" gesture
- Wire `renameCollection` to CollectionsScreen (long press)

---

### Phase 17 — ProfileScreen
Tasks:
- Build ProfileScreen consolidating Stats entry, Collections entry, Settings, About
- Wire reading goal ring to ProfileScreen directly (not just in StatsScreen)
- Fix JSON import in SettingsScreen or remove it

---

### Phase 18 — UI Redesign (Fluid Material)
**This is where design screenshots from Stitch become the reference.**
- Redesign tab bar to floating frosted pill
- Redesign cards with new elevation and typography system
- Add new color tokens (glass, glassBorder, dynamicAccent)
- Add spring animations
- Replace all hardcoded hex values with theme tokens
- Wire `fetchMultipleCovers` to DetailsScreen cover picker

---

## Updated Phase Summary (All Phases)

| Phase | Feature | Status |
|---|---|---|
| 1–6 | Core app (CRUD, navigation, storage, API, themes, UI polish) | ✅ Done |
| 7 | Book Ratings | ✅ Done |
| 8 | Reading Progress | ✅ Done |
| 9 | BooksContext Unit Tests | ✅ Done |
| 10 | Reading Goals & Enhanced Stats | ✅ Done |
| 11 | Collections / Shelves | ✅ Done |
| 12 | Export & Share | ✅ Done |
| — | Directory Restructure | ✅ Done |
| 13 | Navigation Architecture Migration | 🔲 Next |
| 14 | Onboarding Flow | 🔲 |
| 15 | ReadingNow Screen | 🔲 |
| 16 | Discover Screen | 🔲 |
| 17 | Profile Screen | 🔲 |
| 18 | UI Redesign — Fluid Material | 🔲 |
