import React, { useContext, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, Alert, ActivityIndicator, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles, getColors } from '../styles';
import { ThemeContext } from '../context/ThemeContext';
import { useBooks } from '../context/BooksContext';
import { exportBooks, validateImportData, mergeBooks } from '../utils/storage';
import { writeAndShareCSV } from '../utils/export';

export default function SettingsScreen() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { books, setBooks } = useBooks();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const styles = getStyles(theme);
  const colors = getColors(theme);

  async function handleExport() {
    setExporting(true);
    try {
      const jsonData = await exportBooks(books);
      await Share.share({
        message: jsonData,
        title: 'Export Book Library',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export library: ' + error.message);
    }
    setExporting(false);
  }

  async function handleCSVExport() {
    setExporting(true);
    try {
      const success = await writeAndShareCSV(books);
      if (!success) {
        Alert.alert('Error', 'Failed to export library');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export library');
    }
    setExporting(false);
  }

  async function handleImport() {
    Alert.alert(
      'Import Library',
      'This will replace your current library. Do you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Replace', onPress: () => doImport('replace') },
        { text: 'Merge', onPress: () => doImport('merge') },
      ]
    );
  }

  async function doImport(mode) {
    setImporting(true);
    Alert.alert('Info', 'JSON import is temporarily unavailable. Please use CSV export for now.');
    setImporting(false);
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={[
        styles.screen,
        { paddingHorizontal: 16, paddingTop: 8 }]}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral,
      }}>
        <Text style={{ color: colors.text, fontSize: 16 }} accessibilityRole="text">Dark Mode</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={(v) => setTheme(v ? 'dark' : 'light')}
          accessibilityLabel="Toggle dark mode"
          accessibilityRole="switch"
          accessibilityState={{ checked: theme === 'dark' }}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={{ color: colors.text, fontSize: 16, marginBottom: 12 }}>Data Management</Text>
        
        <TouchableOpacity
          onPress={handleExport}
          disabled={exporting}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.neutral }}
          accessibilityLabel="Export library"
          accessibilityRole="button"
        >
          {exporting ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={{ color: colors.primary, fontSize: 15 }}>Export Library (JSON)</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCSVExport}
          disabled={exporting}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.neutral }}
          accessibilityLabel="Export library as CSV"
          accessibilityRole="button"
        >
          <Text style={{ color: colors.primary, fontSize: 15 }}>Export Library (CSV)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleImport}
          disabled={importing}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
          accessibilityLabel="Import library"
          accessibilityRole="button"
        >
          {importing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={{ color: colors.primary, fontSize: 15 }}>Import Library (JSON)</Text>
          )}
        </TouchableOpacity>

        <Text style={{ color: colors.tint, fontSize: 12, marginTop: 12 }}>
          Export creates a JSON backup of your library. Import allows you to restore from a backup or merge with existing books.
        </Text>
      </View>
    </SafeAreaView>
  );
}