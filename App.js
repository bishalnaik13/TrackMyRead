import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, AsyncStorage } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import StatsScreen from './src/screens/StatsScreen';
import CollectionsScreen from './src/screens/CollectionsScreen';
import CollectionDetailScreen from './src/screens/CollectionDetailScreen';
import Snackbar from './src/components/Snackbar';

import { ThemeContext } from './src/context/ThemeContext';
import { BooksProvider, useBooks } from './src/context/BooksContext';
import { lightColors, darkColors } from './src/styles';
import { loadTheme, saveTheme, clearAllData } from './src/utils/storage';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack({ navigation: parentNav }) {
  const { theme } = useContext(ThemeContext);
  const colors = theme === 'dark' ? darkColors : lightColors;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
        headerLeft: ({ tintColor }) => (
          <TouchableOpacity
            onPress={() => parentNav?.getParent()?.openDrawer()}
            style={{ paddingLeft: 12 }}
            accessibilityLabel="Open navigation menu"
            accessibilityRole="button"
          >
            <Ionicons name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
        )
      }}>
      <Stack.Screen name="HomeList" options={{ title: "My Books" }}>
        {(props) => <HomeScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Details" options={{ title: "Details" }}>
        {(props) => <DetailsScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function TabIconWithBadge({ routeName, focused, favoritesCount }) {
  const getIconName = () => {
    if (routeName === 'Home') return focused ? 'home' : 'home-outline';
    if (routeName === 'Favorites') return focused ? 'heart' : 'heart-outline';
    return 'ellipse';
  };

  const iconName = getIconName();
  const showBadge = routeName === 'Favorites' && favoritesCount > 0;

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

function MainApp() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { trash, undoDelete, getFavorites } = useBooks();
  const favoritesCount = getFavorites().length;

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
      const hasMigrated = await AsyncStorage.getItem('@restructure_migrated');
      if (!hasMigrated) {
        await clearAllData();
        await AsyncStorage.setItem('@restructure_migrated', 'true');
      }
    })();
  }, []);

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

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer theme={navTheme}>
        <Drawer.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerShown: false,
            drawerPosition: 'left',
            drawerStyle: { width: '70%' },
            overlayColor: 'rgba(0,0,0,0.35)',
          }}
        >
          <Drawer.Screen name="Main">
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  headerTitleAlign: 'center',
                  tabBarActiveTintColor: navTheme.colors.primary,
                  tabBarInactiveTintColor: navTheme.colors.text,
                  tabBarStyle: { backgroundColor: navTheme.colors.card },
                }}
              >
                <Tab.Screen 
                  name="Home"
                  component={HomeStack}
                  options={{
                    tabBarIcon: ({ focused }) => (
                      <TabIconWithBadge routeName="Home" focused={focused} favoritesCount={favoritesCount} />
                    ),
                  }}
                />
                <Tab.Screen 
                  name="Favorites" 
                  component={FavoritesScreen}
                  options={{ 
                    headerShown: true,
                    tabBarIcon: ({ focused }) => (
                      <TabIconWithBadge routeName="Favorites" focused={focused} favoritesCount={favoritesCount} />
                    ),
                  }}
                />
              </Tab.Navigator>
            )}
          </Drawer.Screen>
          <Drawer.Screen
            name="Settings"
            options={{
              headerShown: true,
              headerTitleAlign: 'center',
              title: 'Settings',
              headerStyle: { backgroundColor: palette.card },
              headerTintColor: palette.text,
            }}>
            {(props) => <SettingsScreen {...props} />}
          </Drawer.Screen>
          <Drawer.Screen
            name="Stats"
            options={{
              headerShown: true,
              headerTitleAlign: 'center',
              title: 'Statistics',
              headerStyle: { backgroundColor: palette.card },
              headerTintColor: palette.text,
            }}>
            {(props) => <StatsScreen {...props} />}
          </Drawer.Screen>
          <Drawer.Screen
            name="Collections"
            options={{
              headerShown: true,
              headerTitleAlign: 'center',
              title: 'Collections',
              headerStyle: { backgroundColor: palette.card },
              headerTintColor: palette.text,
            }}>
            {() => (
              <Stack.Navigator>
                <Stack.Screen name="CollectionsList">
                  {(props) => <CollectionsScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="CollectionDetail">
                  {(props) => <CollectionDetailScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="Details">
                  {(props) => <DetailsScreen {...props} />}
                </Stack.Screen>
              </Stack.Navigator>
            )}
          </Drawer.Screen>
          <Drawer.Screen
            name="About"
            options={{
              headerShown: true,
              headerTitleAlign: 'center',
              title: 'About',
              headerStyle: { backgroundColor: palette.card },
              headerTintColor: palette.text,
            }}>
            {(props) => <AboutScreen {...props} />}
          </Drawer.Screen>
        </Drawer.Navigator>
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