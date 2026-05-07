import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { StatusBar, View, Text, Image, AsyncStorage, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import StatsScreen from './src/screens/StatsScreen';
import CollectionsScreen from './src/screens/CollectionsScreen';
import CollectionDetailScreen from './src/screens/CollectionDetailScreen';
import ReadingNowScreen from './src/screens/ReadingNowScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import Snackbar from './src/components/Snackbar';

import { ThemeContext } from './src/context/ThemeContext';
import { BooksProvider, useBooks } from './src/context/BooksContext';
import { lightColors, darkColors } from './src/styles';
import { loadTheme, saveTheme, loadOnboardingComplete, saveOnboardingComplete } from './src/utils/storage';
import { NAVIGATION_NAMES } from './src/constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function LibraryStack({ navigation: parentNav }) {
  const { theme } = useContext(ThemeContext);
  const colors = theme === 'dark' ? darkColors : lightColors;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
        headerShown: false,
      }}
    >
      <Stack.Screen name="LibraryList">
        {(props) => <HomeScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name={NAVIGATION_NAMES.DETAILS} options={{ headerShown: false }}>
        {(props) => <DetailsScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function CollectionsStack() {
  const { theme } = useContext(ThemeContext);
  const colors = theme === 'dark' ? darkColors : lightColors;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="CollectionsList" 
        component={CollectionsScreen}
        options={{ title: 'Collections' }}
      />
      <Stack.Screen 
        name="CollectionDetail" 
        component={CollectionDetailScreen}
        options={{ title: 'Collection' }}
      />
      <Stack.Screen name={NAVIGATION_NAMES.DETAILS} options={{ headerShown: false }}>
        {(props) => <DetailsScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function ProfileStack() {
  const { theme } = useContext(ThemeContext);
  const colors = theme === 'dark' ? darkColors : lightColors;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
      <Stack.Screen 
        name="Collections" 
        component={CollectionsStack}
      />
      <Stack.Screen 
        name="Stats" 
        component={StatsScreen}
        options={{ title: 'Statistics' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{ title: 'About' }}
      />
      <Stack.Screen name={NAVIGATION_NAMES.DETAILS} options={{ headerShown: false }}>
        {(props) => <DetailsScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function TabIconWithBadge({ routeName, focused, favoritesCount }) {
  const getIconName = () => {
    if (routeName === 'Library') return focused ? 'library' : 'library-outline';
    if (routeName === 'Reading') return focused ? 'book' : 'book-outline';
    if (routeName === 'Discover') return focused ? 'compass' : 'compass-outline';
    if (routeName === 'Profile') return focused ? 'person' : 'person-outline';
    return 'ellipse';
  };

  const iconName = getIconName();
  const showBadge = routeName === 'Library' && favoritesCount > 0;

  return (
    <View style={{ position: 'relative' }}>
      <Ionicons name={iconName} size={24} color={focused ? '#007AFF' : '#666666'} />
      {showBadge && (
        <View style={{
          position: 'absolute',
          top: -4,
          right: -8,
          backgroundColor: '#E91E63',
          borderRadius: 8,
          minWidth: 16,
          height: 16,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 4,
        }}>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>
            {favoritesCount > 99 ? '99+' : favoritesCount}
          </Text>
        </View>
      )}
    </View>
  );
}

function MainTabs() {
  const { theme } = useContext(ThemeContext);
  const { getFavorites } = useBooks();
  const favoritesCount = getFavorites().length;
  const palette = theme === 'dark' ? darkColors : lightColors;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.text,
        tabBarStyle: { 
          backgroundColor: palette.card,
          borderTopColor: palette.neutral,
        },
      }}
    >
      <Tab.Screen 
        name="Library"
        component={LibraryStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconWithBadge routeName="Library" focused={focused} favoritesCount={favoritesCount} />
          ),
        }}
      />
      <Tab.Screen 
        name="Reading"
        component={ReadingNowScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconWithBadge routeName="Reading" focused={focused} favoritesCount={0} />
          ),
        }}
      />
      <Tab.Screen 
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconWithBadge routeName="Discover" focused={focused} favoritesCount={0} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIconWithBadge routeName="Profile" focused={focused} favoritesCount={0} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainApp() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { trash, undoDelete, getFavorites } = useBooks();
  const favoritesCount = getFavorites().length;
  const [onboardingComplete, setOnboardingComplete] = useState(null);

  useEffect(() => {
    (async () => {
      const savedTheme = await loadTheme();
      setTheme(savedTheme);
    })();
  }, []);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    (async () => {
      const completed = await loadOnboardingComplete();
      setOnboardingComplete(completed);
    })();
  }, []);

  const handleCompleteOnboarding = async () => {
    await saveOnboardingComplete(true);
    setOnboardingComplete(true);
  };

  const palette = theme === 'dark' ? darkColors : lightColors;
  const navTheme = {
    ...((theme === 'dark') ? DarkTheme : DefaultTheme),
    colors: {
      ...((theme === 'dark') ? DarkTheme.colors : DefaultTheme.colors),
      primary: palette.primary,
      background: palette.background,
      card: palette.card,
      text: palette.text,
      border: palette.card,
      notification: palette.accent,
    },
  };

  if (onboardingComplete === null) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer theme={navTheme}>
        {!onboardingComplete ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Onboarding">
              {(props) => (
                <OnboardingWrapper {...props} onComplete={handleCompleteOnboarding} />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        ) : (
          <MainTabs />
        )}
      </NavigationContainer>

      <Snackbar
        visible={!!trash}
        message={`"${trash?.title}" deleted`}
        actionLabel="UNDO"
        onAction={undoDelete}
        duration={5000}
      />

      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

function OnboardingWrapper({ onComplete }) {
  const { theme } = useContext(ThemeContext);
  const colors = theme === 'dark' ? darkColors : lightColors;
  const [step, setStep] = useState(0);
  const [goalInput, setGoalInput] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const { addBook } = useBooks();

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleSetGoal = async () => {
    const { saveReadingGoal } = require('./src/utils/storage');
    const goalNum = parseInt(goalInput, 10);
    if (!isNaN(goalNum) && goalNum > 0) {
      await saveReadingGoal(goalNum);
    }
    handleNext();
  };

  const handleAddFirstBook = () => {
    if (bookTitle.trim()) {
      addBook(bookTitle.trim());
    }
    onComplete();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
      {step === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <Image
            source={require('./assets/logo.png')}
            style={{ width: 120, height: 120, borderRadius: 24, marginBottom: 32 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 8, textAlign: 'center' }}>
            Welcome to TrackMyRead
          </Text>
          <Text style={{ fontSize: 15, color: colors.tint, textAlign: 'center', marginBottom: 6 }}>
            Your personal reading companion
          </Text>
          <Text style={{ fontSize: 13, color: colors.tint, textAlign: 'center', marginBottom: 40, lineHeight: 20 }}>
            Track the books you're reading,{'\n'}discover new favorites, and achieve{'\n'}your reading goals
          </Text>
          <TouchableOpacity
            style={{ 
              backgroundColor: colors.primary, 
              paddingVertical: 16, 
              paddingHorizontal: 56, 
              borderRadius: 12,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
            onPress={handleNext}
          >
            <Text style={{ color: colors.buttonText, fontSize: 18, fontWeight: '600' }}>
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 1 && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <Text style={{ fontSize: 24, fontWeight: '600', color: colors.text, marginBottom: 24, textAlign: 'center' }}>
            How many books do you want to read this year?
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 40 }}>
            <TextInput
              value={goalInput}
              onChangeText={setGoalInput}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.tint}
              style={{ 
                fontSize: 48, 
                fontWeight: '700', 
                color: colors.primary, 
                textAlign: 'center',
                minWidth: 80,
                borderBottomWidth: 2,
                borderBottomColor: colors.primary,
              }}
            />
            <Text style={{ fontSize: 18, color: colors.tint, marginLeft: 8 }}>books</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity 
              style={{ paddingVertical: 14, paddingHorizontal: 24 }}
              onPress={handleSkip}
            >
              <Text style={{ color: colors.primary, fontSize: 16 }}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, marginLeft: 16 }}
              onPress={handleSetGoal}
            >
              <Text style={{ color: colors.buttonText, fontSize: 16, fontWeight: '600' }}>Continue</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {step === 2 && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <Text style={{ fontSize: 24, fontWeight: '600', color: colors.text, marginBottom: 24, textAlign: 'center' }}>
            Add your first book
          </Text>
          <Text style={{ fontSize: 14, color: colors.tint, marginBottom: 16, textAlign: 'center' }}>
            Enter the title of a book you're excited to read
          </Text>
          <TextInput
            value={bookTitle}
            onChangeText={setBookTitle}
            placeholder="Book title"
            placeholderTextColor={colors.tint}
            style={{ 
              width: '100%',
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.neutral,
              backgroundColor: colors.card,
              color: colors.text,
              fontSize: 16,
              marginBottom: 40,
            }}
          />
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity 
              style={{ paddingVertical: 14, paddingHorizontal: 24 }}
              onPress={handleSkip}
            >
              <Text style={{ color: colors.primary, fontSize: 16 }}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, marginLeft: 16 }}
              onPress={handleAddFirstBook}
            >
              <Text style={{ color: colors.buttonText, fontSize: 16, fontWeight: '600' }}>Add Book</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

export default function App() {
  const [theme, setTheme] = useState('light');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <BooksProvider>
          <MainApp />
        </BooksProvider>
      </ThemeContext.Provider>
    </GestureHandlerRootView>
  );
}