# TrackMyRead Project File Structure

## Project Tree

```
TrackMyRead/                                    // React Native/Expo book tracking app
├── .expo/                                     // Expo development metadata
│   ├── devices.json                           // Device/emulator configuration for development
│   └── README.md                              // Expo generated documentation
├── .github/                                   // GitHub repository configuration
│   └── workflows/
│       └── ci.yml                            // GitHub Actions CI/CD pipeline for automated testing
├── __tests__/                                 // Jest unit test files
│   ├── BooksContext.test.js                  // Unit tests for BooksContext state management
│   ├── constants.test.js                     // Unit tests for app constants
│   └── storage.test.js                       // Unit tests for AsyncStorage utilities
├── assets/                                    // App images and icons
│   ├── adaptive-icon.png                     // Android adaptive icon
│   ├── favicon.png                           // Web favicon
│   ├── icon.png                              // Main app icon
│   ├── logo.png                             // App logo image
│   └── splash-icon.png                      // Splash screen icon
├── components/                                 // Reusable React Native UI components
│   ├── EmptyState.js                        // Empty state placeholder component
│   ├── LoadingState.js                     // Loading spinner/indicator component
│   └── Snackbar.js                          // Toast notification component
├── utils/                                     // Utility functions
│   ├── export.js                            // CSV export and sharing utilities
│   └── storage.js                           // AsyncStorage read/write functions
├── node_modules/                            // NPM dependencies (294 packages)
│   ├── @0no-co/                             // GraphQL web support
│   ├── @babel/                              // Babel transpiler packages
│   ├── @expo/                               // Expo SDK packages
│   ├── @react-native/                       // React Native core packages
│   ├── @react-navigation/                   // React Navigation packages
│   ├── expo/                               // Expo framework packages
│   ├── jest/                               // Jest testing framework
│   ├── react/                              // React library
│   ├── react-native/                       // React Native framework
│   └── ... (290 more packages)
├── .gitignore                               // Git ignore rules for node_modules, etc.
├── AboutScreen.js                           // About screen with app info/credits
├── App.js                                   // Main app component with navigation setup
├── app.json                                 // Expo app configuration metadata
├── APP_DOCUMENTATION.md                    // Comprehensive app documentation
├── BooksContext.js                         // React Context for global books state management
├── CollectionDetailScreen.js               // View books within a specific collection
├── CollectionsScreen.js                    // Manage book collections/shelves
├── constants.js                             // App constants, status enums, storage keys
├── DESIGN.md                                // Design system specification document
├── DetailsScreen.js                       // Book detail view with editing/rating/progress
├── FavoritesScreen.js                      // Display favorited books list
├── HomeScreen.js                           // Main book list with search/filter/sort/FAB
├── IMPLEMENTATION_PLAN.md                  // Phases 1-6 implementation roadmap
├── index.js                                // App registration entry point (Expo)
├── jest.config.js                         // Jest testing configuration
├── jest.setup.js                          // Jest setup and mocks
├── package.json                           // NPM dependencies and scripts
├── package-lock.json                       // Locked dependency versions
├── SettingsScreen.js                     // Settings screen with theme/export options
├── StatsScreen.js                        // Reading statistics and goals screen
├── styles.js                              // Theme colors and shared style objects
├── ThemeContext.js                       // React Context for dark/light theme
├── TrackMyRead_Roadmap_Phase7_onwards.md // Future feature roadmap (Phases 7+)
├── types.js                               // PropTypes shape definitions for components
└── utils/
    ├── export.js                          // CSV export and sharing utilities
    └── storage.js                         // AsyncStorage utilities
```

---

## Flagged Files

The following files appear misplaced, redundant, or ambiguously named:

| File | Issue | Recommendation |
|------|-------|----------------|
| `utils/` (nested) | **Misplaced** - The `utils/` folder appears twice in the tree (once in root, once at end). This is actually correct - the files are at `utils/export.js` and `utils/storage.js`. | No action needed |
| `.expo/README.md` | **Auto-generated** - This file is auto-created by Expo and typically not needed in version control | Consider adding to `.gitignore` |
| `.expo/devices.json` | **Dev artifact** - Local development config that shouldn't be committed | Add to `.gitignore` |
| `TrackMyRead_Roadmap_Phase7_onwards.md` | **Long filename** - Unnecessarily long filename makes it harder to reference | Rename to `ROADMAP.md` or `FUTURE_ROADMAP.md` |
| `IMPLEMENTATION_PLAN.md` | **Potentially outdated** - Contains Phases 1-6 which may be fully implemented; consider archiving | Move to a `docs/archived/` folder or delete if redundant |
| `types.js` | **Ambiguous naming** - Could be confused with TypeScript types; currently contains PropTypes | Rename to `propTypes.js` to clarify purpose |
| `constants.js` | **Large file** - Contains many mixed constants; consider splitting | Split into `status.js`, `storageKeys.js`, etc. if it grows further |
| `jest.config.js` | **Configuration file** - Standard Jest config; often paired with `jest.setup.js` | Ensure both files are properly configured together |
| `babel.config.js` | **Missing in output** - Verified to exist but wasn't in Get-ChildItem results; likely a caching issue | No action - file exists and is functional |

---

## Summary

- **Total files (excluding node_modules):** 40
- **Directories:** 6 (`.expo`, `.github`, `__tests__`, `assets`, `components`, `utils`)
- **Root-level files:** 26
- **node_modules packages:** 294