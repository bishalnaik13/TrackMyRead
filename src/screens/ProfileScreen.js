import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getStyles, getColors, getGlassTokens } from '../styles';
import { ThemeContext } from '../context/ThemeContext';
import { useBooks } from '../context/BooksContext';
import { loadReadingGoal, saveReadingGoal } from '../utils/storage';

export default function ProfileScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { calculateStreak, getCurrentlyReading, books } = useBooks();
  const [readingGoal, setReadingGoal] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  
  const styles = getStyles(theme);
  const colors = getColors(theme);
  
  const streak = calculateStreak();
  const currentlyReading = getCurrentlyReading();
  const totalBooks = books.length;
  const completedBooks = books.filter(b => b.status === 'completed').length;

  useEffect(() => {
    (async () => {
      const goal = await loadReadingGoal();
      setReadingGoal(goal);
    })();
  }, []);

  const handleSaveGoal = async () => {
    const goalNum = parseInt(goalInput, 10);
    if (isNaN(goalNum) || goalNum <= 0) {
      Alert.alert('Invalid Goal', 'Please enter a valid number');
      return;
    }
    await saveReadingGoal(goalNum);
    setReadingGoal(goalNum);
    setShowGoalModal(false);
    setGoalInput('');
  };

  const goalProgress = readingGoal ? Math.min(100, Math.round((completedBooks / readingGoal) * 100)) : 0;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      <LinearGradient colors={getGlassTokens(theme).screenGradient} style={StyleSheet.absoluteFill} />
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 24 }}>
          Profile
        </Text>

        {streak > 0 && (
          <View style={{ 
            backgroundColor: colors.card, 
            padding: 16, 
            borderRadius: 12, 
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="flame" size={24} color="#FF6B35" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginLeft: 8 }}>
              {streak} day{streak !== 1 ? 's' : ''} reading streak
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={{ marginBottom: 16 }}
          onPress={() => {
            setGoalInput(readingGoal?.toString() || '');
            setShowGoalModal(true);
          }}
        >
          <View style={[styles.card, { padding: 16 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Reading Goal</Text>
              <Ionicons name="pencil" size={18} color={colors.tint} />
            </View>
            {readingGoal ? (
              <>
                <View style={{ height: 12, backgroundColor: colors.neutral, borderRadius: 6, overflow: 'hidden' }}>
                  <View 
                    style={{ 
                      height: 12, 
                      width: `${goalProgress}%`, 
                      backgroundColor: goalProgress >= 100 ? colors.accent : colors.primary, 
                      borderRadius: 6 
                    }} 
                  />
                </View>
                <Text style={{ fontSize: 12, color: colors.tint, marginTop: 6 }}>
                  {completedBooks} of {readingGoal} books ({goalProgress}%)
                </Text>
              </>
            ) : (
              <Text style={{ color: colors.tint, fontSize: 14 }}>Tap to set your yearly goal</Text>
            )}
          </View>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
          <TouchableOpacity 
            style={{ width: '50%', padding: 6 }}
            onPress={() => navigation.navigate('Stats')}
          >
            <View style={[styles.card, { alignItems: 'center', padding: 20 }]}>
              <Ionicons name="stats-chart" size={28} color={colors.primary} />
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginTop: 8 }}>
                {totalBooks}
              </Text>
              <Text style={{ fontSize: 12, color: colors.tint }}>Books</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ width: '50%', padding: 6 }}
            onPress={() => navigation.navigate('Collections')}
          >
            <View style={[styles.card, { alignItems: 'center', padding: 20 }]}>
              <Ionicons name="folder" size={28} color={colors.primary} />
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginTop: 8 }}>
                {currentlyReading.length}
              </Text>
              <Text style={{ fontSize: 12, color: colors.tint }}>Reading</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={{ marginTop: 16 }}
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', padding: 16 }]}>
            <Ionicons name="settings" size={24} color={colors.text} />
            <Text style={{ fontSize: 16, color: colors.text, marginLeft: 12 }}>Settings</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ marginTop: 8 }}
          onPress={() => navigation.navigate('About')}
        >
          <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', padding: 16 }]}>
            <Ionicons name="information-circle" size={24} color={colors.text} />
            <Text style={{ fontSize: 16, color: colors.text, marginLeft: 12 }}>About</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal visible={showGoalModal} transparent animationType="fade" onRequestClose={() => setShowGoalModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
              {readingGoal ? 'Edit Reading Goal' : 'Set Reading Goal'}
            </Text>
            <Text style={{ color: colors.tint, marginBottom: 16 }}>
              How many books do you want to read this year?
            </Text>
            <TextInput
              value={goalInput}
              onChangeText={setGoalInput}
              keyboardType="numeric"
              placeholder="e.g., 24"
              placeholderTextColor={colors.tint}
              style={{
                borderWidth: 1,
                borderColor: colors.neutral,
                borderRadius: 8,
                padding: 12,
                color: colors.text,
                fontSize: 18,
                marginBottom: 20,
              }}
              autoFocus
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {readingGoal && (
                <TouchableOpacity
                  onPress={async () => {
                    await saveReadingGoal(null);
                    setReadingGoal(null);
                    setShowGoalModal(false);
                    setGoalInput('');
                  }}
                  style={{ paddingVertical: 12, paddingHorizontal: 16 }}
                >
                  <Text style={{ color: colors.destructive }}>Remove Goal</Text>
                </TouchableOpacity>
              )}
              <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
                <TouchableOpacity
                  onPress={() => {
                    setGoalInput('');
                    setShowGoalModal(false);
                  }}
                  style={{ paddingVertical: 12, paddingHorizontal: 16 }}
                >
                  <Text style={{ color: colors.tint }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveGoal}
                  style={{ backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginLeft: 8 }}
                >
                  <Text style={{ color: colors.buttonText, fontWeight: '600' }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}