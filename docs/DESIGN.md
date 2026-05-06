---
# DESIGN.md - TrackMyRead Design System Specification
title: TrackMyRead
description: A mobile book tracking application built with React Native (Expo)
version: 1.0.0
last_updated: 2026-05-06

# Design Tokens

## Colors

### Light Theme
| Token | Hex Code | Usage |
|-------|----------|-------|
| background | `#ffffff` | Screen backgrounds |
| text | `#121212` | Primary text |
| card | `#FFFFFF` | Card backgrounds |
| placeholder | `#FAFAFA` | Input backgrounds |
| primary | `#007aff` | Buttons, links, active states |
| tint | `#666666` | Secondary text, icons |
| accent | `#E91E63` | Favorites, highlights |
| destructive | `#E53935` | Delete actions |
| neutral | `#EEEEEE` | Borders, dividers |
| buttonText | `#ffffff` | Text on colored buttons |

### Dark Theme
| Token | Hex Code | Usage |
|-------|----------|-------|
| background | `#121212` | Screen backgrounds (dark grey) |
| text | `#e6e6e6` | Primary text |
| card | `#282828` | Card backgrounds |
| placeholder | `#2a2a2a` | Input backgrounds |
| primary | `#0A84FF` | Buttons, links, active states |
| tint | `#9ca3af` | Secondary text, icons |
| accent | `#E91E63` | Favorites, highlights |
| destructive | `#E53935` | Delete actions |
| neutral | `#2a2a2a` | Borders, dividers |
| buttonText | `#ffffff` | Text on colored buttons |

## Typography

### Font Sizes
| Token | Value | Usage |
|-------|-------|-------|
| fontSmall | 12px | Small labels, timestamps |
| fontMedium | 14px | Body text, secondary info |
| fontLarge | 16px | Card titles, body |
| fontXLarge | 20px | Section headers |
| fontXXLarge | 22px | Screen titles |

### Font Weights
| Weight | Value | Usage |
|--------|-------|-------|
| regular | 400 | Body text |
| medium | 500 | Secondary emphasis |
| semibold | 600 | Card titles, buttons |
| bold | 700 | Headers, large titles |

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| spacingXs | 4px | Tight spacing |
| spacingSm | 8px | Between related elements |
| spacingMd | 12px | Default padding |
| spacingLg | 16px | Section spacing |
| spacingXl | 20px | Major sections |
| spacingXxl | 24px | Large gaps |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| radiusSm | 6px | Small elements, chips |
| radiusMd | 8px | Buttons, inputs |
| radiusLg | 10px | Cards |
| radiusXl | 14px | Modals |
| radiusFull | 50% | Circular buttons (FAB) |
| radiusCircle | 29px | FAB button (fixed) |

## Elevation (Shadows)

| Token | Value | Usage |
|-------|-------|-------|
| elevationLow | 2 | Card shadows |
| elevationMedium | 6 | FAB button |
| elevationHigh | 8 | Modals |

## Motion & Timing

| Token | Value | Usage |
|-------|-------|-------|
| debounceDelay | 300ms | Search input debounce |
| undoTimeout | 5000ms | Snackbar undo timer |
| animationDefault | 300ms | Default transition |

# Design Principles

## Visual Identity
TrackMyRead presents a clean, modern aesthetic inspired by iOS design patterns. The interface prioritizes readability and ease of use with generous whitespace and clear visual hierarchy.

## Theme System
The app supports both light and dark themes with consistent token mappings. Dark theme uses softer dark greys (#121212, #282828) rather than pure black for a more comfortable reading experience.

## Color Semantics
- **Primary (#007aff / #0A84FF)**: Main actions, active states, FAB
- **Accent (#E91E63)**: Favorites, hearts, highlights
- **Destructive (#E53935)**: Delete actions, warnings
- **Tint (#666666 / #9ca3af)**: Secondary content, icons, placeholders

## Layout Approach
- **Card-based**: Book items displayed in cards with cover image, title, author, and metadata
- **Bottom navigation**: Two primary tabs (Home, Favorites) with drawer for secondary screens
- **FAB positioning**: Fixed at bottom-right (right: 20, bottom: 28) for easy thumb access
- **Modal patterns**: Bottom sheets for forms and pickers

## Typography Hierarchy
1. Screen titles: 24px bold
2. Section headers: 18-20px semibold
3. Card titles: 16px semibold
4. Body text: 14px regular
5. Metadata: 12px regular

## Interactive Elements
- **Buttons**: Rounded (8px), filled variants for primary/neutral/destructive
- **Chips**: Small rounded pills (16px radius) for filters and collections
- **Touch targets**: Minimum 44x44px for accessibility compliance
- **Swipe actions**: Left swipe on cards reveals delete/favorite actions

## Iconography
Uses Ionicons from @expo/vector-icons:
- Navigation: home, heart, menu, chevron-forward
- Actions: add, trash, share, star
- Status: checkmark-circle, stats-chart
- Media: book, image, document

## Empty States
Consistent empty state component with:
- Centered icon (64px)
- Title text (18px semibold)
- Subtitle text (14px, secondary color)
- Optional action button

# Component Library

## Core Components

### BookCard
- Horizontal layout with cover thumbnail (56x80px)
- Title (semibold), author (tint), status badge
- Optional star rating display
- Optional progress bar for "Reading" status
- Favorite heart icon
- Swipe-to-delete gesture

### FAB (Floating Action Button)
- 58x58px circular
- Primary color background
- White "+" icon
- Elevation 6, positioned bottom-right
- Used for adding new books

### Modal
- Bottom sheet style with rounded top corners (14px)
- White/dark card background
- Header with title and close button
- Scrollable content area

### StatCard
- 48% width grid layout (2 columns)
- Icon (32px), large number, label
- Used in Statistics screen

### Chip/Tag
- Small rounded pill (16px radius)
- Background color changes on selection
- Used for filters and collection tags

### ProgressBar
- Thin bar (4-8px height)
- Rounded ends (2-4px radius)
- Filled portion shows completion percentage

### StarRating
- 5-star display using Ionicons
- Filled stars: #FFD700 (gold)
- Empty stars: tint color

# Accessibility Considerations
- Minimum touch target: 44x44px
- Color contrast ratios meet WCAG AA
- All interactive elements have accessibilityLabel and accessibilityRole
- Screen reader support via React Native's accessibility system