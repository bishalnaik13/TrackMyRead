import React from 'react';

export const ThemeContext = React.createContext({
    theme: 'light',
    themeMode: 'light',
    setTheme: () => {},
    setThemeMode: () => {},
});

export const THEME_MODES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
};