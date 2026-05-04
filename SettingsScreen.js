import React, { useContext, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getStyles, getColors } from './styles';
import { ThemeContext } from './ThemeContext';
import { useBooks } from './BooksContext';
import { exportBooks, validateImportData, mergeBooks } from './utils/storage';

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
      const fileUri = FileSystem.documentDirectory + 'trackmyread_backup.json';
      await FileSystem.writeAsStringAsync(fileUri, jsonData);
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Book Library',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export library: ' + error.message);
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
    try {
      const fileUri = FileSystem.documentDirectory + 'trackmyread_backup.json';
      const exists = await FileSystem.getInfoAsync(fileUri);
      
      if (!exists.exists) {
        const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        const backupFile = files.find(f => f.endsWith('.json'));
        
        if (!backupFile) {
          Alert.alert('Error', 'No backup file found. Please share a JSON file first.');
          setImporting(false);
          return;
        }
      }

      const content = await FileSystem.readAsStringAsync(fileUri);
      const validation = validateImportData(content);

      if (!validation.valid) {
        Alert.alert('Error', validation.error);
        setImporting(false);
        return;
      }

      const mergedBooks = mergeBooks(books, validation.books, mode);
      setBooks(mergedBooks);
      Alert.alert('Success', `Imported ${validation.books.length} books (${mode} mode)`);
    } catch (error) {
      Alert.alert('Error', 'Failed to import library. Make sure you have a valid backup file.');
    }
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