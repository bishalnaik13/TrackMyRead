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
};

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
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.neutral,
    },
    searchInput: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colors.card,
      color: colors.text,
    },

    row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    button: { flex: 1, paddingVertical: 14, marginHorizontal: 6, borderRadius: 12, alignItems: 'center' },
    buttonPrimary: { flex: 1, paddingVertical: 14, marginHorizontal: 6, borderRadius: 12, alignItems: 'center', backgroundColor: colors.primary },
    buttonNeutral: { flex: 1, paddingVertical: 14, marginHorizontal: 6, borderRadius: 12, alignItems: 'center', backgroundColor: colors.neutral },
    buttonDestructive: { flex: 1, paddingVertical: 14, marginHorizontal: 6, borderRadius: 12, alignItems: 'center', backgroundColor: colors.destructive },
    buttonText: { color: colors.buttonText, fontWeight: '600', fontSize: 16 },

    card: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      alignItems: 'center',
    },
    cardLeft: { marginRight: 14 },
    coverPlaceholder: { width: 60, height: 90, backgroundColor: colors.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    coverImage: { width: 60, height: 90, borderRadius: 8 },
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
  });
}

export { makeStyles as getStyles };
export function getColors(themeName = 'light') {
  return themeName === 'dark' ? darkColors : lightColors;
}
export { lightColors, darkColors };