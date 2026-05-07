import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../styles';

export default function EmptyState({ 
  icon = 'book-outline', 
  title, 
  subtitle, 
  actionLabel, 
  onAction,
  theme = 'light'
}) {
  const colors = getColors(theme);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Ionicons name={icon} size={64} color={colors.tint} />
      <Text style={{ 
        fontSize: 20, 
        fontWeight: '600', 
        color: colors.text, 
        marginTop: 16,
        textAlign: 'center' 
      }}>
        {title}
      </Text>
      {subtitle && (
        <Text style={{ 
          color: colors.tint, 
          marginTop: 8, 
          textAlign: 'center',
          fontSize: 14 
        }}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <TouchableOpacity
          style={{
            marginTop: 20,
            paddingVertical: 12,
            paddingHorizontal: 24,
            backgroundColor: colors.primary,
            borderRadius: 12,
          }}
          onPress={onAction}
        >
          <Text style={{ color: colors.buttonText, fontWeight: '600' }}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}