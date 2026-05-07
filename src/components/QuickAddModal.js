import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QuickAddModal({ visible, onClose, onSave, colors }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a book title');
      return;
    }
    onSave({ title: title.trim(), author: author.trim() });
    setTitle('');
    setAuthor('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end' }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onTouchEnd={onClose} />
        <View style={{ 
          backgroundColor: colors.card, 
          borderTopLeftRadius: 20, 
          borderTopRightRadius: 20,
          padding: 20,
          paddingBottom: 40,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
              Quick Add Book
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.tint} />
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>Title *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter book title"
            placeholderTextColor={colors.tint}
            style={{
              borderWidth: 1,
              borderColor: colors.neutral,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 12,
              color: colors.text,
              fontSize: 16,
              marginBottom: 16,
            }}
          />

          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>Author</Text>
          <TextInput
            value={author}
            onChangeText={setAuthor}
            placeholder="Enter author name"
            placeholderTextColor={colors.tint}
            style={{
              borderWidth: 1,
              borderColor: colors.neutral,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 12,
              color: colors.text,
              fontSize: 16,
              marginBottom: 20,
            }}
          />

          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.buttonText, fontSize: 16, fontWeight: '600' }}>
              Add to "To Read"
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}