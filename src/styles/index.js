import { StyleSheet, Appearance } from 'react-native';

const lightColors = {
  background: '#F5F5F7',
  text: '#1C1C1E',
  card: '#FFFFFF',
  placeholder: '#F2F2F7',
  primary: '#007AFF',
  tint: '#8E8E93',
  accent: '#FF2D55',
  destructive: '#FF3B30',
  neutral: '#E5E5EA',
  buttonText: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
  dynamicAccent: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  gold: '#FFD700',
};

const darkColors = {
  background: '#000000',
  text: '#FFFFFF',
  card: '#1C1C1E',
  placeholder: '#2C2C2E',
  primary: '#0A84FF',
  tint: '#8E8E93',
  accent: '#FF375F',
  destructive: '#FF453A',
  neutral: '#38383A',
  buttonText: '#FFFFFF',
  glass: 'rgba(28, 28, 30, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  dynamicAccent: '#5E5CE6',
  success: '#30D158',
  warning: '#FF9F0A',
  gold: '#FFD700',
};

// Phase 19 - Glass tokens for tab bar
export function getGlassTokens(themeName = 'light') {
  return themeName === 'dark' ? {
    tabBarBg: 'rgba(20,20,22,0.58)',
    tabBarTint: 'rgba(20,20,22,0.58)',
    tabBarBorder: 'rgba(255,255,255,0.10)',
    tabBarGlow: 'rgba(10,132,255,0.35)',
    tabBarGlowColor: 'rgba(10,132,255,0.42)',
    tabActiveChip: 'rgba(255,255,255,0.08)',
    activeCapsule: 'rgba(255,255,255,0.08)',
    activeCapsuleBorder: 'rgba(255,255,255,0.10)',
    inputBg: 'rgba(40,40,40,0.65)',
    inputBorder: 'rgba(255,255,255,0.08)',
    inputFocusGlow: 'rgba(10,132,255,0.20)',
    chipBg: 'rgba(255,255,255,0.08)',
    chipBorder: 'rgba(255,255,255,0.10)',
    cardBg: 'rgba(38,38,40,0.80)',
    cardBorder: 'rgba(255,255,255,0.09)',
  } : {
    tabBarBg: 'rgba(255,255,255,0.42)',
    tabBarTint: 'rgba(255,255,255,0.42)',
    tabBarBorder: 'rgba(255,255,255,0.55)',
    tabBarGlow: 'rgba(0,122,255,0.22)',
    tabBarGlowColor: 'rgba(0,122,255,0.28)',
    tabActiveChip: 'rgba(0,122,255,0.12)',
    activeCapsule: 'rgba(255,255,255,0.22)',
    activeCapsuleBorder: 'rgba(255,255,255,0.35)',
    inputBg: 'rgba(255,255,255,0.72)',
    inputBorder: 'rgba(255,255,255,0.30)',
    inputFocusGlow: 'rgba(0,122,255,0.15)',
    chipBg: 'rgba(255,255,255,0.40)',
    chipBorder: 'rgba(255,255,255,0.25)',
    cardBg: 'rgba(255,255,255,0.82)',
    cardBorder: 'rgba(255,255,255,0.50)',
  };
}

function makeStyles(themeName = 'light') {
  const colors = themeName === 'dark' ? darkColors : lightColors;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 6, color: colors.text },
    emptySubtitle: { color: colors.tint },

    fab: {
      position: 'absolute',
      right: 20,
      bottom: 100,
      backgroundColor: colors.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },

    modalWrapper: { flex: 1, justifyContent: 'flex-end' },
    modal: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '85%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    modalTitle: { fontSize: 20, fontWeight: '600', color: colors.text },

    input: {
      borderWidth: 1,
      borderColor: colors.neutral,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginTop: 12,
      backgroundColor: colors.placeholder,
      color: colors.text,
      fontSize: 16,
    },

    searchWrapper: {
      borderRadius: 24,
      overflow: 'hidden',
      height: 48,
      borderWidth: 1,
      borderColor: colors.neutral,
    },
    searchInput: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: colors.text,
      fontSize: 16,
    },

    row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    button: { flex: 1, paddingVertical: 14, marginHorizontal: 6, borderRadius: 12, alignItems: 'center' },
    buttonPrimary: { flex: 1, paddingVertical: 14, marginHorizontal: 6, borderRadius: 12, alignItems: 'center', backgroundColor: colors.primary },
    buttonNeutral: { flex: 1, paddingVertical: 14, marginHorizontal: 6, borderRadius: 12, alignItems: 'center', backgroundColor: colors.neutral },
    buttonDestructive: { flex: 1, paddingVertical: 14, marginHorizontal: 6, borderRadius: 12, alignItems: 'center', backgroundColor: colors.destructive },
    buttonText: { color: colors.buttonText, fontWeight: '600', fontSize: 16 },

    card: {
      flexDirection: 'row',
      backgroundColor: themeName === 'dark' ? 'rgba(38,38,40,0.80)' : 'rgba(255,255,255,0.82)',
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: themeName === 'dark' ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.50)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: themeName === 'dark' ? 0.02 : 0.06,
      shadowRadius: 12,
      elevation: 3,
      alignItems: 'center',
      position: 'relative',
    },
    cardLeft: { marginRight: 14 },
    coverPlaceholder: { width: 60, height: 90, backgroundColor: colors.primary, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    coverImage: { width: 60, height: 90, borderRadius: 10 },
    cardRight: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: colors.text },
    cardMeta: { color: colors.tint, fontSize: 13 },
    cardMetaSmall: { color: colors.tint, marginTop: 4, fontSize: 12 },
    cardNotes: { color: colors.text, marginTop: 10, fontSize: 14 },
    swipeActions: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    swipeAction: {
      width: 80,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
    },
    cardActions: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}

export { makeStyles as getStyles };
export function getColors(themeName = 'light') {
  return themeName === 'dark' ? darkColors : lightColors;
}
export { lightColors, darkColors };