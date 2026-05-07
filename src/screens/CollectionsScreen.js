import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getStyles, getColors } from '../styles';
import { ThemeContext } from '../context/ThemeContext';
import { useBooks } from '../context/BooksContext';
import { MAX_COLLECTION_NAME_LENGTH } from '../constants';
import EmptyState from '../components/EmptyState';

export default function CollectionsScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { collections, addCollection, deleteCollection, getBooksInCollection, renameCollection } = useBooks();
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const styles = getStyles(theme);
  const colors = getColors(theme);

  const handleCreate = () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Please enter a collection name');
      return;
    }
    if (newName.trim().length > MAX_COLLECTION_NAME_LENGTH) {
      Alert.alert('Error', `Name must be ${MAX_COLLECTION_NAME_LENGTH} characters or less`);
      return;
    }
    addCollection(newName.trim());
    setNewName('');
    setShowModal(false);
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      'Delete Collection',
      `Are you sure you want to delete "${name}"? Books will not be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCollection(id) },
      ]
    );
  };

  const handleRename = (id, name) => {
    setEditingId(id);
    setEditName(name);
    setShowModal(true);
  };

  const handleSaveRename = () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Please enter a collection name');
      return;
    }
    if (editName.trim().length > MAX_COLLECTION_NAME_LENGTH) {
      Alert.alert('Error', `Name must be ${MAX_COLLECTION_NAME_LENGTH} characters or less`);
      return;
    }
    renameCollection(editingId, editName.trim());
    setEditingId(null);
    setEditName('');
    setShowModal(false);
  };

  const renderItem = ({ item }) => {
    const bookCount = getBooksInCollection(item.id).length;
    return (
      <TouchableOpacity
        style={[styles.card, { marginBottom: 12 }]}
        onPress={() => navigation.navigate('CollectionDetail', { collectionId: item.id, collectionName: item.name })}
        accessibilityLabel={`View collection: ${item.name}`}
        accessibilityRole="button"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { fontSize: 16 }]}>{item.name}</Text>
            <Text style={[styles.cardMeta, { marginTop: 4 }]}>{bookCount} book{bookCount !== 1 ? 's' : ''}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => handleRename(item.id, item.name)}
              style={{ padding: 8 }}
              accessibilityLabel={`Rename collection ${item.name}`}
            >
              <Ionicons name="pencil" size={20} color={colors.tint} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.id, item.name)}
              style={{ padding: 8 }}
              accessibilityLabel={`Delete collection ${item.name}`}
            >
              <Ionicons name="trash-outline" size={20} color={colors.destructive} />
            </TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} color={colors.tint} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      <FlatList
        data={collections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={
          <EmptyState
            icon="folder-outline"
            title="No collections yet"
            subtitle="Create collections to organize your books"
            actionLabel="Create Collection"
            onAction={() => setShowModal(true)}
            theme={theme}
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingId(null);
          setNewName('');
          setShowModal(true);
        }}
        accessibilityLabel="Create new collection"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={28} color={colors.buttonText} />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
              {editingId ? 'Rename Collection' : 'New Collection'}
            </Text>
            <TextInput
              value={editingId ? editName : newName}
              onChangeText={editingId ? setEditName : setNewName}
              placeholder="Collection name"
              placeholderTextColor={colors.tint}
              maxLength={MAX_COLLECTION_NAME_LENGTH}
              style={{
                borderWidth: 1,
                borderColor: colors.neutral,
                borderRadius: 8,
                padding: 12,
                color: colors.text,
                backgroundColor: colors.background,
              }}
              autoFocus
            />
            <Text style={{ color: colors.tint, fontSize: 12, marginTop: 4, textAlign: 'right' }}>
              {(editingId ? editName : newName).length}/{MAX_COLLECTION_NAME_LENGTH}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => { 
                  setEditingId(null);
                  setNewName(''); 
                  setEditName('');
                  setShowModal(false); 
                }}
                style={{ paddingVertical: 12, paddingHorizontal: 20 }}
              >
                <Text style={{ color: colors.tint }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={editingId ? handleSaveRename : handleCreate}
                style={{ backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 }}
              >
                <Text style={{ color: colors.buttonText, fontWeight: '600' }}>{editingId ? 'Save' : 'Create'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}