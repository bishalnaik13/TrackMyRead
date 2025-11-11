import { StyleSheet, Appearance } from 'react-native';

const lightColors = {
  background: '#ffffff',
  text: '#121212',
  card: '#FFFFFF',
  placeholder: '#FAFAFA',
  primary: '#007aff',
  tint: '#666666',
  accent: '#E91E63',
  destructive: '#E53935',
  neutral: '#EEEEEE',
  buttonText: '#ffffff',
};

// Dark theme uses dark greys rather than pure black to keep UI pleasant
const darkColors = {
  background: '#121212', // dark grey, not pure black
  text: '#e6e6e6',
  card: '#1e1e1e',
  placeholder: '#141516',
  primary: '#0A84FF',
  tint: '#9ca3af',
  accent: '#E91E63',
  destructive: '#E53935',
  neutral: '#2a2a2a',
  buttonText: '#ffffff',
};

function makeStyles(themeName = 'light') {
  const colors = themeName === 'dark' ? darkColors : lightColors;

  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },

    empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 6, color: colors.text },
    emptySubtitle: { color: colors.tint },

    fab: {
      position: 'absolute',
      right: 20,
      bottom: 28,
      backgroundColor: colors.primary,
      width: 58,
      height: 58,
      borderRadius: 29,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 6,
    },

    modalWrapper: { flex: 1, justifyContent: 'flex-end' },
    modal: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
      padding: 16,
      maxHeight: '85%',
      elevation: 8,
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    modalTitle: { fontSize: 18, fontWeight: '600', color: colors.text },

    input: {
      borderWidth: 1,
      borderColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 10,
      backgroundColor: colors.placeholder,
      color: colors.text,
    },

    // Search bar wrapper and input. Use a slightly different background for the search bar to
    // visually separate it from cards. Placeholder color is handled via placeholderTextColor prop.
    searchWrapper: {
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.card,
    },
    searchInput: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.placeholder,
      color: colors.text,
    },

    row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    button: { flex: 1, paddingVertical: 12, marginHorizontal: 6, borderRadius: 8, alignItems: 'center' },
  // Named button variants
  buttonPrimary: { flex: 1, paddingVertical: 12, marginHorizontal: 6, borderRadius: 8, alignItems: 'center', backgroundColor: colors.primary },
  buttonNeutral: { flex: 1, paddingVertical: 12, marginHorizontal: 6, borderRadius: 8, alignItems: 'center', backgroundColor: colors.neutral },
  buttonDestructive: { flex: 1, paddingVertical: 12, marginHorizontal: 6, borderRadius: 8, alignItems: 'center', backgroundColor: colors.destructive },
  buttonText: { color: colors.buttonText, fontWeight: '600' },

    card: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 12,
      marginBottom: 10,
      elevation: 2,
      alignItems: 'center',
    },
    cardLeft: { marginRight: 12 },
    coverPlaceholder: { width: 56, height: 80, backgroundColor: colors.primary, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    cardRight: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: colors.text },
    cardMeta: { color: colors.tint },
    cardMetaSmall: { color: colors.tint, marginTop: 4 },
    cardNotes: { color: colors.text, marginTop: 8 },
  });
}

const currentScheme = Appearance.getColorScheme() || 'light';
const styles = makeStyles(currentScheme);

export { makeStyles as getStyles };
export function getColors(themeName = 'light') {
  return themeName === 'dark' ? darkColors : lightColors;
}
export default styles;
export { lightColors, darkColors };





// export default StyleSheet.create({
//   screen: { flex: 1, backgroundColor: '#fff' },
//   empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   emptyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 6 },
//   emptySubtitle: { color: '#666' },

//   fab: {
//     position: 'absolute',
//     right: 20,
//     bottom: 28,
//     backgroundColor: '#007AFF',
//     width: 58,
//     height: 58,
//     borderRadius: 29,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 6,
//   },
  

//   modalWrapper: { flex: 1, justifyContent: 'flex-end' },
//   modal: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 14,
//     borderTopRightRadius: 14,
//     padding: 16,
//     maxHeight: '85%',
//     elevation: 8,
//   },
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//   modalTitle: { fontSize: 18, fontWeight: '600' },

//   input: {
//     borderWidth: 1,
//     borderColor: '#E6E6E6',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     marginTop: 10,
//     backgroundColor: '#FAFAFA',
//   },

//   row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
//   button: {
//     flex: 1,
//     paddingVertical: 12,
//     marginHorizontal: 6,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: { color: '#fff', fontWeight: '600' },

//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 10,
//     elevation: 2,
//     alignItems: 'center',
//   },
//   cardLeft: { marginRight: 12 },
//   coverPlaceholder: {
//     width: 56,
//     height: 80,
//     backgroundColor: '#007AFF',
//     borderRadius: 6,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cardRight: { flex: 1 },
//   cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
//   cardMeta: { color: '#666' },
//   cardMetaSmall: { color: '#999', marginTop: 4 },
//   cardNotes: { color: '#444', marginTop: 8 },
// });