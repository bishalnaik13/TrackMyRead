import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProgressBottomSheet({ visible, book, onClose, onSave, calculateProgress, colors }) {
  const [currentPage, setCurrentPage] = useState(book?.currentPage?.toString() || '');
  const [totalPages, setTotalPages] = useState(book?.totalPages?.toString() || '');
  const progressWidth = useRef(new Animated.Value(0)).current;

  if (!book) return null;

  useEffect(() => {
    if (visible && currentPage && totalPages) {
      const progress = calculateProgress(
        parseInt(currentPage, 10) || 0,
        parseInt(totalPages, 10) || 0
      );
      Animated.timing(progressWidth, {
        toValue: progress,
        duration: 600,
        useNativeDriver: false,
      }).start();
    } else {
      progressWidth.setValue(0);
    }
  }, [visible, currentPage, totalPages]);

  const handleSave = () => {
    const current = parseInt(currentPage, 10) || 0;
    const total = parseInt(totalPages, 10) || 0;
    onSave(book.id, current, total);
    setCurrentPage('');
    setTotalPages('');
  };

  const progress = calculateProgress(
    parseInt(currentPage, 10) || 0,
    parseInt(totalPages, 10) || 0
  );

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
              Update Progress
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.tint} />
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
            {book.title}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={{ fontSize: 12, color: colors.tint, marginBottom: 4 }}>Current Page</Text>
              <TextInput
                value={currentPage}
                onChangeText={setCurrentPage}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.tint}
                style={{
                  borderWidth: 1,
                  borderColor: colors.neutral,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.text,
                  fontSize: 16,
                }}
              />
            </View>
            <Text style={{ fontSize: 16, color: colors.tint, marginTop: 20 }}>of</Text>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 12, color: colors.tint, marginBottom: 4 }}>Total Pages</Text>
              <TextInput
                value={totalPages}
                onChangeText={setTotalPages}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.tint}
                style={{
                  borderWidth: 1,
                  borderColor: colors.neutral,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.text,
                  fontSize: 16,
                }}
              />
            </View>
          </View>

          {progress > 0 && (
            <View style={{ marginBottom: 20 }}>
              <View style={{ height: 8, backgroundColor: colors.neutral, borderRadius: 4, overflow: 'hidden' }}>
                <Animated.View 
                  style={{ 
                    height: 8, 
                    width: progressWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: colors.primary, 
                    borderRadius: 4 
                  }} 
                />
              </View>
              <Text style={{ fontSize: 12, color: colors.tint, marginTop: 4, textAlign: 'center' }}>
                {progress}% complete
              </Text>
            </View>
          )}

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
              Save Progress
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}